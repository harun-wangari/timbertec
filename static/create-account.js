var btnsignup = document.getElementById('btnsignup')
btnsignup.addEventListener('click', function (e) {
    error=false
    var surname = document.getElementById("txtsurname")
    var othernames = document.getElementById("txtothernames")
    var username = document.getElementById("txtusername")
    var email = document.getElementById("txtemail")
    var password = document.getElementById("txtpassword")
    var confirmpassword = document.getElementById("txtconfirmpassword")
    if (surname.value.trim() == '') {
        surname.style.borderColor='red'
        surname.parentElement.children[2].classList.remove('hidden')
        surname.parentElement.children[2].innerHTML = "enter your surname\n"
        error = true
    } else {
        surname.style.borderColor = 'green'
        surname.parentElement.children[2].classList.add('hidden')
        if (surname.value.trim().length < 3) {
            surname.style.borderColor = 'red'
            surname.parentElement.children[2].classList.remove('hidden')
            surname.parentElement.children[2].innerHTML =  "surname too short. surname should be 3 or more characters"
            error = true
        }
    }
    if (othernames.value.trim()== '') {
        othernames.style.borderColor = 'red'
        othernames.parentElement.children[2].classList.remove('hidden')
        othernames.parentElement.children[2].innerHTML = "enter othernames\n"
        error = true
    } else {
        othernames.style.borderColor = 'green'
        othernames.parentElement.children[2].classList.add('hidden')
        if (othernames.value.trim().length < 3) {
            othernames.style.borderColor = 'red'
            othernames.parentElement.children[2].classList.remove('hidden')
            othernames.parentElement.children[2].innerHTML = "names too short.should be 3 or more characters"
            error = true
        }
    }
    if (username.value.trim() == '') {
        username.style.borderColor = 'red'
        username.parentElement.children[2].classList.remove('hidden')
        username.parentElement.children[2].innerHTML = "enter your username\n"
        error = true
    } else {
        username.style.borderColor = 'green'
        username.parentElement.children[2].classList.add('hidden')
        if (username.value.trim().length < 4) {
            username.style.borderColor = 'red'
            username.parentElement.children[2].classList.remove('hidden')
            username.parentElement.children[2].innerHTML = "username too short. should be 4 or more characters"
            error = true
        }
    }
    if (email.value.trim() == '') {
        email.style.borderColor = 'red'
        email.parentElement.children[2].classList.remove('hidden')
        email.parentElement.children[2].innerHTML = "enter your email address"
        error = true
    }else{
        email.style.borderColor = 'green'
        email.parentElement.children[2].classList.add('hidden')
        if (!(email.value.endsWith('@gmail.com') || email.value.endsWith('@protonmail.com') || email.value.endsWith('@zoho.com') || email.value.endsWith('@outlook.com') || email.value.endsWith('@hotmail.com') || email.endsWith('@yahoo.com') || email.value.endsWith('@aim.com') || email.value.endsWith('@icloud.com') || email.value.endsWith('@yandex.com'))) {
            email.style.borderColor = 'red'
            email.parentElement.children[2].classList.remove('hidden')
            email.parentElement.children[2].innerHTML = "invalid email address. please enter a valid email"
            error = true
            }
    }
        
    if (password.value.trim() == '') {
        password.style.borderColor = 'red'
        password.parentElement.children[2].classList.remove('hidden')
        password.parentElement.children[2].innerHTML = "enter  password"
        error = true
    } else {
        password.style.borderColor = 'green'
        password.parentElement.children[2].classList.add('hidden')
        if (password.value.trim().length < 8) {
            password.style.borderColor = 'red'
            password.parentElement.children[2].classList.remove('hidden')
            password.parentElement.children[2].innerHTML = "password too short. password should be atleast 8 characters"
            error = true
        }
       else if (confirmpassword.value.trim() == '') {
            confirmpassword.style.borderColor = 'red'
            confirmpassword.parentElement.children[2].classList.remove('hidden')
            confirmpassword.parentElement.children[2].innerHTML ="confirm  password"
            error = true
        }
        else if (!(confirmpassword.value.trim().localeCompare(password.value.trim())==0)) {
            confirmpassword.style.borderColor = 'red'
            confirmpassword.parentElement.children[2].classList.remove('hidden')
            confirmpassword.parentElement.children[2].innerHTML = "password don't match. please enter the correct password"
            error = true
        }
        else {
            confirmpassword.style.borderColor = 'green'
            confirmpassword.parentElement.children[2].classList.add('hidden')
        }
    }
   

    if (!error) {
        fetch('/create_account', {
            method: 'POST',
            body: JSON.stringify({ surname: surname.value.trim(), othernames: othernames.value.trim(), username: username.value.trim(), email: email.value.trim(), password: password.value.trim() })
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            var msg = document.getElementById('msg')
            msg.innerHTML=response.result
            msg.classList.remove('hidden')
            setTimeout(function (e){
                msg.classList.add('hidden')
            },4000)
            window.location='login'
        })
    }
})
