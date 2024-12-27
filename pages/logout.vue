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
    }).then(async (response) => {
      console.log("response: ", response)

      const token = authStore.token;
      const logoutUrl = `${config.public.NUXT_OIDC_ISSUER}/protocol/openid-connect/logout`;

      authStore.clearAuth()

      const body = new URLSearchParams({
          'id_token_hint': token.id_token,
          'redirect_uri': config.public.AUTH_ORIGIN,
        });
      console.log("logoutUrl: ", logoutUrl)
      console.log("body: ", body)
      await fetch(`${logoutUrl}?${body.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((response) => {
        console.log("keycloak logout response: ", response);
      });

      // authStore.clearAuth()
      // await router.push({path: '/'})
    }).finally(() => {
      isProcessing.value = false
      router.push({path: '/'})
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>

</style>