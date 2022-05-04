<template>
  <el-aside class="layout-aside" :class="setCollapseStyle" style="background-color: #545c64">
    <Logo />
    <div style="padding: 10px;">
      <el-select v-model="state.group" placeholder="请选择分组" @change="groupChangeHandler" style="width:100%">
        <el-option v-for="(item,index) in state.groupData" :key="index" :label="item.name" :value="item.name" />
      </el-select>
    </div>
    <el-scrollbar class="flex-auto layout-el-aside-br-color" ref="layoutAsideScrollbarRef">
      <el-menu
        router
        :default-active="state.defaultActive"
        background-color="#545c64"
        :row-style="{height: '30px'}"
        text-color="#eaeaea"
        active-text-color="#409eff"
        :collapse-transition="false"
      >
        <el-menu-item index="/home" key="/home">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <template v-for="(menu, index) in state.menuLists">
          <el-sub-menu :index="menu.path" v-if="menu.children && menu.children.length > 0" :key="menu.path">
            <template #title>
              <el-icon><folder /></el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <MenuItem :menuList="menu.children" />
          </el-sub-menu>
          <el-menu-item :index="menu.path" :key="menu.path+'2'" v-else>
            <el-icon>
              <HomeFilled v-if="index == 0" />
              <Document v-else />
            </el-icon>
            <template #title>
              {{ menu.title }}
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
  import { computed, reactive, onMounted, watch } from 'vue'
  import { Folder, Document, HomeFilled } from '@element-plus/icons-vue'
  import MenuItem from './MenuItem.vue'
  import Logo from './Logo.vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'

  const route = useRoute()

  const state = reactive({
    defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
    groupData: computed(() => store.state.api.groups),
    menuLists: computed(() => store.state.api.menus),
    group: ''
  })

  const groupChangeHandler = () => {
    const find = state.groupData.find(group => group.name === state.group)
    store.dispatch('api/setDefaultGroup', find)
  }

  const setCollapseStyle = computed(() => {
    return ['layout-el-aside-br-color', 'layout-aside-pc-220'];
  })

  // 菜单高亮（详情时，父级高亮）
  const setParentHighlight = (currentRoute) => {
    const { path, meta } = currentRoute;
    const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/');
    if (pathSplit.length >= 4 && meta.isHide) return pathSplit.splice(0, 3).join('/');
    else return path;
  };

  // 页面加载时
  onMounted(() => {
    state.defaultActive = setParentHighlight(route);
  });

  // 路由更新时
  watch(route, (to) => {
    // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
    state.defaultActive = setParentHighlight(to);
  });

  watch(
    () => store.state.api.defaultGroup,
    (val) => {
      state.group = val.name
    }
  )
</script>
<style>
.layout-container .layout-el-aside-br-color {
  border-right: 0 !important;
}
.el-menu {
  border-right: 0 !important;
}
.el-menu-item, .el-sub-menu__title, .el-sub-menu .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
}
</style>
