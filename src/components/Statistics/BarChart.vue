<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'
import { computed, provide } from 'vue'
import { DataZoomComponent } from 'echarts/components'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: false
  },
  input: {
    required: true
  }
})

use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, DataZoomComponent])

provide(THEME_KEY, themeStore.darkTheme ? 'dark' : 'light')
const option = computed(() => {
  return {
    backgroundColor: themeStore.darkTheme ? '#212121' : '#ffffff',
    title: {
      text: props.name,
      left: 'center',
      top: 12,
      subtext: props?.subtitle ?? ''
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}',
      axisPointer: {
        type: 'shadow'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    grid: {
      top: 80,
      bottom: 30
    },
    yAxis: {
      type: 'value',
      position: 'top',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    xAxis: {
      type: 'category',
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      // @ts-ignore
      data: props.input.map((e) => e.name)
    },
    series: [
      {
        name: 'Cost',
        type: 'bar',
        stack: 'Total',
        // label: {
        //   show: false,
        //   formatter: '{b}',
        //   position: 'bottom',
        //   rotate: 15,
        //   color: '#ffffff'
        // },
        // @ts-ignore
        data: props.input.map((e) => e),
        animationDuration: 0
      }
    ]
  }
})
</script>

<template>
  <v-chart id="barChart" class="chart" :option="option" autoresize />
</template>
