<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRuntimeConfig} from '#imports'
import { useRoute } from 'vue-router'

const {
  params: { processId },
} = useRoute()

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)

const fetchData = async () => {
  try {
    data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes/${processId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    data.value 
  }
}

onMounted(() => {
  fetchData()
})


const formattedData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})

</script>

<template>
  <q-page class="q-pa-sm">
    <div v-if="data">
      <pre itemprop="info">{{ formattedData }}</pre>
    </div>
  </q-page>
</template>