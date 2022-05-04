<template>
	<div class="h100">
    <router-view v-slot="{ Component }">
      <transition name="slide-right" mode="out-in">
        <keep-alive :include="state.keepAliveNameList">
          <component :is="Component" :key="state.refreshRouterViewKey" class="w100" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
  import { reactive, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'
  const route = useRoute()

  const state = reactive({
    refreshRouterViewKey: null,
    keepAliveNameList: [],
  });

  watch(
    store.state.tagsViewRoutes,
    (val) => {
      state.keepAliveNameList = val.keepAliveNames
    }
  )

  // 监听路由变化，防止 tagsView 多标签时，切换动画消失
  watch(
    () => route.fullPath,
    () => {
      state.refreshRouterViewKey = route.fullPath;
    }
  );
</script>