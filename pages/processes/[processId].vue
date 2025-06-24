<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'

const {
  params: { processId }
} = useRoute()

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)
const inputValues = ref({})
const response = ref(null)

const fetchData = async () => {
  try {
    data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes/${processId}`, {
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

const submitProcess = async () => {
  try {
    const payload = {
      inputs: Object.entries(inputValues.value).map(([id, val]) => ({
        id,
        input: {
          value: val
        }
      }))
    }
    // console.log('Input Values:', inputValues.value)
    // console.log('Payload:', JSON.stringify(payload, null, 2))
    response.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes/${processId}/execution`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error('Execution error:', error)
  }
}
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="data">
      <h4>{{ data.id }} - {{ data.description }}</h4>

      <q-form @submit.prevent="submitProcess">
        <div
          v-for="(input, inputId) in data.inputs"
          :key="inputId"
          class="q-mb-md"
        >
          <q-input
            filled
            v-model="inputValues[inputId]"
            :label="`${inputId} (${input.schema?.type || 'text'})`"
            :type="input.schema?.type === 'number' ? 'number' : 'text'"
            :hint="input.title || ''"
          />
        </div>

        <q-btn label="Submit" type="submit" color="primary" />
      </q-form>

      <div class="q-mt-lg" v-if="response">
        <h6>Execution Response</h6>

        <details>
          <summary class="text-primary text-bold cursor-pointer">Show Raw JSON</summary>
          <pre>{{ JSON.stringify(response, null, 2) }}</pre>
        </details>
      </div>
    </div>
    <q-spinner v-else />
  </q-page>
</template>
