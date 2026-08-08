<template>
  <div class="home">
    <div class="home-header">
      <h1>主题乐园地图</h1>
      <p>选择一个乐园查看高清地图</p>
    </div>

    <div v-for="group in groups" :key="group.tag" class="home-group">
      <h2 class="home-group-title">{{ group.name }}</h2>
      <a-row :gutter="[16, 16]">
        <a-col v-for="park in group.parks" :key="park.value" :xs="24" :sm="12" :md="8" :lg="6">
          <a-card hoverable class="park-card" @click="goPark(park.value)">
            <template #title>
              <span class="park-card-title">{{ park.label }}</span>
            </template>
            <template #extra>
              <a-tag v-if="park.versions && park.versions.length > 0" color="blue">
                {{ park.versions.length }} 个版本
              </a-tag>
            </template>
            <p class="park-card-desc">点击查看地图</p>
            <a
              v-if="park.officialUrl"
              class="park-card-link"
              :href="park.officialUrl"
              target="_blank"
              rel="noopener"
              @click.stop
            >
              <LinkOutlined /> 官网地图
            </a>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LinkOutlined } from '@ant-design/icons-vue'
import { THEMEPARKS, TAG_NAMES } from '@/data/themeparks'

const router = useRouter()

// 按 tags 分组
const groups = computed(() => {
  const map = new Map()
  THEMEPARKS.forEach((park) => {
    const tag = park.tags?.[0] || 'other'
    if (!map.has(tag)) {
      map.set(tag, [])
    }
    map.get(tag).push(park)
  })
  return Array.from(map.entries()).map(([tag, parks]) => ({
    tag,
    name: TAG_NAMES[tag] || tag,
    parks
  }))
})

const goPark = (value) => {
  router.push(`/park/${value}`)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.home-header {
  text-align: center;
  margin-bottom: 32px;
}

.home-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.home-header p {
  color: #888;
}

.home-group {
  margin-bottom: 32px;
}

.home-group-title {
  font-size: 20px;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #1677ff;
}

.park-card-title {
  font-size: 15px;
}

.park-card-desc {
  color: #999;
  margin: 0 0 8px;
}

.park-card-link {
  font-size: 13px;
  color: #1677ff;
}

.park-card-link:hover {
  text-decoration: underline;
}
</style>
