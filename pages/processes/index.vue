<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)
const filter = ref('')

// Variables réactives
const showModal = ref(false)
const processName = ref('')
const fileContent = ref('')
const selectedFile = ref<File | null>(null)

// Gérer le changement de fichier
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = () => {
      fileContent.value = reader.result as string
    }
    reader.readAsText(file)
  }
}

// Fermer la modal et réinitialiser
function closeModal() {
  processName.value = ''
  fileContent.value = ''
  selectedFile.value = null
  showModal.value = false
}

// Envoyer le formulaire
async function submitForm() {
  if (!selectedFile.value) {
    alert("Veuillez sélectionner un fichier.")
    return
  }

  const formData = new FormData()
  formData.append('processName', processName.value)
  formData.append('fileContent', fileContent.value)

  try {
    // Adapter l'URL selon votre API
    await fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/processes?w=${processName.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/cwl+yaml',
        'Authorization': `Bearer ${authStore.token.access_token}`
      },
      body: fileContent.value,
    })
    alert('Données envoyées avec succès!')
    closeModal()
  } catch (error) {
    console.error(error)
    alert('Erreur lors de l\'envoi.')
  }
}

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
        <p itemprop="title" class="text-h4">Processes List  <button @click="showModal = true"><q-icon name="add" /></button></p>
        <q-separator />

        <div class="q-mb-md">
          <q-input
            filled
            v-model="filter"
            label="Search"
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
              <NuxtLink :to="`/processes/${row.id}`">{{ row.id }}</NuxtLink>
            </q-td>
          </template>
        </q-table>

        <q-separator />

      </div>
    </div>

    <!-- Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 600px; max-width: 90vw;" class="rounded-borders">
      <div class="modal">
        <h2>Add a Process</h2>
        <form @submit.prevent="submitForm">
          <!-- Nom du processus -->
          <div>
            <label for="processName">Process Name :</label>
            <input
              type="text"
              id="processName"
              v-model="processName"
              required
            />
          </div>

          <!-- Upload fichier -->
          <div>
            <label for="file">File :</label>
            <input
              type="file"
              id="file"
              accept=".cwl"
              @change="handleFileChange"
              required
            />
          </div>

          <!-- Affichage contenu fichier -->
          <div v-if="fileContent">
            <label for="fileContentTextarea">File Content</label>
            <textarea 
              id="fileContentTextarea"
              rows="20"
              cols="80"
              :value="fileContent"
              @change="fileContent = $event.target.value"></textarea>
          </div>

          <!-- Boutons -->
          <div style="margin-top: 10px;">
            <button type="submit">Submit</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<style scoped>
/* Background de la modal semi-transparent */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 999;
}

/* Contenu de la fenêtre avec style moderne */
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Style pour le header de la modal */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

/* bouton fermeture en haut à droite */
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #555;
}

/* Formulaire et inputs */
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #555;
}
input[type="text"],
input[type="file"],
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
input[type="text"]:focus,
input[type="file"]:focus,
textarea:focus {
  border-color: #6366f1;
  outline: none;
}

/* zone de prévisualisation du contenu */
.content-preview textarea {
  min-height: 100px;
  resize: vertical;
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
}

/* Boutons d’action */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.submit-btn {
  background-color: #6366f1;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.submit-btn:hover {
  background-color: #4f46e5;
}
.cancel-btn {
  background-color: transparent;
  color: #555;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid #ccc;
  cursor: pointer;
  font-weight: 600;
  transition: border-color 0.2s;
}
.cancel-btn:hover {
  border-color: #888;
}
</style>