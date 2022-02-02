<template>
  <div v-if="authState.isAuthenticated" class="flex flex-row h-full">
    <div class="flex-grow p-4 overflow-y-scroll">
      <router-view v-slot="{ Component }">
        <Suspense>
          <template #default>
            <component :is="Component" :key="routeName" />
          </template>
          <template #fallback>
            <div>Loading ...</div>
          </template>
        </Suspense>
      </router-view>
    </div>
  </div>
  <div v-else>
    <a href="#" style="color: red" @click="login()">Login</a>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "/@/lib/useAuth";

export default defineComponent({
  setup() {
    const routeName = computed(() => useRoute().name || 'index')
    const { authState, login } = useAuth()
    return { routeName, authState, login }
  }

})
</script>
