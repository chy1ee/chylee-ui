import { Session } from '../../utils/storage'

const tagsViewRoutesModule = {
	namespaced: true,
	state: {
		tagsViewRoutes: [],
		keepAliveNames: [],
		isTagsViewCurrenFull: false,
	},
	mutations: {
		// 设置 TagsView 路由
		getTagsViewRoutes(state, data) {
			state.tagsViewRoutes = data;
		},
		// 设置卡片全屏
		getCurrenFullscreen(state, bool) {
			Session.set('isTagsViewCurrenFull', bool);
			state.isTagsViewCurrenFull = bool;
		},
		// 设置路由缓存（name字段）
		getCacheKeepAlive(state, data) {
			if (state.keepAliveNames.indexOf(data) == -1)
				state.keepAliveNames.push(data)
		},
		delCacheKeepAlive(state, data) {
			const index = state.keepAliveNames.indexOf(data)
			if (index > -1)
				state.keepAliveNames.splice(index, 1)
		}
	},
	actions: {
		// 设置 TagsView 路由
		async setTagsViewRoutes({ commit }, data) {
			commit('getTagsViewRoutes', data);
		},
		// 设置卡片全屏
		setCurrenFullscreen({ commit }, bool) {
			commit('getCurrenFullscreen', bool);
		},
		// 设置路由缓存（name字段）
		async addCacheKeepAlive({ commit }, data) {
			commit('getCacheKeepAlive', data);
		},
		async removeCacheKeepAlive({ commit }, data) {
			commit('delCacheKeepAlive', data)
		}
	},
};

export default tagsViewRoutesModule;
