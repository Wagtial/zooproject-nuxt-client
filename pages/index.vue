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

</script>

<style scoped>

</style>