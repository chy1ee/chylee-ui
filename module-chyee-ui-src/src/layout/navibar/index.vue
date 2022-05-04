<template>
	<el-header class="layout-header" height="84px">
		<div class="layout-navbars-container">
			<div class="layout-navbars-breadcrumb-index">
				<Breadcrumb />
				<User />
			</div>
			<TagsView />
		</div>
	</el-header>
</template>
<script setup>
import Breadcrumb from './breadcrumb'
import TagsView from './tagsView'
import User from './breadcrumb/user'
</script>
<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
	height: 50px;
	display: flex;
	align-items: center;
	padding-right: 15px;
	background: #ffffff;
	border-bottom: 1px solid #f1f2f3;
}
</style>