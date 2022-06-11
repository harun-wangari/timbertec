var error=false
fetch('/get_user', {
    method: 'GET',
}).then(function (response) {
    return response.json()
}).then(function (response) {
    document.getElementById('editsurname').value=response[0].surname
    document.getElementById('editothernames').value = response[0].othername
    document.getElementById('editusername').value = response[0].username
    document.getElementById('editemail').value = response[0].email
})

var btnback = document.getElementById('btnback')
btnback.addEventListener('click', function (e) {
    window.history.back()
})

var form = document.getElementById('edit')
form.addEventListener('click',function(e){
    if(e.target.classList.contains('fa-edit')){
        if (e.target.parentElement.parentElement.children[1].children[0].id=='editpassword'){
            document.getElementById('editconfirmpassword').disabled = false
        }
        e.target.parentElement.parentElement.children[1].children[0].disabled=false
        e.target.parentElement.parentElement.children[1].children[0].focus()
        e.target.style.color='grey'
    }
})

var editsurname = document.getElementById('editsurname')
editsurname.addEventListener('blur', function(e) {
    editsurname.disabled = true
    editsurname.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
})

var editothernames = document.getElementById('editothernames')
editothernames.addEventListener('blur', function (e) {
    editothernames.disabled = true
    editothernames.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
})

var editusername = document.getElementById('editusername')
editusername.addEventListener('blur', function (e) {
    editusername.disabled = true
    editusername.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
})

var editemail = document.getElementById('editemail')
editemail.addEventListener('blur', function (e) {
    editemail.disabled = this.removeAttributeNode
    editemail.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
})

var editpassword = document.getElementById('editpassword')
editpassword .addEventListener('blur', function (e) {
    var password = document.getElementById('editconfirmpassword')
    password.focus()
    if(document.activeElement===password){

    }else{
        editpassword.disabled = true
        password.disabled = true
        editpassword.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
    }
})

var password = document.getElementById('editconfirmpassword')
password.addEventListener('blur', function (e) {
    password.disabled = true
    var editpassword = document.getElementById('editpassword')
    editpassword.parentElement.parentElement.children[2].children[0].focus()
    console.log(document.activeElement)
    if (document.activeElement === editpassword.parentElement.parentElement.children[2].children[0]) {

    } else {
        editpassword.disabled = true
        password.disabled = true
        editpassword.parentElement.parentElement.children[2].children[0].classList.add('fa-edit')
        editpassword.parentElement.parentElement.children[2].children[0].style.color = 'dodgerblue'
        editpassword.parentElement.parentElement.children[2].children[0].classList.remove('fa-save')
    }
})

var btnsignup = document.getElementById('btnupdate')
btnsignup.addEventListener('click', function (e) {
    error = false
    var surname = document.getElementById("editsurname")
    var othernames = document.getElementById("editothernames")
    var username = document.getElementById("editusername")
    var email = document.getElementById("editemail")
    var password = document.getElementById("editpassword")
    var confirmpassword = document.getElementById("editconfirmpassword")
    if (surname.value.trim() == '') {
        surname.parentElement.parentElement.children[3].classList.remove('hidden')
        surname.style.borderColor = 'red'
        surname.parentElement.parentElement.children[3].classList.remove('hidden')
        surname.parentElement.parentElement.children[3].innerHTML = "enter your surname\n"
        error = true
    } else {
        surname.style.borderColor = 'green'
        surname.parentElement.parentElement.children[3].classList.add('hidden')
        if (surname.value.trim().length < 3) {
            surname.style.borderColor = 'red'
            surname.parentElement.parentElement.children[3].classList.remove('hidden')
            surname.parentElement.parentElement.children[3].innerHTML = "surname too short. surname should be 3 or more characters"
            error = true
        }
    }
    if (othernames.value.trim() == '') {
        othernames.style.borderColor = 'red'
        othernames.parentElement.parentElement.children[3].classList.remove('hidden')
        othernames.parentElement.parentElement.children[3].innerHTML = "enter othernames\n"
        error = true
    } else {
        othernames.style.borderColor = 'green'
        othernames.parentElement.parentElement.children[3].classList.add('hidden')
        if (othernames.value.trim().length < 3) {
            othernames.style.borderColor = 'red'
            othernames.parentElement.parentElement.children[3].classList.remove('hidden')
            othernames.parentElement.parentElement.children[3].innerHTML = "names too short.should be 3 or more characters"
            error = true
        }
    }
    if (username.value.trim() == '') {
        username.style.borderColor = 'red'
        username.parentElement.parentElement.children[3].classList.remove('hidden')
        username.parentElement.parentElement.children[3].innerHTML = "enter your username\n"
        error = true
    } else {
        username.style.borderColor = 'green'
        username.parentElement.parentElement.children[3].classList.add('hidden')
        if (username.value.trim().length < 4) {
            username.style.borderColor = 'red'
            username.parentElement.parentElement.children[3].classList.remove('hidden')
            username.parentElement.parentElement.children[3].innerHTML = "username too short. should be 4 or more characters"
            error = true
        }
    }
    if (email.value.trim() == '') {
        email.style.borderColor = 'red'
        email.parentElement.parentElement.children[3].classList.remove('hidden')
        email.parentElement.parentElement.children[3].innerHTML = "enter your email address"
        error = true
    } else {
        email.style.borderColor = 'green'
        email.parentElement.parentElement.children[3].classList.add('hidden')
        if (!(email.endsWith('@gmail.com') || email.endsWith('@protonmail.com') || email.endsWith('@zoho.com') || email.endsWith('@outlook.com') || email.endsWith('@hotmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@aim.com') || email.endsWith('@icloud.com') || email.endsWith('@yandex.com'))) {
            email.style.borderColor = 'red'
            email.parentElement.parentElement.children[3].classList.remove('hidden')
            email.parentElement.parentElement.children[3].innerHTML = "invalid email address. please enter a valid email address"
            error = true
        }
    }
    console.log(password.value.trim() )
    if (password.value.trim() == '') {
        if (!error) {
            fetch('/update_account', {
                method: 'POST',
                body: JSON.stringify({ surname: surname.value.trim(), othernames: othernames.value.trim(), username: username.value.trim(), email: email.value.trim() })
            }).then(function (response) {
                return response.json()
            }).then(function (response) {
                var msg = document.getElementById('editmsg')
                msg.innerHTML = response.result
                msg.classList.remove('hidden')
                setTimeout(function (e) {
                    msg.classList.add('hidden')
                }, 4000)
            })
        }
    } else {
        password.style.borderColor = 'green'
        password.parentElement.parentElement.children[3].classList.add('hidden')
        if (password.value.trim().length < 8) {
            password.style.borderColor = 'red'
            password.parentElement.parentElement.children[3].classList.remove('hidden')
            password.parentElement.parentElement.children[3].innerHTML = "password too short. password should be atleast 8 characters"
            error = true
        }
        else if (confirmpassword.value.trim() == '') {
            confirmpassword.style.borderColor = 'red'
            confirmpassword.parentElement.parentElement.children[2].classList.remove('hidden')
            confirmpassword.parentElement.parentElement.children[2].innerHTML = "confirm  password"
            error = true
        }
        else if (!(confirmpassword.value.trim().localeCompare(password.value.trim()) == 0)) {
            confirmpassword.style.borderColor = 'red'
            confirmpassword.parentElement.parentElement.children[2].classList.remove('hidden')
            confirmpassword.parentElement.parentElement.children[2].innerHTML = "password don't match. please enter the correct password"
            error = true
        }
        else {
            confirmpassword.style.borderColor = 'green'
            confirmpassword.parentElement.parentElement.children[2].classList.add('hidden')
        }
        if (!error) {
            fetch('/update_account_all', {
                method: 'POST',
                body: JSON.stringify({ surname: surname.value.trim(), othernames: othernames.value.trim(), username: username.value.trim(), email: email.value.trim(), password: password.value.trim() })
            }).then(function (response) {
                return response.json()
            }).then(function (response) {
                var msg = document.getElementById('editmsg')
                msg.innerHTML = response.result
                msg.classList.remove('hidden')
                setTimeout(function (e) {
                    msg.classList.add('hidden')
                }, 4000)
            })
        }
    }

})