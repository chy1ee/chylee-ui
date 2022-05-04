import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

export const dynamicRoutes = [
  {
    path: '/',
    name: 'Index',
    component: Layout,
    redirect: '/home',
    meta: { title: '首页', isKeepAlive: true },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页', isKeepAlive: true, isAffix: true }
      }
    ]
  }, {
    path: '/api',
    name: 'Api',
    component: Layout,
    redirect: '/api',
    meta: { title: 'API调试' },
    children: [
      {
        path: '/api/info/:group/:name',
        name: 'ApiInfo',
        component: () => import('@/views/api/Index.vue'),
        meta: { title: 'API调试', isKeepAlive: true }
      }
    ]
  }
]

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
 export function formatFlatteningRoutes(arr) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
 export function formatTwoStageRoutes(arr) {
	if (arr.length <= 0) return false;
	const newArr = [];
	const cacheList = [];
	arr.forEach((v) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			// 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
			// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 路径：/@/layout/routerView/parent.vue
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				// store.dispatch('keepAliveNames/setCacheKeepAlive', cacheList);
			}
		}
	});
	return newArr;
}

store.dispatch('tagsViewRoutes/setTagsViewRoutes', formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);

const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes: dynamicRoutes
})
export default router
