import { Session } from '@/utils/storage'

const userModule = {
	namespaced: true,
	state: {
    name: Session.get('name'),
		token: Session.get('token'),
		menus: [],
		groups: [],
		tagViews: new Set(),
		defaultGroup: null,
		apiInfo: {}
	},
	mutations: {
		getToken(state, data) {
      Session.set('token', data)
		},
    getName(state, data) {
      Session.set('name', data)
    },
		getTagViews(state, data) {
			if (data) {
				data.forEach(function(item) {
					state.tagViews.add(item)
				})
			}
		},
		getMenus(state, data) {
			state.menus = data
		},
		getGroups(state, data) {
			state.groups = data
		},
		getDefaultGroup(state, data) {
			state.defaultGroup = data
		},
		getApiInfo(state, data) {
			state.apiInfo[data.group] = data.value
		}
	},
	actions: {
		setToken({ commit }, data) {
			commit('getToken', data);
		},
		setName({ commit }, data) {
			commit('getName', data);
		},
		setMenus({ commit }, data) {
			commit('getMenus', data.menuList)
			commit('getTagViews', data.tagViews)
		},
		setGroups({ commit }, data) {
			commit('getGroups', data)
		},
		setDefaultGroup({ commit }, data) {
			commit('getDefaultGroup', data)
		},
		setApiInfo({ commit }, data) {
			commit('getApiInfo', data)
		}
	},
};

export default userModule;
