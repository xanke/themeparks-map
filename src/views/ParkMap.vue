<template>
  <div class="park-map-page">
    <template v-if="park">
      <Map
        ref="mapRef"
        style="width: 100%; height: 100vh"
        :crs="park.crs"
        :layerUrl="layerUrl"
        :center="park.center"
      />

      <div class="toolbar">
        <a-button type="primary" @click="goHome">
          <template #icon><ArrowLeftOutlined /></template>
          返回首页
        </a-button>

        <span class="toolbar-title">{{ park.label }}</span>

        <a-select
          v-if="hasVersions"
          v-model:value="currentVersion"
          class="toolbar-version"
          style="width: 160px"
          :options="versionOptions"
        />

        <a-button :loading="downloading" @click="handleDownload">
          <template #icon><DownloadOutlined /></template>
          下载地图
        </a-button>
      </div>
    </template>

    <template v-else>
      <a-result status="404" title="乐园不存在" sub-title="请返回首页选择一个乐园">
        <template #extra>
          <a-button type="primary" @click="goHome">返回首页</a-button>
        </template>
      </a-result>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import Map from '@/components/Map/Map.vue'
import { getPark, getLayerUrl } from '@/data/themeparks'

const route = useRoute()
const router = useRouter()

const park = computed(() => getPark(route.params.id))

const mapRef = ref(null)
const downloading = ref(false)

// 当前版本，默认为最新版本（versions 数组最后一项）
const currentVersion = ref(null)

// 当乐园切换时重置版本
watch(
  () => route.params.id,
  () => {
    currentVersion.value = null
  },
  { immediate: true }
)

const hasVersions = computed(() => park.value?.versions?.length > 0)

const versionOptions = computed(() =>
  (park.value?.versions || []).map((v) => ({
    value: v,
    label: `版本 ${v}`
  }))
)

// 根据当前版本计算瓦片 URL
const layerUrl = computed(() => {
  if (!park.value) return ''
  return getLayerUrl(park.value, currentVersion.value)
})

const goHome = () => {
  router.push('/')
}

// 一键下载当前地图视图
const handleDownload = async () => {
  if (!mapRef.value || downloading.value) return
  downloading.value = true
  try {
    const map = mapRef.value.getMapInstance()
    const zoom = map ? map.getZoom() : ''
    const versions = park.value?.versions || []
    const version = currentVersion.value ?? versions[versions.length - 1] ?? 'latest'
    const filename = `${park.value.value}-v${version}-z${zoom}.png`
    await mapRef.value.downloadMapAsImage(filename)
    message.success('地图已开始下载')
  } catch (e) {
    message.error(e?.message || '地图导出失败')
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.park-map-page {
  position: relative;
  width: 100%;
  height: 100vh;
}

.toolbar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
