var btnreset = document.getElementById('btnreset')
btnreset.addEventListener('click',function(e){
    var email=document.getElementById('txtemail')
    if (email.value.trim() == '') {
        email.style.borderColor = 'red'
        email.parentElement.parentElement.children[1].innerHTML = "enter your email address"
        error = true
    } else {
        email.style.borderColor = 'green'
        var address = email.value.trim()
        if (!(address.endsWith('@gmail.com') || address.endsWith('@protonmail.com') || address.endsWith('@zoho.com') || address.endsWith('@outlook.com') || address.endsWith('@hotmail.com') || address.endsWith('@yahoo.com') || address.endsWith('@aim.com') || address.endsWith('@icloud.com') || address.endsWith('@yandex.com'))) {
            email.style.borderColor = 'red'
            email.parentElement.parentElement.children[1].innerHTML = "invalid email address. please enter a valid email address"
            error = true
        }
    }

    if(error){
       
    }
    else{
        fetch('resetrequest', {
            method: 'POST',
            body: JSON.stringify({ email: email })
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            if (response.sent) {
                msgbox('Password Reset email has been sent', 'PASSWORD RESET', "rgb(17, 170, 111)", "left")
                setTimeout(function () {
                    window.location = 'login'
                }, 2000)
            } else {
                document.getElementById('errormsg').innerText = response.message
            }
        })
    }
})