import db from "../../api/users"

// initial state
const state = () => ({
	all: [],
})

// getters
const getters = {
	getLastUser: (state) => {
		return state.all[state.all.length - 1]
	},
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
		/* // if we need it in the task
		db.sendUsers(state.all) */
	},
	deleteUserById({ commit }, id) {
		commit("deleteUserById", id)
		/* // if we need it in the task
		db.sendUsers(state.all) */
	},
	addNewUser({ commit, getters }, user) {
		let id = getters.getLastUser.id
		user.id = ++id
		commit("addNewUser", user)
		/* // if we need it in the task
		db.sendUsers(state.all) */
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
		/* for (let i = 0; i < state.all.length; i++)
			if (state.all[i].id === user.id) {
				state.all.splice(i, 1, user)
				break
			} */
		state.all.splice(user.id - 1, 1, user)
	},
	deleteUserById(state, id) {
		for (let i = 0; i < state.all.length; i++)
			if (state.all[i].id === id) {
				state.all.splice(i, 1)
				break
			}
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
