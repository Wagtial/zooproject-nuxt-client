<template>
  <q-page class="q-pa-md">
    <p class="text-h4 q-mb-md">Home</p>

    <q-card v-if="apiInfo" class="q-pa-md q-mb-lg">
      <q-card-section>
        <div class="text-h6">{{ apiInfo.title }}</div>
        <div class="text-subtitle2">Version: {{ apiInfo.version }}</div>
        <div class="q-mt-sm">{{ apiInfo.description }}</div>

        <div class="q-mt-sm">Contact: {{ apiInfo.contact?.name }} ({{ apiInfo.contact?.email }})</div>

       
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
          <div><b>Name:</b> {{ apiInfo['x-ows-servicecontact'].individualName }}</div>
          <div><b>Organization:</b> {{ apiInfo['x-ows-servicecontact'].providerName }}</div>
          <div>
            <b>Email:</b>
            <a :href="`mailto:${apiInfo['x-ows-servicecontact'].addressElectronicMailAddress}`" class="text-primary">
              {{ apiInfo['x-ows-servicecontact'].addressElectronicMailAddress }}
            </a>
          </div>
          <div><b>Address:</b>
            {{ apiInfo['x-ows-servicecontact'].addressDeliveryPoint }},
            {{ apiInfo['x-ows-servicecontact'].addressCity }} -
            {{ apiInfo['x-ows-servicecontact'].addressPostalCode }},
            {{ apiInfo['x-ows-servicecontact'].addressCountry }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="landingLinks.length" class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Available Links</div>
        <q-list bordered separator>
          <q-item
            v-for="(link, index) in landingLinks"
            :key="index"
            clickable
            tag="a"
            :href="link.href"
            target="_blank"
          >
            <q-item-section>
              <div class="text-subtitle1">{{ link.title || link.rel }}</div>
              <div class="text-caption text-grey">{{ link.href }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-spinner v-if="loading" class="q-mt-lg" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const landingLinks = ref<any[]>([])
const apiInfo = ref<any>(null)
const loading = ref(false)
const config = useRuntimeConfig()

const landingUrl = `${config.public.NUXT_ZOO_BASEURL}/ogc-api/`
const apiSpecUrl = `${config.public.NUXT_ZOO_BASEURL}/ogc-api/api`

const fetchLandingAndApiInfo = async () => {
  loading.value = true
  try {
    const landingRes = await $fetch(landingUrl)
    landingLinks.value = landingRes.links || []

    const apiRes = await $fetch(apiSpecUrl)
    apiInfo.value = apiRes.info || {}
  } catch (err) {
    console.error('Error loading homepage data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchLandingAndApiInfo)
</script>
