import db from "../../api/users"

// initial state
const state = () => ({
	all: [],
})

// getters
const getters = {
	getLastUser: (state) => {
		return state.all[state.all.length - 1]
	} /* 
	getUserById: (state, id) => {
		return state.all[state.all[++id]]
	}, */,
}

// actions
const actions = {
	getAllUsers({ commit }) {
		db.getUsers((users) => {
			commit("setUsers", users)
		})
	},
	changeUserById({ commit }, user) {
		commit("changeUserById", user)
	},
	addNewUser({ commit, getters }, user) {
		let id = getters.getLastUser.id
		user.id = ++id
		commit("addNewUser", user)
	},
}

// mutations
const mutations = {
	setUsers(state, users) {
		state.all = users
	},
	addNewUser(state, user) {
		state.all.push(user)
	},
	changeUserById(state, user) {
		Object.assign(state.all[--user.id], user)
		/* state.all[user.id] = user */
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
