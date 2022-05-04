<template>
  <div class="layout-navbars-tagsview layout-navbars-tagsview-shadow">
    <el-scrollbar ref="scrollbarRef">
      <ul class="layout-navbars-tagsview-ul" ref="tagsUlRef">
				<li
					v-for="(v, k) in tagsViewList"
					:key="k"
					class="layout-navbars-tagsview-ul-li"
					:data-url="v.url"
					:class="{ 'is-active': isActive(v) }"
					@click="onTagsClick(v, k)"
					:ref="
						(el) => {
							if (el) tagsRefs[k] = el;
						}
					"
				>
          <span>{{ v.title||v.meta.title }}</span>
					<el-icon 
						class="layout-navbars-tagsview-ul-li-icon layout-icon-active" 
						v-if="!v.meta.isAffix && isActive(v)"
						@click.stop="closeCurrentTagsView(isShareTagsView ? v.path : v.url)"
					>
						<Close />
					</el-icon>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
import { ref, defineComponent, reactive, toRefs, nextTick, getCurrentInstance, onMounted, watch } from "vue"
import { useRoute, useRouter } from 'vue-router'
import { Session } from '@/utils/storage'
import { isObjectValueEqual } from '@/utils/arrayUtil'
import store from '@/store'
import { Close } from '@element-plus/icons-vue'
import { swaggerResource, swaggerApi } from '@/api/swagger'
import { converToMenus } from '@/utils/menuUtils'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
	components: {
		Close
	},
  setup() {
    const route = useRoute()
    const router = useRouter()

    const isShareTagsView = false
    const isCacheTagsView = false

    const tagsRefs = ref([])
    const { proxy } = getCurrentInstance();

    const state = reactive({
      tagsViewList: [ { url: '/', meta: { title: '首页' }} ],
      routeActive: '',
			routePath: route.path,
			dropdown: { x: '', y: '' },
			tagsRefsIndex: 0,
			sortable: '',
			tagsViewRoutesList: [],
			menuList: []
    })

    const isActive = (v) => {
     if (isShareTagsView) {
				return v.path === state.routePath;
			} else {
				return v.url ? v.url === state.routeActive : v.path === state.routeActive;
			}
    } 

    const onTagsClick = (v, k) => {
      state.tagsRefsIndex = k;
			router.push(v);
    }

		const closeCurrentTagsView = (path) => {
			state.tagsViewList.map((v, k, arr) => {
				if (!v.meta.isAffix) {
					if (isShareTagsView ? v.path === path : v.url === path) {
						state.tagsViewList.splice(k, 1);
						// 不允许清除缓存，以免其他测试页数据丢失
						// store.dispatch('tagsViewRoutes/removeCacheKeepAlive', v.name)
						setTimeout(() => {
							if (state.tagsViewList.length === k && isShareTagsView ? state.routePath === path : state.routeActive === path) {
								// 最后一个且高亮时
								if (arr[arr.length - 1].meta.isDynamic) {
									// 动态路由（xxx/:id/:name"）
									if (k !== arr.length) router.push({ name: arr[k].name, params: arr[k].params });
									else router.push({ name: arr[arr.length - 1].name, params: arr[arr.length - 1].params });
								} else {
									// 普通路由
									if (k !== arr.length) router.push({ path: arr[k].path, query: arr[k].query });
									else router.push({ path: arr[arr.length - 1].path, query: arr[arr.length - 1].query });
								}
							} else {
								// 非最后一个且高亮时，跳转到下一个
								if (state.tagsViewList.length !== k && isShareTagsView ? state.routePath === path : state.routeActive === path) {
									if (arr[k].meta.isDynamic) {
										// 动态路由（xxx/:id/:name"）
										router.push({ name: arr[k].name, params: arr[k].params });
									} else {
										// 普通路由
										router.push({ path: arr[k].path, query: arr[k].query });
									}
								}
							}
						}, 0);
					}
				}
			});
			addBrowserSetSession(state.tagsViewList);
		}

    // 处理 tagsView 高亮（多标签详情时使用，单标签详情未使用）
		const setTagsViewHighlight = (v) => {
			let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
			if (!params || Object.keys(params).length <= 0) return v.path;
			let path = '';
			for (let i in params) {
				path += params[i];
			}
			// 判断是否是动态路由（xxx/:id/:name"）
			return `${v.meta.isDynamic ? v.meta.isDynamicPath : v.path}-${path}`;
		}

    // 1、添加 tagsView：未设置隐藏（isHide）也添加到在 tagsView 中（可开启多标签详情，单标签详情）
		const addTagsView = (path, to) => {
			// 防止拿取不到路由信息
			nextTick(async () => {
				// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
				let item = '';
				if (to && to.meta.isDynamic) {
					// 动态路由（xxx/:id/:name"）：参数不同，开启多个 tagsview
					if (!isShareTagsView) await solveAddTagsView(path, to);
					else await singleAddTagsView(path, to);
					if (state.tagsViewList.some((v) => v.path === to.meta.isDynamicPath)) return false;
					item = state.tagsViewRoutesList.find((v) => v.path === to.meta.isDynamicPath);
				} else {
					// 普通路由：参数不同，开启多个 tagsview
					if (!isShareTagsView) await solveAddTagsView(path, to);
					else await singleAddTagsView(path, to);
					if (state.tagsViewList.some((v) => v.path === path)) return false;
					item = state.tagsViewRoutesList.find((v) => v.path === path);
				}
				if (item.meta.isLink && !item.meta.isIframe) return false;
				if (to && to.meta.isDynamic) item.params = to?.params ? to?.params : route.params;
				else item.query = to?.query ? to?.query : route.query;
				item.url = setTagsViewHighlight(item);
				state.tagsViewList.push({ ...item });
				addBrowserSetSession(state.tagsViewList);
			});
		}

    // 处理可开启多标签详情，单标签详情（动态路由（xxx/:id/:name"），普通路由处理）
		const solveAddTagsView = async (path, to) => {
			let isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path;
			let current = state.tagsViewList.filter(
				(v) =>
					v.path === isDynamicPath &&
					isObjectValueEqual(
						to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
						to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
					)
			);
			if (current.length <= 0) {
				// 防止：Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
				let findItem = state.tagsViewRoutesList.find((v) => v.path === isDynamicPath);
				if (findItem.meta.isAffix) return false;
				if (findItem.meta.isLink && !findItem.meta.isIframe) return false;
				to.meta.isDynamic ? (findItem.params = to.params) : (findItem.query = to.query);
				findItem.url = setTagsViewHighlight(findItem);
				const menu = state.menuList.find(menu => menu.name === to.params.name)
				if (menu) {
					findItem.title = menu.title
					state.tagsViewList.push({ ...findItem })
					addBrowserSetSession(state.tagsViewList)
				}
			}
		};

    // 处理单标签时，第二次的值未覆盖第一次的 tagsViewList 值（Session Storage）
		const singleAddTagsView = (path, to) => {
			let isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path;
			state.tagsViewList.forEach((v) => {
				if (
					v.path === isDynamicPath &&
					!isObjectValueEqual(
						to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
						to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
					)
				) {
					to.meta.isDynamic ? (v.params = to.params) : (v.query = to.query);
					v.url = setTagsViewHighlight(v);
					addBrowserSetSession(state.tagsViewList);
				}
			});
		};

    // 存储 tagsViewList 到浏览器临时缓存中，页面刷新时，保留记录
		const addBrowserSetSession = (tagsViewList) => {
			Session.set('tagsViewList', tagsViewList);
		};

    // 获取 tagsView 的下标：用于处理 tagsView 点击时的横向滚动
		const getTagsRefsIndex = (path) => {
			nextTick(async () => {
				// await 使用该写法，防止拿取不到 tagsViewList 列表数据不完整
				let tagsViewList = await state.tagsViewList;
				state.tagsRefsIndex = tagsViewList.findIndex((v) => {
					if (isShareTagsView) {
						return v.path === path;
					} else {
						return v.url === path;
					}
				});
				// 添加初始化横向滚动条移动到对应位置
				tagsViewmoveToCurrentTag();
			});
		}

    // tagsView 横向滚动
		const tagsViewmoveToCurrentTag = () => {
			nextTick(() => {
				if (tagsRefs.value.length <= 0) return false;
				// 当前 li 元素
				let liDom = tagsRefs.value[state.tagsRefsIndex];
				// 当前 li 元素下标
				let liIndex = state.tagsRefsIndex;
				// 当前 ul 下 li 元素总长度
				let liLength = tagsRefs.value.length;
				// 最前 li
				let liFirst = tagsRefs.value[0];
				// 最后 li
				let liLast = tagsRefs.value[tagsRefs.value.length - 1];
				// 当前滚动条的值
				let scrollRefs = proxy.$refs.scrollbarRef.$refs.wrap$;
				// 当前滚动条滚动宽度
				let scrollS = scrollRefs.scrollWidth;
				// 当前滚动条偏移宽度
				let offsetW = scrollRefs.offsetWidth;
				// 当前滚动条偏移距离
				let scrollL = scrollRefs.scrollLeft;
				// 上一个 tags li dom
				let liPrevTag = tagsRefs.value[state.tagsRefsIndex - 1];
				// 下一个 tags li dom
				let liNextTag = tagsRefs.value[state.tagsRefsIndex + 1];
				// 上一个 tags li dom 的偏移距离
				let beforePrevL = '';
				// 下一个 tags li dom 的偏移距离
				let afterNextL = '';
				if (liDom === liFirst) {
					// 头部
					scrollRefs.scrollLeft = 0;
				} else if (liDom === liLast) {
					// 尾部
					scrollRefs.scrollLeft = scrollS - offsetW;
				} else {
					// 非头/尾部
					if (liIndex === 0) beforePrevL = liFirst.offsetLeft - 5;
					else beforePrevL = liPrevTag?.offsetLeft - 5;
					if (liIndex === liLength) afterNextL = liLast.offsetLeft + liLast.offsetWidth + 5;
					else afterNextL = liNextTag.offsetLeft + liNextTag.offsetWidth + 5;
					if (afterNextL > scrollL + offsetW) {
						scrollRefs.scrollLeft = afterNextL - offsetW;
					} else if (beforePrevL < scrollL) {
						scrollRefs.scrollLeft = beforePrevL;
					}
				}
			});
		}

    // 获取 vuex 中的 tagsViewRoutes 列表
		const getTagsViewRoutes = async () => {
			state.routeActive = await setTagsViewHighlight(route);
			state.routePath = (await route.meta.isDynamic) ? route.meta.isDynamicPath : route.path;
			state.tagsViewList = [];
			state.tagsViewRoutesList = store.state.tagsViewRoutes.tagsViewRoutes;
			initTagsView();
		};

    // vuex 中获取路由信息：如果是设置了固定的（isAffix），进行初始化显示
		const initTagsView = async () => {
			if (Session.get('tagsViewList') && isCacheTagsView) {
				state.tagsViewList = await Session.get('tagsViewList');
			} else {
				state.tagsViewRoutesList.map((v) => {
					if (v.meta.isAffix && !v.meta.isHide) {
						v.url = setTagsViewHighlight(v);
						state.tagsViewList.push({ ...v });
					}
				});
				
				swaggerResource().then(res => {
					if (res && res.length > 0) {
						const groundName = route.params.group
						const defaultGroup = groundName ? res.find(group => group.name === groundName) : res[0]
						swaggerApi(defaultGroup.url).then(res2 => {
							if (!res2.openapi) {
								ElMessageBox.alert("很抱歉！系统暂时只支持文档类型OAS_30。", "错误", { type: 'error' })
								return
							}
							
							store.dispatch('api/setGroups', res)

							const result = converToMenus(defaultGroup.name, res2)
							addToStateMenuList(result.tagViews)
							store.dispatch('api/setGroups', res)
							store.dispatch('api/setMenus', result)
							store.dispatch('api/setApiInfo', {
								group: defaultGroup.name,
								value: res2
							})
							store.dispatch('api/setDefaultGroup', defaultGroup)
							const menu = state.menuList.find(menu => menu.name === route.params.name)
							if (menu)
								route.title = menu.title

							addTagsView(route.path, route);
						})
					}
					else
						addTagsView(route.path, route);
				})

				
			}
			// 初始化当前元素(li)的下标
			getTagsRefsIndex(isShareTagsView ? state.routePath : state.routeActive);
		};

		const addToStateMenuList = (menus) => {
			if (!menus) return
			menus.forEach((menu) => {
				const find = state.menuList.find(item => item.name === menu.name)
				if (!find)
					state.menuList.push(menu)
			})
		}

    // 页面加载时
		onMounted(() => {
			// 初始化 vuex 中的 tagsViewRoutes 列表
			getTagsViewRoutes();
		});

    // 路由更新时
		// onBeforeRouteUpdate(async (to) => {
		// 	store.dispatch("tagsViewRoutes/addCacheKeepAlive", to.name)
		// 	state.routeActive = setTagsViewHighlight(to);
		// 	state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path;
		// 	addTagsView(to.path, to);
		// 	getTagsRefsIndex(isShareTagsView ? state.routePath : state.routeActive);
		// });

		watch(route, (to) => {
			if( to.meta.isKeepAlive)
				store.dispatch("tagsViewRoutes/addCacheKeepAlive", to.name)
			state.routeActive = setTagsViewHighlight(to);
			state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path;
			addTagsView(to.path, to);
			getTagsRefsIndex(isShareTagsView ? state.routePath : state.routeActive);
		})

		watch(
			() => store.state.api.defaultGroup,
			(valNew, valOld) => {
				if (valOld === null) return
				swaggerApi(valNew.url).then(res => {
					const result = converToMenus(valNew.name, res)
					addToStateMenuList(result.tagViews)
					store.dispatch('api/setMenus', result)
					store.dispatch('api/setApiInfo', {
						group: valNew.name,
						value: res
					})
				})
			}
		)


    return {
      tagsRefs,
      ...toRefs(state),
      isActive,
      onTagsClick,
			closeCurrentTagsView
    }
  }
})
</script>
<style scoped lang="scss">
.layout-navbars-tagsview {
	background-color: #ffffff;
	border-bottom: 1px solid #f1f2f3;
	position: relative;
	z-index: 4;
	::v-deep(.el-scrollbar__wrap) {
		overflow-x: auto !important;
	}
	&-ul {
		list-style: none;
		margin: 0;
		padding: 0;
		height: 34px;
		display: flex;
		align-items: center;
		color: #606266;
		font-size: 12px;
		white-space: nowrap;
		padding: 0 15px;
		&-li {
			height: 26px;
			line-height: 26px;
			display: flex;
			align-items: center;
			border: 1px solid #e6e6e6;
			padding: 0 15px;
			margin-right: 5px;
			border-radius: 2px;
			position: relative;
			z-index: 0;
			cursor: pointer;
			justify-content: space-between;
			&:hover {
				background-color: #ecf5ff;
				color: #409eff;
				border-color: #b3d8ff;
			}
			&-iconfont {
				position: relative;
				left: -5px;
				font-size: 12px;
			}
			&-icon {
				border-radius: 100%;
				position: relative;
				height: 14px;
				width: 14px;
				text-align: center;
				line-height: 14px;
				right: -5px;
				&:hover {
					color: #ffffff;
					background-color: #79bbff;
				}
			}
			.layout-icon-active {
				display: block;
			}
			.layout-icon-three {
				display: none;
			}
		}
		.is-active {
			color: #ffffff;
			background: #409eff;
			border-color: #409eff;
			transition: border-color 3s ease;
		}
	}
}
</style>