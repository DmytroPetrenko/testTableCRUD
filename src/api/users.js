export default {
	getUsers(cb) {
		/* setTimeout(() => cb(_users), 100) */
		fetch("https://jsonplaceholder.typicode.com/users")
			.then((response) => response.json())
			/* .then((json) => console.log(json)) */
			.then((json) => cb(json))
	},
}
