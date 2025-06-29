<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)
const filter = ref('')

const fetchData = async () => {
  try {
    data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})

const columns = [
  { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true },
  {
    name: 'link',
    label: 'Lien',
    field: row => row.links?.[0]?.href || '',
    align: 'left',
    sortable: false
  }
]

const rows = computed(() => {
  if (!data.value?.processes) return []
  const term = filter.value.toLowerCase()
  return data.value.processes.filter(p => {
    const idMatch = p.id.toLowerCase().includes(term)
    const descMatch = (p.description ?? '').toLowerCase().includes(term)
    return idMatch || descMatch
  })
})

const formattedData = computed(() => JSON.stringify(data.value, null, 2))
</script>

<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <p itemprop="title" class="text-h3">Processes List</p>
        <q-separator />

        <div class="q-mb-md">
          <q-input
            filled
            v-model="filter"
            label="Rechercher"
            debounce="300"
            clearable
            prepend-icon="search"
          />
        </div>

        <q-table
          title="Processes List"
          :rows="rows"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-link="{ row }">
            <q-td>
              <NuxtLink :to="`/processes/${row.id}`" target="_blank">{{ row.id }}</NuxtLink>
            </q-td>
          </template>
        </q-table>

        <q-separator />

      </div>
    </div>
  </q-page>
</template>
