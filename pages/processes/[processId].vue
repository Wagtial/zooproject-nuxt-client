<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'

const {
  params: { processId }
} = useRoute()

const authStore = useAuthStore()
const config = useRuntimeConfig()

const data = ref(null)
const inputValues = ref<Record<string, any>>({})
const response = ref(null)
const loading = ref(false)
const jobStatus = ref('')

const jsonRequestPreview = ref('')
const showDialog = ref(false)

const fetchData = async () => {
  try {
    data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes/${processId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })

    if (data.value && data.value.inputs) {
      for (const [key, input] of Object.entries(data.value.inputs)) {
        inputValues.value[key] = input.schema?.default ?? (input.schema?.type === 'number' ? 0 : '')
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})

watch(inputValues, (newInputs) => {
  const payload = {
    inputs: newInputs,
    outputs: {
      RESULT: {
        format: {
          mediaType: 'text/xml'
        },
        transmissionMode: 'value'
      }
    },
    subscriber: {
      successUri: 'http://zookernel/cgi-bin/publish.py?jobid=JOBSOCKET-83dcc87e-55a7-11f0-abed-0242ac106a07&type=success',
      inProgressUri: 'http://zookernel/cgi-bin/publish.py?jobid=JOBSOCKET-83dcc87e-55a7-11f0-abed-0242ac106a07&type=inProgress',
      failedUri: 'http://zookernel/cgi-bin/publish.py?jobid=JOBSOCKET-83dcc87e-55a7-11f0-abed-0242ac106a07&type=failed'
    }
  }
  jsonRequestPreview.value = JSON.stringify(payload, null, 2)
}, { deep: true })

const pollJobStatus = async (jobId: string) => {
  const jobUrl = `${config.public.NUXT_ZOO_BASEURL}/ogc-api/jobs/${jobId}`
  const headers = {
    Authorization: `Bearer ${authStore.token.access_token}`
  }

  while (true) {
    try {
      const job = await $fetch(jobUrl, { headers })
      jobStatus.value = job.status

      if (job.status === 'successful') {
        response.value = job
        loading.value = false
        break
      } else if (job.status === 'failed') {
        response.value = { error: 'Job failed', details: job }
        loading.value = false
        break
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (err) {
      console.error('Polling error:', err)
      loading.value = false
      break
    }
  }
}

const submitProcess = async () => {
  try {
    loading.value = true
    response.value = null
    jobStatus.value = 'submitted'

    const payload = JSON.parse(jsonRequestPreview.value)

    const res = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes/${processId}/execution`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (res.jobID) {
      await pollJobStatus(res.jobID)
    } else {
      loading.value = false
      response.value = res
    }
  } catch (error) {
    console.error('Execution error:', error)
    loading.value = false
  }
}
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="data">
      <h4>{{ data.id }} - {{ data.description }}</h4>

      <q-form @submit.prevent="submitProcess">
        <div v-for="(input, inputId) in data.inputs" :key="inputId" class="q-mb-md">
          <q-card class="q-pa-md">
            <div class="text-blue text-bold q-mb-sm">{{ inputId.toUpperCase() }}</div>
            <div class="q-gutter-sm row items-center">
              <q-badge color="grey-3" text-color="black">
                {{ input.schema?.type || 'text' }}
              </q-badge>

              <q-input
                v-if="!input.schema?.enum"
                filled
                v-model="inputValues[inputId]"
                :type="input.schema?.type === 'number' ? 'number' : 'text'"
                :label="input.title || inputId"
                dense
                class="q-ml-sm"
                style="flex: 1"
              />

              <q-select
                v-else
                filled
                v-model="inputValues[inputId]"
                :options="input.schema.enum"
                :label="input.title || inputId"
                dense
                class="q-ml-sm"
                style="flex: 1"
              />
            </div>
          </q-card>
        </div>

        <div class="q-mt-md row q-gutter-sm">
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn color="primary" outline label="Show JSON Preview" @click="showDialog = true" />
        </div>
      </q-form>

      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 70vw; max-width: 90vw;">
          <q-card-section>
            <div class="text-h6">Execute Request Confirmation</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-banner dense class="bg-grey-2 text-black q-pa-sm">
              This is the full request that will be sent to the Execute endpoint:
            </q-banner>
            <pre class="q-pa-sm scroll bg-grey-2" style="max-height: 400px; overflow-y: auto; white-space: pre-wrap;">
      {{ jsonRequestPreview }}
            </pre>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              label="Submit Request"
              color="primary"
              :loading="loading"
              @click="() => { showDialog = false; submitProcess() }"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="q-mt-md" v-if="loading">
        <q-linear-progress indeterminate color="primary" />
        <div class="text-caption text-primary q-mt-sm">Execution in progress... Status: {{ jobStatus }}</div>
      </div>

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