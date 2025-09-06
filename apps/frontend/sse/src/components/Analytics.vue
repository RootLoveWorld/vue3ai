<template>
  <div>
    <n-card :title="t('analytics.title')">
      <n-grid :cols="2" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card :title="t('analytics.visitors')">
            <n-statistic tabular-nums>
              <n-number-animation ref="numberAnimationInstRef" :from="0" :to="12345" />
              <template #prefix>
                <n-icon>
                  <PeopleOutline />
                </n-icon>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="t('analytics.pageViews')">
            <n-statistic tabular-nums>
              <n-number-animation ref="numberAnimationInstRef" :from="0" :to="56789" />
              <template #prefix>
                <n-icon>
                  <EyeOutline />
                </n-icon>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
      </n-grid>
      
      <n-card :title="t('analytics.trafficSources')" style="margin-top: 20px">
        <n-empty :description="t('analytics.noData')" />
      </n-card>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NGrid, NGridItem, NStatistic, NNumberAnimation, NIcon, NEmpty } from 'naive-ui'
import { PeopleOutline, EyeOutline } from '@vicons/ionicons5'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>