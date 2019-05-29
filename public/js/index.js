const inputText = document.querySelector('#searchUser')
const submitButton = document.querySelector('#submitSearch')
const tableBody = document.querySelector('#tBody')
const appAlert = document.querySelector('.app-alert')

let userInput

if (inputText) {
	inputText.addEventListener('keyup', getUserVal)
	submitButton.addEventListener('click', searchUser)
	tableBody.addEventListener('click', updateUser)
}

if (appAlert) {
	setTimeout(() => {
		appAlert.remove()
	}, 6000)
}

function getUserVal(e) {
	userInput = e.target.value
}

function searchUser() {
	fetch('/user/search')
		.then(res => res.json())
		.then(data => console.log(console.log(data)))
		.catch(err => console.log(err))
}

function updateUser(e) {
	const id = e.target.dataset.id
	console.dir(e.target)
	// console.log(id);
	// dbInteractor('edit', id, 'put');
}

function deleteUser(e) {
	console.log(e)

	// const id = e.target.dataset.id;
	// dbInteractor('delete', id, 'delete');
}

function dbInteractor(route, id, reqType = 'get') {
	return fetch(`/user/${route}/${id}`, {
		method: `${reqType}`
	})
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(err => console.log(err))
}
const newRes = new XMLHttpRequest()
newRes.addEventListener('readystatechange', function(e) {
	console.log(e)
})
console.log('hello')
