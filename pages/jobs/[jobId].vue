<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12" style="max-width: 1000px;">
        <p class="text-h4 q-mb-md">Job Details: {{ jobId }}</p>
        <q-separator class="q-mb-md" />

        <q-card v-if="jobData" class="q-pa-md">
          <q-card-section>
            <div class="text-subtitle1 q-mb-sm">
              <q-icon name="work" class="q-mr-sm" /> Job ID:
              <strong>{{ jobData.jobID }}</strong>
            </div>

            <q-separator class="q-my-md" />

            <div><strong>Process ID:</strong> {{ jobData.processID }}</div>
            <div><strong>Progress:</strong> {{ jobData.progress }}</div>
            <div><strong>Message:</strong> {{ jobData.message }}</div>
            <div><strong>Status:</strong> {{ jobData.status }}</div>
            <div><strong>Created:</strong> {{ jobData.created }}</div>

            <div v-if="jobData.links && jobData.links.length" class="q-mt-lg">
              <q-select
                filled
                label="Select a job link to view (logs, results, etc.)"
                v-model="selectedLink"
                :options="linkOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                @update:model-value="fetchLinkContent"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-spinner v-else class="q-mt-md" />
      </div>
    </div>

  
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Link Content</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showModal = false" />
        </q-card-section>

        <q-card-section>
          <div v-if="modalContent">
            <pre>{{ modalContent }}</pre>
          </div>
          <div v-else class="text-negative">No data or failed to fetch.</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const jobId = route.params.jobId
const jobData = ref<any>(null)
let intervalId: ReturnType<typeof setInterval>

const selectedLink = ref(null)
const modalContent = ref('')
const showModal = ref(false)

const linkOptions = computed(() => {
  if (!jobData.value?.links) return []
  return jobData.value.links.map((link: any, index: number) => ({
    label: link.title || link.rel || `Link ${index + 1}`,
    value: link.href
  }))
})

const fetchLinkContent = async (href: string) => {
  try {
    const response = await $fetch(href, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
    modalContent.value = typeof response === 'object'
      ? JSON.stringify(response, null, 2)
      : response
    showModal.value = true
  } catch (err) {
    modalContent.value = 'Failed to fetch link content'
    showModal.value = true
    console.error(err)
  }
}

const fetchJobDetails = async () => {
  try {
    const response = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
    jobData.value = response

    if (response.status === 'succeeded' || response.status === 'failed') {
      clearInterval(intervalId)
    }
  } catch (err) {
    console.error('Error fetching job details:', err)
    clearInterval(intervalId)
  }
}

onMounted(() => {
  fetchJobDetails()
  intervalId = setInterval(fetchJobDetails, 3000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>
