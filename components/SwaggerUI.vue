<template>
  <div id="swagger-ui"/>
</template>

<script setup>
import {onMounted} from 'vue';
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

const authStore = useAuthStore();

onMounted(() => {
  SwaggerUI({
    dom_id: '#swagger-ui',
    url: 'http://34.58.209.120/ogc-api/api', // Cambia por la URL de tu config.yaml
    presets: [SwaggerUI.presets.apis],
    deepLinking: true,
    showExtensions: true,
    showCommonExtensions: true,
    requestInterceptor: (req) => {
      const token = authStore.token.access_token; // Obtén el token desde tu authStore
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
  });
});
</script>
