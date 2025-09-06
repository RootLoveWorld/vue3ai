<template>
  <div>
    <n-card :title="t('users.title')">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NDataTable } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const columns = [
  {
    title: t('users.name'),
    key: 'name'
  },
  {
    title: t('users.email'),
    key: 'email'
  },
  {
    title: t('users.role'),
    key: 'role'
  }
]

const data = ref([
  {
    key: 1,
    name: 'John Brown',
    email: 'john@example.com',
    role: t('users.admin')
  },
  {
    key: 2,
    name: 'Jim Green',
    email: 'jim@example.com',
    role: t('users.user')
  },
  {
    key: 3,
    name: 'Joe Black',
    email: 'joe@example.com',
    role: t('users.user')
  }
])

const pagination = {
  pageSize: 10
}
</script>