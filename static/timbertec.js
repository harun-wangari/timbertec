var host = window.location.origin
var clicked = false
var errormsg = ''
var error = false
function msgbox(msg, title, color, alignment, showbuttons=false,caller="") {
    var message = document.getElementById('message')
    message.children[1].innerText = title || ''
    message.children[2].innerText = msg
    message.style.color = color || "#222"
    message.style.textAlign = alignment || "center"
    var messagecon = document.getElementById('message-con')
    messagecon.classList.toggle('msgactive')
    if(showbuttons==true){
        var buttons = document.getElementById('buttons')
        buttons.name=caller
        buttons.style="display:block"
    }else{
        setTimeout(function (e) {
            if (clicked == false) {
                messagecon.classList.toggle('msgactive')
            } else {
                clicked = false
            }
        }, 4000)
    }
    errormsg = ''
    error = false
}

var btnclosemsg = document.getElementById('btnclosemsg')
btnclosemsg.addEventListener('click', function (e) {
    btnclosemsg.parentNode.parentNode.classList.toggle('msgactive')
    clicked = true
    var buttons = document.getElementById('buttons')
    buttons.style = "display:none"
})
