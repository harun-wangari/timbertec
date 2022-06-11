var products = JSON.parse(window.localStorage.getItem('products'))
if (products == null) {
    products = []
}

var productdetails = JSON.parse(window.localStorage.getItem('productdetails'))
var itemname = document.getElementById('productname')
itemname.innerText = productdetails.itemname
itemname.name = productdetails.itemid
var dimension = document.getElementById('productdimension')
dimension.innerText = productdetails.itemdimension
var color = document.getElementById('productcolor')
color.innerText = productdetails.itemcolor
document.getElementById('productpic').src = productdetails.itempic
document.getElementById('txtdescription').value = productdetails.itemdescription
if (productdetails.itemcategory=='Paints'){
    document.getElementById('colorbox').classList.remove('hidden')
    document.getElementById('colorcon').classList.remove('hidden')
}
fetch('/relatedproducts', {
    method: 'POST',
    body: JSON.stringify({ cat: productdetails.itemcategory, name: productdetails.itemname})
}).then(function (response) {
    return response.json()
}).then(function (response) {
    itemcon = document.getElementById('relateditems')
    for (i = 0; i < response.length; i++) {
        var itempic = document.createElement('img')
        itempic.src = response[i].image
        itempic.className = "itempic"
        itempic.name = response[i].id
        var itemdetail = document.createElement('p')
        itemdetail.innerHTML = '<span id="itemname">' + response[i].name + '</span>' + '<br><span style=color:green; id="itemdimension">' + response[i].dimension + '</span><br><i>Color: </i><span style=color:coral  id="itemcolor">' + response[i].color + '</span> <br> <span class="hidden" id="itemdescription">' + response[i].description + '</span>' + '<br> <span class="hidden" id="itemcategory">' + response[i].category + '</span>'
        itemdetail.className = 'itemdetail'
        itemdetail.name = response[i].id
        var item = document.createElement('div')
        item.className = "items col-xs-5 col-sm-5"
        item.name = response[i].id
        item.append(itempic)
        item.append(itemdetail)
        itemcon.append(item)
    }
})


var relateditems = document.getElementById('relateditems')
relateditems.addEventListener('click', function (e) {
    if (e.target.classList.contains('items') || e.target.classList.contains('itempic') || e.target.classList.contains('itemdetail')) {
        var item = e.target
        if (e.target.classList.contains('itempic') || e.target.classList.contains('itemdetail')) {
            item = e.target.parentNode
        }
        var itempic = item.children[0].src
        var itemname = item.children[1].children[0].innerHTML
        var itemdimension = item.children[1].children[2].innerHTML
        var itemcolor = item.children[1].children[5].innerHTML
        var itemdescription = item.children[1].children[7].innerHTML
        var itemcategory = item.children[1].children[9].innerHTML
        var itemid = Number.parseInt(item.name)
        productdetails = { itempic: itempic, itemname: itemname, itemdimension: itemdimension, itemcolor: itemcolor, itemdescription: itemdescription, itemcategory: itemcategory, itemid: itemid }
        window.localStorage.setItem('productdetails', JSON.stringify(productdetails))
        window.location = '/product-details'
    }
})

var colorpicker = document.getElementById('colorpicker')
colorpicker.addEventListener('change',function(e){
    document.getElementById('colorbox').style.backgroundColor = e.target.value
    var colorname = ntc.name(e.target.value)
    document.getElementById('productcolor').innerHTML = colorname[1]
})

colorpicker.onchange

var btnadd=document.getElementById('btnadd')
btnadd.addEventListener('click',function(){
    var productname = document.getElementById('productname').innerText
    var productdimension = document.getElementById('productdimension').innerText
    var productcolor = document.getElementById('productcolor').innerText
    var productquantity = document.getElementById('quantity').value
    var productimage = document.getElementById('productpic').src
    var id = document.getElementById('productname').name
    var product={
                    id:  id,
                    name:productname,
                    dimension:productdimension, 
                    color:productcolor,  
                    quantity:productquantity,
                    image:productimage
                }
    var product_is_on_list = false
    for(i=0;i<products.length;i++){
        if (product.name == products[i].name){
            products[i].quantity = Number.parseInt(products[i].quantity) + Number.parseInt(product.quantity)
            product_is_on_list = true
            break
        }
    }
    if(!product_is_on_list){
        products.push(product)
    }
    window.localStorage.setItem('products',JSON.stringify(products))
    window.location='/'
})

var btnback = document.getElementById('btnback')
btnback.addEventListener('click',function(e){
    window.history.back()
})