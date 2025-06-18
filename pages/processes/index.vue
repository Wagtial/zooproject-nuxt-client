<template>

  <q-page class="q-pa-sm">


    <div class="row justify-center ">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <p itemprop="title" class="text-h3">Processes List</p>
        <q-separator/>

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
            <q-td >
              <a href="/processes/${row.id}" target="_blank">{{ row.id }}</a>
            </q-td>
          </template>
        </q-table>   

        <q-separator/>

        <br/>
        <div v-if="data">
          <pre itemprop="info">{{ formattedData }}</pre>
        </div>
        <q-spinner v-else/>
      </div>
    </div>
 
  </q-page>

</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRuntimeConfig} from '#imports'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)

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
  console.log(data.value)
  try{
    return data.value["processes"]
  }catch(error){
    console.log('Error fetching processes list:',error)
    return []
  }
})

const formattedData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>