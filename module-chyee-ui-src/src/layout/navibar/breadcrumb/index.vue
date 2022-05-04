<template>
  <div class="layout-navbars-breadcrumb">
    <el-icon class="layout-navbars-breadcrumb-icon" :size="16">
      <Fold />
    </el-icon>
    <el-breadcrumb class="layout-navbars-breadcrumb-hide">
			<transition-group name="breadcrumb" mode="out-in">
				<el-breadcrumb-item v-for="(v, k) in breadcrumbList" :key="v.meta.title">
					<span v-if="k === breadcrumbList.length - 1" class="layout-navbars-breadcrumb-span">
						{{ v.meta.title }}
					</span>
					<a v-else>
						{{ v.meta.title }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
  </div>
</template>
<script setup>
import { Fold } from '@element-plus/icons-vue' //Expand
const breadcrumbList = [
  { meta: { title: '首页' }},
  { meta: { title: '测试' }}
]
</script>
<style scoped lang="scss">
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;
	padding-left: 15px;
	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		margin-right: 15px;
		color: var(--next-bg-topBarColor);
	}
	.layout-navbars-breadcrumb-span {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}
	::v-deep(.el-breadcrumb__separator) {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	::v-deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
		font-weight: unset !important;
		color: var(--next-bg-topBarColor);
		&:hover {
			color: var(--el-color-primary) !important;
		}
	}
}
</style>