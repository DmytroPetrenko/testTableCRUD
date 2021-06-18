<template>
	<v-data-table
		:headers="!isAddressExtended ? headers : extendedHeaders"
		:items="users"
		mobile-breakpoint="1000"
		sort-by="id"
		class="elevation-1"
	>
		<template v-slot:[`header.address.city`]="{ header }">
			{{ header.text }}
			<v-icon @click="openAddress(header, $event)">mdi-menu</v-icon>
		</template>
		<template v-slot:top>
			<v-toolbar flat>
				<v-toolbar-title>My Users CRUD From REST API</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
				<v-dialog v-model="dialog" max-width="600px">
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> New User </v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="text-h5">{{ formTitle }}</span>
						</v-card-title>

						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.name" label="Name"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.username" label="Username"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.email" label="Email"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.address.city" label="City"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.address.street" label="Street"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.address.suite" label="Suite"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field
											v-model="editedItem.address.zipcode"
											label="Zipcode"
										></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.website" label="Website"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-text-field v-model="editedItem.company.name" label="Company"></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
							<v-btn color="blue darken-1" text @click="save"> Save </v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				<v-dialog v-model="dialogDelete" max-width="600px">
					<v-card>
						<v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
							<v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</template>
		<template v-slot:[`item.actions`]="{ item }">
			<v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
			<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
		</template>
		<template v-slot:no-data>
			<v-btn color="primary" @click="initialize"> Reset </v-btn>
		</template>
	</v-data-table>
</template>
<script>
import { mapState, mapActions } from "vuex"
import _cloneDeep from "lodash/cloneDeep"
export default {
	data: () => ({
		dialog: false,
		dialogDelete: false,
		isAddressExtended: false,
		headers: [
			{
				text: "Name",
				align: "start",
				value: "name",
			},
			{ text: "Username", value: "username" },
			{ text: "Email", value: "email" },
			{ text: "Address", value: "address.city" },
			{ text: "Phone", value: "phone" },
			{ text: "Website", value: "website" },
			{ text: "Company", value: "company.name" },
			{ text: "Actions", value: "actions", sortable: false },
		],
		extendedHeaders: [
			{
				text: "Name",
				align: "start",
				value: "name",
			},
			{ text: "Username", value: "username" },
			{ text: "Email", value: "email" },
			{ text: "City", value: "address.city" },
			{ text: "Street", value: "address.street" },
			{ text: "Suite", value: "address.suite" },
			{ text: "Zipcode", value: "address.zipcode" },
			{ text: "Phone", value: "phone" },
			{ text: "Website", value: "website" },
			{ text: "Company", value: "company.name" },
			{ text: "Actions", value: "actions", sortable: false },
		],
		desserts: [],
		editedIndex: -1,
		editedItem: {
			name: "",
			username: "",
			email: "",
			address: {
				street: "",
				suite: "",
				city: "",
				zipcode: "",
				geo: {
					lat: "",
					lng: "",
				},
			},
			phone: "",
			website: "",
			company: {
				name: "",
				catchPhrase: "",
				bs: "",
			},
		},
		defaultItem: {
			name: "",
			username: "",
			email: "",
			address: {
				street: "",
				suite: "",
				city: "",
				zipcode: "",
				geo: {
					lat: "",
					lng: "",
				},
			},
			phone: "",
			website: "",
			company: {
				name: "",
				catchPhrase: "",
				bs: "",
			},
		},
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "New User" : "Edit User"
		},
		...mapState({
			users: (state) => state.users.all,
		}),
	},

	watch: {
		dialog(val) {
			val || this.close()
		},
		dialogDelete(val) {
			val || this.closeDelete()
		},
	},

	mounted() {
		this.initialize()
	},

	methods: {
		...mapActions("users", ["addNewUser", "changeUserById", "deleteUserById"]),

		initialize() {
			this.$store.dispatch("users/getAllUsers")
		},

		editItem(item) {
			this.editedIndex = this.users.indexOf(item)
			this.editedItem = _cloneDeep(item)
			this.dialog = true
		},

		deleteItem(item) {
			this.editedIndex = item.id
			this.editedItem = _cloneDeep(item)

			this.dialogDelete = true
		},

		deleteItemConfirm() {
			this.deleteUserById(this.editedIndex)

			this.closeDelete()
		},

		async close() {
			this.dialog = false
			await this.$nextTick()
			this.editedItem = _cloneDeep(this.defaultItem)
			this.editedIndex = -1
		},

		async closeDelete() {
			this.dialogDelete = false
			await this.$nextTick()
			this.editedItem = _cloneDeep(this.defaultItem)

			this.editedIndex = -1
		},

		save() {
			if (this.editedIndex > -1) {
				const id = { id: this.editedIndex }
				const newUser = Object.assign({}, id, this.editedItem)

				this.changeUserById(newUser)
			} else {
				this.addNewUser(this.editedItem)
			}
			this.close()
		},

		openAddress(header, event) {
			event.stopPropagation()
			this.isAddressExtended = !this.isAddressExtended
		},
	},
}
</script>
