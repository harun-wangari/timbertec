btnlogin = document.getElementById('btnlogin');
btnlogin.addEventListener('click',function(e){
    var username = document.getElementById("txtusername").value
    username.trim()
    var password = document.getElementById("txtpassword").value
    password.trim()
    if (username == '') {
        errormsg += "enter your username\n"
        error = true
    }
    if (password == '') {
        errormsg += "enter your password\n"
        error = true
    }

    if (error == true) {
        msgbox(errormsg, 'CORRECT THE FOLLOWING ERRORS', "rgb(148, 48, 48)", "left")
    } else {
        fetch('/validateLogin',{
            method:'POST',
            body:JSON.stringify({username:username,password:password})
        }).then(function(response){
                return response.json()
        }).then(function(response){
            if(response.login){
                window.location = host + '/admin'
            }else{
                msgbox(response.message, 'ERROR', "rgb(148, 48, 48)", "left")
            }
        })
    }

})

function sendData(toRoute,data){
    //var result=[]
    fetch(toRoute,{
        method:'POST',
        body:JSON.stringify(data)
    }).then(function(response){
        return response.json()
    }).then(function(json){
        const result= json
    })
}
