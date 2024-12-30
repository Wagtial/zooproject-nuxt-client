<template>
  <div id="swagger-ui"/>
</template>

<script setup>
import { onMounted } from 'vue';
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const config = useRuntimeConfig();
const serverUrl = config.public.NUXT_ZOO_BASEURL + '/ogc-api';

onMounted(() => {
  SwaggerUI({
    dom_id: '#swagger-ui',
    url: serverUrl + '/api', // Cambia por la URL de tu config.yaml
    presets: [SwaggerUI.presets.apis],
    deepLinking: true,
    showExtensions: true,
    showCommonExtensions: true,
    requestInterceptor: (req) => {
      const paths = ['/jobs', '/processes', '/stac', '/raster'];
      const urlPath = req.url.replace(serverUrl, '');
      if (req.url.startsWith(serverUrl) && paths.some(path => urlPath.startsWith('/ogc-api' + path))) {
        if (config.public.ZOO_OGCAPI_REQUIRES_BEARER_TOKEN === 'true') {
          const token = authStore.token.access_token;
          if (token) {
            req.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
      return req;
    },
  });
});
</script>