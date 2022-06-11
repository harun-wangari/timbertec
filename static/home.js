var itemcon = document.getElementById('itemcon')
var productdetails={}
var items=''
var offset = 0
if (window.innerWidth < 760) {
    document.getElementById('sidenav').classList.add('sidenavhide')
    document.getElementById('itemcon').classList.add('fullitemcon')
    document.getElementById('listcon').classList.add('fulllist')
}

var quotationlist = []
if (JSON.parse(window.localStorage.getItem('products')==null || window.localStorage.getItem('products').length>0)){
    quotationlist = JSON.parse(window.localStorage.getItem('products'))
    if (window.localStorage.getItem('products') == null ){
        quotationlist = []
    }
    document.getElementById('itemnumber').innerHTML = quotationlist.length
}
 
var productnames = []
function products(condition){
    if(condition){
        fetch('/products', {
            method: 'POST',
            body: JSON.stringify({ offset: offset })
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            for (i = 0; i < response.length; i++) {
                productnames.push(response[i].name)
            }
            document.getElementById('autocomplete').dataset.products = productnames
            items = document.getElementById('autocomplete').dataset.products
            displayMenu(response)
            offset += response.length
            if(offset==0){
                var noitems = document.createElement('h4')
                noitems.innerHTML = ' <h4 align="center" style="margin-top:20%;">' + msg + '</h4>'
                itemcon.appendChild(noitems)
            }
            if (response.length== 0) {
               condition=false
               offset=0
            }
            products(condition)
        })
    } 
 }
products(true)

var sidenav = document.getElementById('sidenavmenu')
sidenav.addEventListener('click', function(e){
    for(i=0;i<sidenav.children.length;i++){
        sidenav.children[i].classList.remove('sidenavmenuitemactive')
    }
    if(e.target.classList.contains('sidenavmenuitem') ){
        e.target.classList.add('sidenavmenuitemactive')
        document.getElementById('btncategory').innerHTML = e.target.innerText +'<span class="fa fa-angle-down" aria-hidden="true"> </span>'
        if (window.innerWidth < 760) {
            var side = document.getElementById('sidenav')
            side.classList.add('sidenavhide')
        }
        clearMenu()
        document.getElementById('loading').classList.remove('hidden')
        getProducts(e.target.id)
    }
})

var productdetails = document.getElementById('itemcon')
productdetails.addEventListener('click',function(e){
    if (e.target.classList.contains('items') || e.target.classList.contains('itempic') || e.target.classList.contains('itemdetail')){
        var item = e.target
        if (e.target.classList.contains('itempic') || e.target.classList.contains('itemdetail')){
            item = e.target.parentNode
        }
        var itempic =  item.children[0].src
        var itemname = item.children[1].children[0].innerHTML
        var itemdimension = item.children[1].children[2].innerHTML
        var itemcolor = item.children[1].children[5].innerHTML
        var itemdescription = item.children[1].children[7].innerHTML
        var itemcategory = item.children[1].children[9].innerHTML
        var itemid = Number.parseInt(item.name)
        productdetails = {itempic:itempic,itemname:itemname,itemdimension:itemdimension,itemcolor:itemcolor,itemdescription:itemdescription,itemcategory:itemcategory,itemid:itemid}
        window.localStorage.setItem('productdetails',JSON.stringify(productdetails))
        window.location = '/product-details'
    }
})

var btnsearch = document.getElementById('btnsearch')
btnsearch.addEventListener('click', function(e){
    document.getElementById('loading').classList.toggle('hidden')
    clearMenu()
    var name=document.getElementById('txtsearch').value
   getProductbyName(true,name)
})

var btnquotation = document.getElementById('btnquotation')
btnquotation.addEventListener('click',function(e){
    if (quotationlist.length>0){
        var table = document.getElementById('tableitem')
        clearTable(table)
        for (i = 0; i < quotationlist.length; i++) {
            var product = document.createElement('tr')
            product.id=i
            var productimage = document.createElement('td')
            var image = document.createElement('img')
            image.className = 'productpic'
            image.style.height = '60px'
            image.style.width = '50px'
            image.src = quotationlist[i].image
            productimage.append(image)
            var productname = document.createElement('td')
            productname.innerText = quotationlist[i].name
            var dimension = document.createElement('td')
            dimension.innerText = quotationlist[i].dimension
            var color = document.createElement('td')
            color.innerText = quotationlist[i].color
            var quantity = document.createElement('td')
            quantity.innerText = quotationlist[i].quantity
            product.className = "table-row"
            product.style ="font-size:80%;"
            var action = document.createElement('td')
            action.innerHTML = '<span id="delete" class="fa fa-remove"></span>'
            product.appendChild(productimage)
            product.appendChild(productname)
            product.appendChild(dimension)
            product.appendChild(color)
            product.appendChild(quantity)
            product.appendChild(action)
            table.appendChild(product)
            var listcon = document.getElementById('listcon')
            listcon.classList.remove('hidden')
        }
    } else{
        msgbox("Click on Product to get quotation ", 'ADD PRODUCTS', "rgb(17, 170, 111)", "left")
    }
})

var btncloselist = document.getElementById('btncloselist')
btncloselist.addEventListener('click',function(e){
    var listcon = document.getElementById('listcon')
    listcon.classList.add('hidden')
})

var btnsubmit = document.getElementById('btnsubmit')
btnsubmit.addEventListener('click',function(e){
    var name = document.getElementById('txtfullname').value
    var phone = document.getElementById('txtphone').value
    var email = document.getElementById('txtemail').value
    if (name == '') {
        errormsg += "enter you name\n"
        error = true
    } else {
        if (name.length < 3) {
            errormsg += "name too short. username should be atleast 4 characters\n"
            error = true
        }
    }
    if (phone == '') {
        errormsg += "enter your phone number\n"
        error = true
    } else {
        if (!(phone.startsWith('07')) || phone.length < 10) {
            errormsg += "invalid phone number. phone number should start with 07 and must contain 10 characters\n"
            error = true
        }
    }
    if (email == '') {
        errormsg += "enter your email address\n"
        error = true
    } else {
        if (!(email.endsWith('@gmail.com') || email.endsWith('@protonmail.com') || email.endsWith('@zoho.com') || email.endsWith('@outlook.com') || email.endsWith('@hotmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@aim.com') || email.endsWith('@icloud.com') || email.endsWith('@yandex.com')) )  {
            errormsg += "invalid email. Please enter a valid email address \n"
            error = true
        }
    }
    if (error) {
        msgbox(errormsg, 'CORRECT THE FOLLOWING ERRORS', "rgb(148, 48, 48)", "left")
    } else {
        quotationlist.splice(0,0,{name:name,phone:phone,email:email})
        fetch('/addquotationrequest', {
            method: 'POST',
            body:JSON.stringify(quotationlist)
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
                if(response.result=='success'){
                var table = document.getElementById('tableitem')
                var productcount = table.children.length
                for (i = 0; i < productcount; i++) {
                    table.removeChild(table.lastChild)
                }
                document.getElementById('txtfullname').value=""
                document.getElementById('txtphone').value=""
                document.getElementById('txtemail').value = ""
                quotationlist = []
                    window.localStorage.setItem('products', JSON.stringify(quotationlist))
                document.getElementById('itemnumber').innerHTML = quotationlist.length
                msgbox('your quotation request was sent successfully', 'SUBMIT QUOTATION REQUEST', "green", "left")
                document.getElementById('btncloselist').dispatchEvent(new Event('click'))
            }else{
                    msgbox('your quotation request FAILED, please try again', 'SUBMIT QUOTATION REQUEST', "red", "left")
            }
        })
    }
})

var btndelete = document.getElementById('tableitem')
btndelete.addEventListener('click', function (e) {
    if (e.target.classList.contains('fa-remove')) {
        var productid = e.target.parentNode.parentNode.id
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)
        quotationlist.splice(productid,1)
        window.localStorage.setItem('products',JSON.stringify(quotationlist))
        document.getElementById('itemnumber').innerHTML = quotationlist.length
        document.getElementById('btncloselist').dispatchEvent(new Event('click'))
    }
})

var btncategory = document.getElementById('btncategory')
btncategory.addEventListener('click',function(e){
    if (window.innerWidth < 760) {
        var sidenav = document.getElementById('sidenav')
        sidenav.classList.toggle('sidenavhide')
    }
})

    

function displayMenu(menu) {
    document.getElementById('loading').classList.add('hidden')
    if (menu.length > 0) {
        for (i = 0; i < menu.length; i++) {
            var itempic = document.createElement('img')
            itempic.id = 'itempic'
            itempic.src =  menu[i].image
            itempic.className = "itempic"
            itempic.name = menu[i].id
            var itemdetail = document.createElement('div')
            itemdetail.innerHTML = '<span id="itemname">' + menu[i].name + '</span>' + '<br><span style=color:green; id="itemdimension">' + menu[i].dimension + '</span><br><i>Color: </i><span style=color:coral  id="itemcolor">' + menu[i].color + '</span> <br> <span class="hidden" id="itemdescription">' + menu[i].description + '</span>' + '<br> <span class="hidden" id="itemcategory">' + menu[i].category + '</span>'
            itemdetail.className='itemdetail'
            itemdetail.name = menu[i].id
            var item = document.createElement('div')
            item.className = "items col-xs-6  col-sm-4  col-md-3  col-lg-2 col-xl-1"
            item.name=menu[i].id
            item.append(itempic)
            item.append(itemdetail)
            itemcon.append(item)
        }
    }
}

onresize = function(e) {
    var sidenav = document.getElementById('sidenav')
    var itemcon = document.getElementById('itemcon')
    if (window.innerWidth<760){
        sidenav.classList.add('sidenavhide')
        itemcon.classList.add('fullitemcon')
        document.getElementById('listcon').classList.add('fulllist')
    }else{''
        sidenav.classList.remove('sidenavhide')
        itemcon.classList.remove('fullitemcon')
        document.getElementById('listcon').classList.remove('fulllist')
    }
}

function clearMenu() {
    var menu = document.getElementById('itemcon')
    var itemcount = menu.children.length
    for (i = 1; i < itemcount; i++) {
        menu.removeChild(menu.lastChild)
    }
}

function clearTable(table) {
    var productcount = table.children.length
    for (i = 0; i < productcount; i++) {
        table.removeChild(table.lastChild)
    }
}

function data(condition,cat){
    if(condition){
        fetch('/products_by_category', {
            method: 'POST',
            body: JSON.stringify({ category: cat ,offset:offset})
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            displayMenu(response)
            offset += response.length
            if (offset == 0) {
                var msg = 'There are NO items to display on this category'
                var noitems = document.createElement('h4')
                noitems.innerHTML = ' <h4 align="center" style="margin-top:20%;">' + msg + '</h4>'
                itemcon.appendChild(noitems)
            }
            if(response.length==0){
                condition=false
                offset=0
            }
            data(condition,cat)
        })
    }
}

function getProductbyName(condition,name){
    if(condition){
        fetch('/products_by_name', {
            method: 'POST',
            body: JSON.stringify({ name: name,offset:offset })
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            document.getElementById('txtsearch').value = ''
            displayMenu(response)
            offset += response.length
            if (offset == 0) {
                var msg = "Search results for '" + name + "' 0 products Found"
                var noitems = document.createElement('h4')
                noitems.innerHTML = ' <h4 align="center" style="margin-top:20%;">' + msg + '</h4>'
                itemcon.appendChild(noitems)
            }
            if (response.length == 0) {
                condition = false
                offset = 0
            }
            getProductbyName(condition,name)
        })
    }
}

// function for fetching products from the database

function getProducts(category){
    data(true,category)
}

var txtphone = document.getElementById('txtphone')
txtphone.addEventListener('keydown', function (e) {
    pricegroup = document.getElementById("group-price")
    if ((!isNaN(e.key)) || (e.keyCode == 8) || (e.keyCode == 13)) {

    } else {
        e.returnValue = false
        //msgbox("this field only accept numeric characters", 'Error', "rgb(148, 48, 48)", "left")
        e.preventDefault()
    }
})

var currentFocus;
var input = document.getElementById('txtsearch')
input.addEventListener("input", function (e) {
    var a, b, i, val = this.value.trim();
    var arr = items.split(',')
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
        var product =arr[i].toLowerCase().trim()
        if (product.toLowerCase().includes(val.toLowerCase())) {
            b = document.createElement("DIV");
            b.innerHTML = product.substr(0, product.indexOf(val.toLowerCase()));
            b.innerHTML += "<strong style='color:rgb(107, 219, 97);'>" + product.substr(product.indexOf(val.toLowerCase()), val.length) + "</strong>"
            b.innerHTML += product.substr(product.indexOf(val.toLowerCase()) + val.length,product.length)
            b.innerHTML += "<input type='hidden' value='" + product + "'>";
            b.addEventListener("click", function (e) {
                input.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
        }
    }
});

input.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
    } else if (e.keyCode == 38) { 
        currentFocus--;
        addActive(x);
    } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            if (x) x[currentFocus].click();
        }
    }
});
function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}
function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != input) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});