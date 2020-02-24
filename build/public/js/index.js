"use strict";
(function () {
    var pagination = document.querySelector('.pagination');
    var page = document.querySelectorAll('.nav-item');
    var profile_pwd = document.querySelector('#profile_pwd');
    var profile_new_pwd = document.querySelector('#profile_new_pwd');
    var pwd_confirmation = document.querySelector('#pwd_confirmation');
    var pwdUpdateBtn = document.querySelector('#update_pwd_btn');
    var url = new URL(window.location.href);
    var passwordVal = null;
    var currSearch = url.searchParams.get('page');
    var appAlert = document.querySelectorAll('.app-alert');
    if (appAlert) {
        setTimeout(function () {
            appAlert.forEach(function (el) { return el.remove(); });
        }, 1000 * 60 * 2);
    }
    function paginate() {
        if (pagination) {
            Array.from(pagination.children).forEach(function (child) {
                if (!currSearch)
                    currSearch = 1;
                if (parseInt(child.innerText) == currSearch) {
                    child.classList.add('active');
                }
                else
                    child.classList.remove('active');
            });
        }
    }
    function setNavItemActive() {
        Array.from(page).forEach(function (child) {
            var val = child.textContent.toLowerCase();
            val == 'home' ? '/' : null;
        });
    }
    function scrollToLastPosition() {
        var lastYPos = localStorage.getItem('sPosition');
        window.addEventListener('scroll', setDefaultScrollPosition);
        if (location.href.includes('user')) {
            window.scrollTo(0, lastYPos);
        }
        function setDefaultScrollPosition(_) {
            return localStorage.setItem('sPosition', window.scrollY);
        }
    }
    if (url.href.includes('profile') && !url.href.includes('admin')) {
        profile_new_pwd.addEventListener('keyup', comparePasswords);
        profile_pwd.addEventListener('keyup', function (e) {
            passwordVal = e.target.value;
        });
    }
    function comparePasswords(e) {
        var value = e.target.value;
        if (value !== passwordVal) {
            pwd_confirmation.textContent = 'Passwords do not match';
            pwd_confirmation.classList.add('text-danger');
            pwd_confirmation.classList.remove('text-success');
            pwdUpdateBtn.disabled = true;
        }
        else {
            pwd_confirmation.textContent = 'Passwords match correctly';
            pwd_confirmation.classList.remove('text-danger');
            pwd_confirmation.classList.add('text-success');
            pwdUpdateBtn.disabled = false;
        }
    }
    function selectDefaultGender() {
        var currSex = sessionStorage.getItem('gender');
        if (url.href.includes('profile') || url.href.includes('user/edit/')) {
            var radios = document.querySelectorAll('input[name=gender]');
            radios.forEach(function (radio) {
                radio.value === currSex ? radio.checked = true : false;
            });
        }
    }
    function isAdmin() {
        var adminCheckbox = document.querySelector('input[name=is_admin]');
        var is_admin = sessionStorage.getItem('is_admin');
        console.log('is_admin', is_admin);
        if (Boolean(is_admin) === true) {
            // adminCheckbox.checked = true
        }
        else if (Boolean(is_admin) === false) {
            adminCheckbox.checked = false;
        }
    }
    selectDefaultGender();
    isAdmin();
    scrollToLastPosition();
    setNavItemActive();
    paginate();
}());
