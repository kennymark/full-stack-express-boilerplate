(function() {
  const pagination = document.querySelector('.pagination')
  const url = new URL(window.location.href)
  let currPage = url.searchParams.get('page')
  const inputText = document.querySelector('#searchUser')
  const submitButton = document.querySelector('#submitSearch')
  const tableBody = document.querySelector('#tBody')
  const appAlert = document.querySelectorAll('.app-alert')

  let userInput;

  if (inputText) {
    inputText.addEventListener('keyup', getUserVal)
    submitButton.addEventListener('click', searchUser)
      // tableBody.addEventListener('click', updateUser)
  }

  if (appAlert) {
    setTimeout(() => {
      appAlert.forEach(el => el.remove())
    }, 1000 * 60 * 2)
  }

  if (!navigator.onLine) {
    //
  }

  function searchUser() {
    fetch('/user/search')
      .then(res => res.json())
      .then(data => console.log(console.log(data)))
      .catch(err => console.log(err))
  }

  function deleteUser(e) {
    console.log(e)
    const id = e.target.dataset.id
    dbInteractor('edit', id, 'put');
  }

  function dbInteractor(route, id, reqType = 'get') {
    return fetch(`/user/${route}/${id}`, {
        method: `${reqType}`
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }


  function getUserVal(e) {
    userInput = e.target.value
  }

  if (pagination) {
    Array.from(pagination.children).forEach(child => {
      if (!currPage) currPage = 1
      if (parseInt(child.innerText) == currPage) {
        child.classList.add('active')
      } else child.classList.remove('active')
    })
  }


  (function scrollToLastPosition() {
    let lastYPos = localStorage.getItem('sPosition');
    window.scrollTo(0, lastYPos)

    window.addEventListener('scroll', setDefaultScrollPosition)


    function setDefaultScrollPosition(e) {
      return localStorage.setItem('sPosition', window.scrollY)
    }
  }())


}())