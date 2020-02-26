(function () {
  const pagination = document.querySelector('.pagination')
  const page = document.querySelectorAll('.nav-item')
  const profile_pwd = document.querySelector('#profile_pwd')
  const profile_new_pwd = document.querySelector('#profile_new_pwd')
  const pwd_confirmation = document.querySelector('#pwd_confirmation')
  const pwdUpdateBtn = document.querySelector('#update_pwd_btn')
  const url = new URL(window.location.href)
  let passwordVal = null;
  let currSearch = url.searchParams.get('page')
  const appAlert = document.querySelectorAll('.app-alert')

  if (appAlert) {
    setTimeout(() => {
      appAlert.forEach(el => el.remove())
    }, 1000 * 60 * 2)
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

  if (url.href.includes('profile') && !url.href.includes('admin')) {
    profile_new_pwd.addEventListener('keyup', comparePasswords)
    profile_pwd.addEventListener('keyup', e => {
      passwordVal = e.target.value
    })
  }

  function comparePasswords(e) {
    const { value } = e.target

    if (value !== passwordVal) {
      pwd_confirmation.textContent = 'Passwords do not match'
      pwd_confirmation.classList.add('text-danger')
      pwd_confirmation.classList.remove('text-success')
      pwdUpdateBtn.disabled = true
    }
    else {
      pwd_confirmation.textContent = 'Passwords match correctly'
      pwd_confirmation.classList.remove('text-danger')
      pwd_confirmation.classList.add('text-success')
      pwdUpdateBtn.disabled = false
    }
  }

  function selectDefaultGender() {
    const currSex = sessionStorage.getItem('gender')
    if (url.href.includes('profile') || url.href.includes('account/edit/')) {
      const radios = document.querySelectorAll('input[name=gender]')
      radios.forEach(radio => {
        radio.value === currSex ? radio.checked = true : false
      })
    }
  }

  function isAdmin() {
    const adminCheckbox = document.querySelector('input[name=is_admin]')
    const is_admin = sessionStorage.getItem('is_admin')

    console.log('is_admin', is_admin)

    if (Boolean(is_admin) === true) {
      // adminCheckbox.checked = true
    }
    else if (Boolean(is_admin) === false) {
      adminCheckbox.checked = false
    }

  }

  selectDefaultGender()
  isAdmin()
  scrollToLastPosition()
  setNavItemActive()
  paginate()

}())