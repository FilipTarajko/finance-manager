<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  input: {
    required: true
  }
})

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'dark')
const option = ref({
  backgroundColor: '#212121',
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
    // @ts-ignore
    data: props.input.map((elem) => elem.name)
  },
  series: [
    {
      name: props.name,
      type: 'pie',
      radius: '60%',
      center: ['50%', '55%'],
      data: props.input,
      // @ts-ignore
      color: props.input.map((elem: { color: any }) => elem.color),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
</script>

<template>
  <v-chart class="chart" :option="option" autoresize />
  <!-- color: {{ props.input.map((elem: { color: any }) => elem.color) }} -->
</template>