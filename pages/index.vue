<template>

  <q-page class="row no-wrap">

    <!-- Left Main Content -->
    <div class="col q-pa-md">
      <h3>Main Content</h3>
      <p>This is the left side of the page where your main content goes.</p>

      <p>You are currently {{ status }}</p>
      <!-- <p>Token: {{ authStore.token }}</p> -->
      <p>User: {{ authStore.user.name }}</p>

    </div>

    <!-- Right Side Panel -->
    <div class="q-pa-md bg-grey-2" style="width: 300px;" v-if="metadata_contact">
      <h5>Object Descriptions</h5>
      
      <div
        v-for="(object, index) in metadata_contact"
        :key="index"
        class="q-mb-md q-pa-sm bg-white rounded-borders shadow-1"
      >
        <h6>{{ index }}</h6>
        <div v-for="(value, key) in object" :key="key" class="text-body2">
          <strong>{{ key }}:</strong> {{ value }}
        </div>
        <q-separator class="q-my-sm" /> 

      </div>
    </div>
<!--
    <p>Home</p>

  <!-- Barre latérale gauche: liste des liens --
  <q-col cols="8">
    <q-card>
      <q-card-section>
        <h6>Liens</h6>
      <!--
        <q-list>
          <q-item v-for="(link, index) in links" :key="index" clickable>
            <q-item-section>{{ link.name }}</q-item-section>
          </q-item>
        </q-list>
      --
      </q-card-section>
    </q-card>
  </q-col>

  <!-- Provider description --
  <q-col cols="4">
    <q-card>
      <q-card-section>
        <div class="row items-center justify-between mb-2">
          <h6>Provider</h6>
          <div v-if="metadata_contact">
            <div class="q-pa-md">
              <div v-for="(value, key) in metadata_contact" :key="key" class="q-mb-sm">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
            </div>
          </div>
          <div v-if="metadata_contact">
            <div class="q-pa-md">
              <div v-for="(value, key) in metadata_contact" :key="key" class="q-mb-sm">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
            </div>
          </div>
          <q-btn flat icon="edit" @click="toggleDescription" :label="showDescription ? 'Cacher' : 'Afficher'" />
        </div>
        <div v-if="showDescription" class="q-mb-md" style="max-height: 300px; overflow: auto;">
          <pre v-html="highlightedDescription"></pre>
        </div>
        <!-- Textarea caché pour JSON description --
        <div v-if="showJson" class="q-mt-md">
          <q-input
            filled
            type="textarea"
            ref="jsonTextarea"
            v-model="jsonDescription"
            label="Description JSON"
            autogrow
            style="height: 200px;"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-col>

  <p>You are currently {{ status }}</p>
  <p>Token: {{ authStore.token }}</p>
  <p>User: {{ authStore.user }}</p>

  <div v-if="data">
    <pre itemprop="info">{{ formattedData }}</pre>
  </div>
-->
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12" style="max-width: 900px;">

        <p class="text-h4 q-mb-md text-weight-bold">Home</p>

        <q-card v-if="apiInfo" class="q-pa-md q-mb-lg">
          <q-card-section>
            <div class="text-h6">{{ apiInfo.title }}</div>
            <div class="text-subtitle2">Version: {{ apiInfo.version }}</div>
            <div class="q-mt-sm">{{ apiInfo.description }}</div>

            <div class="q-mt-sm">
              Contact: {{ apiInfo.contact?.name }} ({{ apiInfo.contact?.email }})
            </div>

            <div class="q-mt-sm" v-if="apiInfo.license">
              License:
              <a
                :href="apiInfo.license.url"
                target="_blank"
                class="text-primary"
                style="text-decoration: underline"
              >
                {{ apiInfo.license.name }}
              </a>
            </div>

            <div class="q-mt-md" v-if="apiInfo['x-keywords']">
              <div class="text-subtitle2 q-mb-xs">Keywords:</div>
              <q-chip
                v-for="(kw, i) in apiInfo['x-keywords']"
                :key="i"
                color="primary"
                text-color="white"
                class="q-mr-sm"
                dense
              >
                {{ kw }}
              </q-chip>
            </div>

            <div class="q-mt-md" v-if="apiInfo['x-ows-servicecontact']">
              <div class="text-subtitle2 q-mb-xs">Service Contact:</div>
              <div class="q-mt-sm">Name: {{ apiInfo['x-ows-servicecontact'].individualName }}</div>
              <div class="q-mt-sm">Organization: {{ apiInfo['x-ows-servicecontact'].providerName }}</div>
              <div class="q-mt-sm">
                Email:
                <a :href="`mailto:${apiInfo['x-ows-servicecontact'].addressElectronicMailAddress}`"
                   class="text-primary">
                  {{ apiInfo['x-ows-servicecontact'].addressElectronicMailAddress }}
                </a>
              </div>
              <div class="q-mt-sm">
                Address:
                {{ apiInfo['x-ows-servicecontact'].addressDeliveryPoint }},
                {{ apiInfo['x-ows-servicecontact'].addressCity }} -
                {{ apiInfo['x-ows-servicecontact'].addressPostalCode }},
                {{ apiInfo['x-ows-servicecontact'].addressCountry }}
              </div>
            </div>
          </q-card-section>
        </q-card>

              <q-card v-if="landingLinks.length" class="q-pa-md q-mb-md">
          <q-card-section>
            <div class="text-h6">Available Links</div>

            <div v-for="(links, title) in groupedLinks" :key="title" class="q-mb-md">
              <div class="text-subtitle1 q-mb-xs">{{ title }}</div>
              <q-list separator>
                <q-item
                  v-for="(link, idx) in links"
                  :key="idx"
                  clickable
                  tag="a"
                  :href="link.href"
                  target="_blank"
                  class="hoverable-link text-primary"
                >
                <q-item-section>
                  {{ getReadableLinkText(link) }}
                </q-item-section>

                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>

        <q-spinner v-if="loading" class="q-mt-lg" />
      </div>
    </div>

  </q-page>
</template>


<script setup lang="ts">

import {ref, computed, onMounted} from 'vue'
import {useRuntimeConfig} from '#imports'

const { status } = useAuth()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)

const fetchData = async () => {
  try {
    data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/api`, {

import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const authStore = useAuthStore()
const landingLinks = ref<any[]>([])
const apiInfo = ref<any>(null)
const loading = ref(false)
const config = useRuntimeConfig()

const landingUrl = `${config.public.NUXT_ZOO_BASEURL}/ogc-api/`
const apiSpecUrl = `${config.public.NUXT_ZOO_BASEURL}/ogc-api/api`

const fetchLandingAndApiInfo = async () => {
  loading.value = true
  try {
    const landingRes = await $fetch(landingUrl, {

      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })

  } catch (error) {
    console.error('Error fetching data:', error)
    try {
      data.value = await $fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/api`, {})
    } catch (error) {
      console.error('Error fetching data:', error)
    }

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

/*const rows = computed(() => {
  console.log(data.value)
  try{
    return data.value["processes"]
  }catch(error){
    console.log('Error fetching processes list:',error)
    return []
  }
})*/

const formattedData = computed(() => {
  return data.value
})

const metadata_contact = computed(() => {
  console.log(data.value)
  try{
    var contact = {};
    for(var i in data.value["info"]){
      if(i=="contact" || i=="x-ows-servicecontact"){
        contact[i] = data.value["info"][i];
      }
    }
    return contact
  } catch (error) {
    console.log('Error fetching metadata contact:', error)
    return {}
  }
})


    landingLinks.value = landingRes.links || []

    const apiRes = await $fetch(apiSpecUrl)
    apiInfo.value = apiRes.info || {}
  } catch (err) {
    console.error('Error loading homepage data:', err)
    const landingRes = await $fetch(landingUrl)
    landingLinks.value = landingRes.links || []

    const apiRes = await $fetch(apiSpecUrl)
    apiInfo.value = apiRes.info || {}
  } finally {
    loading.value = false
  }
}

const groupedLinks = computed(() => {
  const groups: Record<string, any[]> = {}

  for (const link of landingLinks.value) {
    const title = link.title || 'Untitled'
    if (!groups[title]) {
      groups[title] = []
    }
    groups[title].push(link)
  }

  return groups
})

const getReadableLinkText = (link: any): string => {
  const href = link.href || ''

  if (href.endsWith('/ogc-api/')) return 'View this document in JSON.'
  if (href.endsWith('/ogc-api/index.html')) return 'View the alternative version in HTML.'
  if (href.endsWith('/ogc-api/api')) return 'View the service description.'
  if (href.endsWith('/ogc-api/api.html')) return 'View service documentation.'
  if (href.endsWith('/ogc-api/conformance')) return 'View the conformance classes that the link\'s context conforms to.'
  if (href.endsWith('/ogc-api/conformance.html')) return 'View the alternative version in HTML.'
  if (href.endsWith('/ogc-api/processes')) return 'View the list of processes the API offers.'
  if (href.endsWith('/ogc-api/processes.html')) return 'View the alternative version in HTML.'
  if (href.endsWith('/ogc-api/jobs')) return 'View the list of job available on this server.'
  if (href.endsWith('/ogc-api/jobs.html')) return 'View the alternative version in HTML.'

  return 'View link'
}



onMounted(fetchLandingAndApiInfo)

</script>
