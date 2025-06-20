<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <p class="text-h3">Jobs List</p>
        <q-separator />

        <q-input v-model="filter" filled label="Search" class="q-mb-md" debounce="300" />
        <q-table
          title="Jobs List"
          :rows="rows"
          :columns="columns"
          row-key="jobID"
        >
          <template v-slot:body-cell-actions="{ row }">
            <q-td class="text-center">
              <q-btn
                label="View"
                color="primary"
                size="sm"
                :to="`/jobs/${row.jobID}`"
                target="_blank"
                flat
              />
            </q-td>
          </template>
        </q-table>

        <q-separator />

        <br />
        <div v-if="data">
          <pre>{{ formattedData }}</pre>
        </div>
        <q-spinner v-else />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const filter = ref('')

const data = ref(null)

const fetchData = async () => {
  try {
    const response = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/jobs`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
    data.value = response
  } catch (error) {
    console.error('Error fetching jobs:', error)
  }
}

onMounted(() => {
  fetchData()
})


const rows = computed(() => {
  try {
    return data.value?.jobs || []
  } catch (error) {
    console.log('Jobs parsing error:', error)
    return []
  }
})

const columns = [
  { name: 'jobID', label: 'Job ID', field: 'jobID', align: 'left', sortable: true },
  { name: 'processID', label: 'Process', field: 'processID', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'created', label: 'Created', field: 'created', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const formattedData = computed(() => JSON.stringify(data.value, null, 2))
</script>
