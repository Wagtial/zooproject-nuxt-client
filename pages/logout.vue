<template>
  <q-page>
    <p>Logout</p>
    <p>Are you sure you want to logout?</p>
    <q-btn label="Yes" color="primary" @click="handleLogout"/>
    <q-btn label="No" color="primary" to="/"/>
  </q-page>
</template>

<script setup lang="ts">
const isProcessing = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const {signOut} = useAuth()

const handleLogout = async () => {
  isProcessing.value = true
  try {
    await signOut({
      redirect: false,
    }).then((response) => {
      console.log("response: ", response)
      authStore.clearAuth()
      router.push({path: '/'})
    }).catch((error) => {
      console.error("Error signing out: ", error)
    }).catch((error) => {
      console.error("Error signing out: ", error)
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>

</style>