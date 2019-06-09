(function() {
  const pagination = document.querySelector('.pagination')
  const page = document.querySelectorAll('.nav-item')
  const url = new URL(window.location.href)
  let currSearch = url.searchParams.get('page')
    // const inputText = document.querySelector('#searchUser')
    // const submitButton = document.querySelector('#submitSearch')
    // const tableBody = document.querySelector('#tBody')
  const appAlert = document.querySelectorAll('.app-alert')





  if (appAlert) {
    setTimeout(() => {
      appAlert.forEach(el => el.remove())
    }, 1000 * 60 * 2)
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

  function paginate() {
    if (pagination) {
      Array.from(pagination.children).forEach(child => {
        if (!currSearch) currSearch = 1
        if (parseInt(child.innerText) == currSearch) {
          child.classList.add('active')
        } else child.classList.remove('active')
      })
    }
  }


  function setNavItemActive() {
    Array.from(page).forEach(child => {
      const val = child.textContent.toLowerCase()
      val == 'home' ? '/' : null;
      console.log(val)
      console.log(url.href.includes(val))

      console.dir(child)
    })
  }


  function scrollToLastPosition() {
    let lastYPos = localStorage.getItem('sPosition');
    window.addEventListener('scroll', setDefaultScrollPosition)

    if (location.href.includes('user')) {
      window.scrollTo(0, lastYPos)
    }

    function setDefaultScrollPosition(_) {
      return localStorage.setItem('sPosition', window.scrollY)
    }
  }

  scrollToLastPosition()
  setNavItemActive()
  paginate()

}())