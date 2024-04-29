<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()

const props = defineProps<{
  name: string
  input: { name: string; value: number; color: string }[]
}>()

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, themeStore.darkTheme ? 'dark' : 'light')
const option = computed(() => {
  return {
    backgroundColor: themeStore.darkTheme ? '#212121' : '#ffffff',
    title: {
      text: props.name,
      top: 12,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 'left',
      data: props.input.map((elem) => elem.name)
    },
    series: [
      {
        name: props.name,
        type: 'pie',
        radius: '60%',
        center: ['50%', '55%'],
        data: props.input,
        color: props.input.map((elem: { color: any }) => elem.color),
        animationDuration: 0,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<template>
  <v-chart class="chart" :option="option" autoresize />
  <!-- color: {{ props.input.map((elem: { color: any }) => elem.color) }} -->
</template>
