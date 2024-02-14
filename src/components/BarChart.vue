<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, ref } from 'vue'
import { DataZoomComponent } from 'echarts/components'

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

// @ts-ignore
let dataAxis = props.input.map((e) => e.name)
// @ts-ignore
let data = props.input.map((e) => e)

provide(THEME_KEY, 'dark')
const option = ref({
  title: {
    text: props.name,
    left: 'center',
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
    data: dataAxis //props.input //.map(e => e.name)
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
      data: data
    }
  ]
})
</script>

<template>
  <v-chart id="barChart" class="chart" :option="option" autoresize />
</template>
