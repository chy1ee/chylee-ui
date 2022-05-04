<template>
  <el-container class="layout-container">
    <Sidebar :menuList="dynamicRoutes" />
    <el-container class="flex-center">
      <Navibar />
      <el-scrollbar ref="layoutDefaultsScrollbarRef" class="layout-backtop">
				<el-main>
          <div class="h100">
            <Main />
          </div>
        </el-main>
			</el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from './Sidebar'
import Navibar from './navibar'
import Main from './Main'
import { dynamicRoutes } from '@/router'
</script>