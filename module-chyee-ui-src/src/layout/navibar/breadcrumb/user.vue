<template>
  <div class="layout-navbars-breadcrumb-user" style="flex: 1">
    <!-- <el-dropdown :show-timeout="70" :hide-timeout="50">
			<span class="layout-navbars-breadcrumb-user-link">
				<img src="@/assets/logo.png" class="layout-navbars-breadcrumb-user-link-photo mr5" />
				chylee
				<el-icon class="el-icon--right">
					<ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">首页</el-dropdown-item>
					<el-dropdown-item divided command="logOut">退出</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown> -->
  </div>
</template>
<!-- <script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script> -->

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--next-color-user-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	::v-deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	::v-deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	::v-deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>