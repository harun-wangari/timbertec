var itemcon = document.getElementById('itemcon')
var fullimg = document.getElementById('fullimg')
var view = document.getElementById('view')

itemcon.addEventListener('click',function(e){
    if(e.target.classList.contains('image')){
        view.children[0].src = e.target.src
        fullimg.children[1].innerHTML = e.target.parentNode.children[1].innerHTML
        fullimg.classList.remove('hidden')
        setTimeout(function(){
            fullimg.classList.add('hidden')  
        },6000)
        
    }
})

var btnclose = document.getElementById('btnclose')
btnclose.addEventListener('click',function(e){
    fullimg.classList.add('hidden')  
})

onresize = function(e) {
    if(window.innerWidth<768){
        console.log(window.innerWidth)
    }
}