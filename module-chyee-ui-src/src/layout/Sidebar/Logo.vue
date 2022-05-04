<template>
	<div class="layout-logo">
		<img src="@/assets/logo.png" class="layout-logo-medium-img" />
		<span>Chylee接口调试器</span>
	</div>
</template>
<style lang="scss">
.layout-logo {
	width: 300px;
	height: 50px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	// justify-content: center;
	background-color: #303643;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--el-color-primary);
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: 20px;
		margin-right: 5px;
	}
}
</style>