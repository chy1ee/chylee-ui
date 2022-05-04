<template>
  <template v-for="menu in menuList">
    <el-sub-menu :index="menu.path" :key="menu.path" v-if="menu.children && menu.children.length > 0">
			<template #title>
				<el-icon><folder /></el-icon>
				<span>{{ menu.title }}</span>
			</template>
			<menu-item :menuList="menu.children" />
		</el-sub-menu>
    <el-menu-item :index="menu.path" :key="menu.path" v-else>
      <el-icon><Document /></el-icon>
      {{ menu.title }}
		</el-menu-item>
  </template>
</template>
<script>
  import { defineComponent, computed } from 'vue'
  import { Folder, Document } from '@element-plus/icons-vue'

  export default defineComponent({
    props: {
      menuList: {
        type: Array,
        default: () => [],
      }
    },
    components: {
      Folder, Document
    },
    setUp(props) {
      const menuList = computed(() => {
        return props.menuList;
      });

      return {
        menuList
      }
    }
  })
</script>