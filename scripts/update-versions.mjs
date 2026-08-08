#!/usr/bin/env node
/**
 * 乐园地图瓦片版本探测与更新脚本
 *
 * 用法：
 *   node scripts/update-versions.mjs              # 探测所有乐园的最新版本
 *   node scripts/update-versions.mjs --park=shdr  # 只探测指定乐园
 *   node scripts/update-versions.mjs --dry-run    # 只输出结果，不修改文件
 *   node scripts/update-versions.mjs --add-new    # 同时探测迪士尼 CDN 上的新乐园代码
 *
 * 探测策略：
 *   - 数字型版本（Disney CDN / Universal）：从已知最新版本向上二分搜索
 *   - 时间戳型版本（Tokyo）：从最新版本日期向后逐日探测
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, '../src/data/themeparks.js')

// ============ 配置 ============

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

// 每个乐园的探测配置
const PROBE_CONFIG = {
  shdr: {
    // 通过 Vite 代理（同源），需要 dev server 运行
    testUrl: (v) => `http://localhost:5175/shdr/media/maps/prod/shdr-baidu/${v}/17/104832/51376.jpg`,
    strategy: 'numeric-up',
    step: 1000000,
    maxProbe: 200
  },
  california: {
    testUrl: (v) => `http://localhost:5175/california/media/maps/prod/disneyland/${v}/15/5633/13066.jpg`,
    strategy: 'numeric-up',
    step: 1000000,
    maxProbe: 200
  },
  hkdl: {
    testUrl: (v) => `https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/hkdl/${v}/15/26758/14293.jpg`,
    headers: { Referer: 'https://www.hongkongdisneyland.com/' },
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 50
  },
  orlando: {
    testUrl: (v) => `https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/wdw/${v}/15/9362/13561.jpg`,
    headers: { Referer: 'https://disneyworld.disney.go.com/' },
    strategy: 'numeric-up',
    step: 1000000,
    maxProbe: 200
  },
  aulani: {
    testUrl: (v) => `https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/aulani/${v}/15/5534/13577.jpg`,
    headers: { Referer: 'https://www.disneyaulani.com/' },
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 50
  },
  tokyo: {
    testUrl: (v) => `http://localhost:5175/tkydl/limited/map-image/${v}/daytime/z17/116464_51633.jpg`,
    strategy: 'timestamp',
    maxProbe: 90 // 向后探测 90 天
  },
  tokyoNight: {
    testUrl: (v) => `http://localhost:5175/tkydl/limited/map-image/${v}/nighttime/z17/116464_51633.jpg`,
    strategy: 'timestamp',
    maxProbe: 90
  },
  usj: {
    testUrl: (v) => `http://localhost:5175/usj/assets/MapTiles/Production/${v}/512/16_57337_26019.jpg`,
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 100
  },
  usf: {
    testUrl: (v) => `https://services.universalorlando.com/assets/MapTiles/Production/${v}/512/15_9641_13034.jpg`,
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 100
  },
  ush: {
    testUrl: (v) => `https://services.universalorlando.com/assets/MapTiles/Production/${v}/512/15_5242_12530.jpg`,
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 100
  },
  ubr: {
    testUrl: (v) => `https://services.universalorlando.com/assets/MapTiles/Production/${v}/512/15_27399/12714.jpg`,
    strategy: 'numeric-up',
    step: 1,
    maxProbe: 100
  }
}

// 迪士尼 CDN 上可能存在但尚未收录的乐园代码
const DISNEY_PARK_CODES = [
  'tdr', 'dlp', 'disneyland-paris', 'tokyo-disney',
  'dcl', 'disney-cruise', 'disneyland-hk',
  'wdw-mk', 'wdw-epcot', 'wdw-hs', 'wdw-ak',
  'disney-california-adventure', 'dca'
]

// ============ 工具函数 ============

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function probeUrl(url, headers = {}) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, ...headers },
      redirect: 'follow'
    })
    clearTimeout(timer)
    return resp.status
  } catch (e) {
    return 0 // 网络错误
  }
}

function isTileOk(status) {
  return status === 200
}

// ============ 探测策略 ============

/**
 * 数字型版本：从 latest 向上搜索，找到最高的有效版本
 */
async function probeNumericUp(config, latestVersion) {
  const latest = Number(latestVersion)
  const { step, maxProbe, headers } = config
  let found = []

  console.log(`    向上搜索 (step=${step}, max=${maxProbe} 次)...`)

  // 先快速扫描：以 step 为步长向上跳
  let lastGood = latest
  let probeCount = 0
  for (let offset = step; probeCount < maxProbe; offset += step) {
    const v = latest + offset
    const status = await probeUrl(config.testUrl(v), headers)
    probeCount++

    if (isTileOk(status)) {
      lastGood = v
      found.push(v)
      process.stdout.write(`    ✓ 发现有效版本: ${v}\n`)
    } else if (status === 403) {
      // 403 可能是反爬，不代表版本不存在，跳过
      continue
    } else if (status === 0) {
      process.stdout.write(`    ⚠ 网络错误，暂停 2s...\n`)
      await sleep(2000)
    }

    // 限速：避免被封
    await sleep(300)
  }

  // 如果找到了新版本，在 lastGood 附近精细搜索
  if (found.length > 0) {
    console.log(`    精细搜索 ${lastGood - step} ~ ${lastGood + step}...`)
    for (let v = lastGood - Math.min(step, 100); v <= lastGood + Math.min(step, 100); v++) {
      const status = await probeUrl(config.testUrl(v), headers)
      if (isTileOk(status) && !found.includes(v)) {
        found.push(v)
      }
      await sleep(200)
    }
  }

  return found.sort((a, b) => a - b)
}

/**
 * 时间戳型版本：从最新版本的日期向后逐日探测
 * 格式: YYYYMMDDHHmmss (如 20250623170000)
 */
async function probeTimestamp(config, latestVersion) {
  const { maxProbe, headers } = config
  const found = []

  // 解析最新版本日期
  const year = parseInt(latestVersion.slice(0, 4))
  const month = parseInt(latestVersion.slice(4, 6))
  const day = parseInt(latestVersion.slice(6, 8))
  const baseDate = new Date(year, month - 1, day)

  console.log(`    从 ${year}-${month}-${day} 向后探测 ${maxProbe} 天...`)

  for (let i = 1; i <= maxProbe; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    // 尝试常见时间: 110000, 170000, 000000
    for (const time of ['110000', '170000', '000000']) {
      const v = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${time}`
      const status = await probeUrl(config.testUrl(v), headers)
      if (isTileOk(status)) {
        found.push(v)
        process.stdout.write(`    ✓ 发现有效版本: ${v}\n`)
      }
      await sleep(300)
    }
  }

  return [...new Set(found)].sort()
}

/**
 * 探测迪士尼 CDN 上的新乐园代码
 */
async function probeDisneyParkCodes() {
  console.log('\n🔍 探测迪士尼 CDN 上的未收录乐园代码...')
  const discovered = []

  for (const code of DISNEY_PARK_CODES) {
    // 尝试几个常见版本号
    for (const v of [1, 2, 3, 5, 10, 20, 35, 50, 100]) {
      const url = `https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/${code}/${v}/15/100/100.jpg`
      const status = await probeUrl(url, { Referer: 'https://disneyworld.disney.go.com/' })
      if (isTileOk(status)) {
        discovered.push({ code, version: v })
        process.stdout.write(`  ✓ 发现: ${code} (version ${v})\n`)
        break
      }
      await sleep(200)
    }
  }

  if (discovered.length === 0) {
    console.log('  未发现新乐园代码（CDN 可能有反爬限制，建议通过浏览器验证）')
  }
  return discovered
}

// ============ 主流程 ============

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const addNew = args.includes('--add-new')
  const parkFilter = args.find((a) => a.startsWith('--park='))?.split('=')[1]

  console.log('🗺️  乐园地图瓦片版本更新工具')
  console.log(`   数据文件: ${DATA_FILE}`)
  console.log(`   模式: ${dryRun ? '预览(dry-run)' : '更新'}${parkFilter ? ` | 筛选: ${parkFilter}` : ''}`)
  console.log('')

  // 读取当前数据
  const content = readFileSync(DATA_FILE, 'utf-8')
  const parksMatch = content.match(/export const THEMEPARKS = \[([\s\S]*?)\n\]/)
  if (!parksMatch) {
    console.error('❌ 无法解析 themeparks.js')
    process.exit(1)
  }

  // 动态导入获取乐园数据
  const dataUrl = `file://${DATA_FILE}?t=${Date.now()}`
  const { THEMEPARKS } = await import(dataUrl)

  const results = {}
  let hasUpdates = false

  for (const park of THEMEPARKS) {
    if (parkFilter && park.value !== parkFilter) continue

    const config = PROBE_CONFIG[park.value]
    if (!config) {
      console.log(`⏭️  ${park.label} (${park.value}): 无探测配置，跳过`)
      continue
    }

    const latestVersion = park.versions?.[park.versions.length - 1]
    if (latestVersion === undefined || latestVersion === null) {
      console.log(`⏭️  ${park.label} (${park.value}): 无已知版本，跳过`)
      continue
    }

    console.log(`\n🔎 ${park.label} (${park.value})`)
    console.log(`   当前最新版本: ${latestVersion}`)

    let newVersions = []
    try {
      if (config.strategy === 'numeric-up') {
        newVersions = await probeNumericUp(config, latestVersion)
      } else if (config.strategy === 'timestamp') {
        newVersions = await probeTimestamp(config, String(latestVersion))
      }
    } catch (e) {
      console.log(`   ❌ 探测出错: ${e.message}`)
      continue
    }

    // 过滤掉已知版本
    const existingSet = new Set(park.versions.map(String))
    const trulyNew = newVersions.filter((v) => !existingSet.has(String(v)))

    if (trulyNew.length > 0) {
      hasUpdates = true
      results[park.value] = {
        label: park.label,
        existing: park.versions,
        new: trulyNew
      }
      console.log(`   🆕 发现 ${trulyNew.length} 个新版本: ${trulyNew.join(', ')}`)
    } else {
      console.log(`   ✅ 已是最新版本`)
    }
  }

  // 探测新乐园代码
  if (addNew) {
    await probeDisneyParkCodes()
  }

  // 输出汇总
  console.log('\n' + '='.repeat(50))
  if (!hasUpdates) {
    console.log('✅ 所有乐园版本均为最新，无需更新。')
    return
  }

  console.log('📋 发现新版本汇总:')
  for (const [value, info] of Object.entries(results)) {
    console.log(`   ${info.label}: +[${info.new.join(', ')}]`)
  }

  if (dryRun) {
    console.log('\n⚠️  --dry-run 模式，未修改文件。')
    return
  }

  // 更新文件
  let updatedContent = content
  for (const [value, info] of Object.entries(results)) {
    const park = THEMEPARKS.find((p) => p.value === value)
    const oldVersionsStr = JSON.stringify(park.versions)
    const mergedVersions = [...park.versions, ...info.new.map((v) => (typeof park.versions[0] === 'string' ? String(v) : Number(v)))]
    const newVersionsStr = JSON.stringify(mergedVersions)
    updatedContent = updatedContent.replace(
      new RegExp(`versions: ${escapeRegex(oldVersionsStr)}`),
      `versions: ${newVersionsStr}`
    )
  }

  writeFileSync(DATA_FILE, updatedContent, 'utf-8')
  console.log(`\n✅ 已更新 ${DATA_FILE}`)
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main().catch((e) => {
  console.error('❌ 脚本执行失败:', e)
  process.exit(1)
})
