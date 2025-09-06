<template>
  <div>
    <n-card :title="t('dashboard.title')">
      <n-grid :cols="2" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card :title="t('dashboard.statistics')">
            <n-statistic :label="t('dashboard.totalUsers')" :value="1234" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="t('dashboard.statistics')">
            <n-statistic :label="t('dashboard.aiUsage')" :value="5678" />
          </n-card>
        </n-grid-item>
      </n-grid>
      
      <n-card :title="t('dashboard.recentActivity')" style="margin-top: 20px">
        <n-timeline>
          <n-timeline-item :content="t('dashboard.aiModelUpdated')" time="2023-05-10" />
          <n-timeline-item :content="t('dashboard.newUserRegistered')" time="2023-05-09" />
          <n-timeline-item :content="t('dashboard.systemMaintenance')" time="2023-05-08" />
        </n-timeline>
      </n-card>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { 
  NCard, 
  NGrid, 
  NGridItem, 
  NStatistic, 
  NTimeline, 
  NTimelineItem 
} from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>