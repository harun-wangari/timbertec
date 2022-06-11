var btnreset = document.getElementById('btnreset')
btnreset.addEventListener('click',function(e){
    var password = document.getElementById("txtpassword").value
    password.trim()
    var confirmpassword = document.getElementById("txtconfirmpassword").value
    confirmpassword.trim()
    if (password == '') {
        errormsg += "enter you password\n"
        error = true
    } else {
        if (password.length < 8) {
            errormsg += "password too short. password should be atleast 8 characters\n"
            error = true
        }
        else if (confirmpassword == '') {
            errormsg += "confirm your password"
            error = true
        }
        else if (!(confirmpassword.localeCompare(password) == 0)) {
            errormsg += "password don't match. please enter the correct password"
            error = true
        }
    }
    var userid = Number.parseInt(document.getElementById('userid').innerText)
    console.log(userid)
    if (error) {
        msgbox(errormsg, 'CORRECT THE FOLLOWING ERRORS', "rgb(148, 48, 48)", "left")
    } else {
        fetch('/changepassword', {
            method: 'POST',
            body: JSON.stringify({userid: userid, password: password})
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            msgbox(response.result, 'Password Reset', "rgb(17, 170, 111)", "left")
            window.location = host + '/login'
        })
    }
})