var btnuploadimg = document.getElementById('btnuploadimg')
var loading = document.getElementById('loading')
clearForm('')
var image
var updateimage
btnuploadimg.addEventListener('input', function(e) {
    image = btnuploadimg.files[0]
    var img = document.getElementById('image')
    img.src = readFile(image,img.id) //URL.createObjectURL(e.target.files[0])
})

var btnupdateuploadimg = document.getElementById('btnupdateuploadimg')
btnupdateuploadimg.addEventListener('input', function (e) {
    updateimage = btnupdateuploadimg.files[0];
    var img = document.getElementById('updateimage')
    img.src = readFile(updateimage,img.id) 
})

var drop = false
var btnmenu = document.getElementById('btnmenu')
btnmenu.addEventListener('click',function(e){
    if(!drop){
        var dropdown = document.getElementById('example-navbar-collapse')
        dropdown.className = 'collapse navbar-collapse'
        if(dropdown.classList.contains('hidden')){
            dropdown.classList.toggle('hidden')
        }
        drop=true
    }
})
var btnadd = document.getElementById('btnadd')
btnadd.addEventListener('click', function(e) {
    var productname = document.getElementById("name").value
    productname.trim()
    var productcat = document.getElementById("cat").value
    var dimension = document.getElementById("dimension").value
    dimension.trim()
    var color = document.getElementById("color").value
    var img = document.getElementById("image").src
    var description = document.getElementById('description').value
    var valid = validate(productname, productcat,dimension,color, img,description)
    if (valid.error) {
        msgbox(valid.message, 'CORRECT THE FOLLOWING ERRORS', "rgb(148, 48, 48)", "left")
    } else {
        var form = new FormData()
        form.append('name',productname)
        form.append('cat', productcat)
        form.append('dimension',dimension)
        form.append('color', color)
        form.append('imagefile', image,productname.replace(" ",'_')+".jpg")
        form.append('description', description)
        loading.classList.remove('hidden')
        fetch('/addproduct', {
            method: 'POST',
            body: form
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            clearForm('')
            loading.classList.add('hidden')
            msgbox(response.result, 'ADD PRODUCTS', "rgb(17, 170, 111)", "left")
        })
    }
})

var btnadd = document.getElementById('btnaddmenu')
btnadd.addEventListener('click', function (e) {
    clearForm('')
    document.getElementById('add').style = " display: block"
    document.getElementById('update').style = ' display: none'
    document.getElementById('remove').style = ' display: none'
    document.getElementById('request').style = ' display: none'
    document.getElementById('quotationrequest').style = ' display: none'
    document.getElementById('example-navbar-collapse').classList.toggle('hidden')
    drop = false
})

var btnremove = document.getElementById('btnremovemenu')
    document.getElementById('viewcat-delete').value = 'All Products'
    btnremove.addEventListener('click', function (e) {
    document.getElementById('remove').style = " display: block"
    document.getElementById('add').style = ' display: none'
    document.getElementById('update').style = ' display: none'
        document.getElementById('request').style = ' display: none'
    document.getElementById('quotationrequest').style = ' display: none'
    document.getElementById('example-navbar-collapse').classList.toggle('hidden')
    drop = false
    var table = document.getElementById('product-table-delete')
    clearTable(table)
    document.getElementById('viewcat-delete').value="All Products"
    getProducts(table)
})

var btnquotationrequest = document.getElementById('btnquotationrequest')
btnquotationrequest.addEventListener('click', function (e) {
    document.getElementById('quotationrequest').style = " display: block"
        document.getElementById('add').style = ' display: none'
    document.getElementById('update').style = ' display: none'
    document.getElementById('remove').style = ' display: none'
    document.getElementById('request').style = ' display: none'
    document.getElementById('example-navbar-collapse').classList.toggle('hidden')
    drop = false
    var table = document.getElementById('request-table')
    var productcount = table.children.length
    for (i = 0; i < productcount; i++) {
        table.removeChild(table.lastChild)
    }
    fetch('/getcustomers', {
        method: 'GET',
    }).then(function (response) {
        return response.json()
    }).then(function (response) {
        for (i = 0; i < response.length; i++) {
            var customer = document.createElement('tr')
            customer.id = response[i].id
            customer.className = "table-row"
            var customername = document.createElement('td')
            customername.innerText = response[i].name
            var customerphone = document.createElement('td')
            customerphone.innerText = response[i].phone
            var customeremail = document.createElement('td')
            customeremail.innerText = response[i].email
            var action = document.createElement('td')
            action.innerHTML = '<button type="button" id="btnviewrequest" class="btn btn-primary" style="font-size:calc(8px + 0.5vw);width:calc(70px + 3vw)">View Request</button>'
            customer.append(customername)
            customer.append(customerphone)
            customer.append(customeremail)
            customer.append(action)
            table.append(customer)
        }
    })
})

var viewbycategorydelete = document.getElementById('viewcat-delete')
viewbycategorydelete.addEventListener('change', function (e) {
    if (viewbycategorydelete.value == 'All Products') {
        document.getElementById('btnremovemenu').dispatchEvent(new Event('click'))
    }
    else {
        var table = document.getElementById('product-table-delete')
        clearTable(table)
        getProductByCategory(viewbycategorydelete.value,table)
    }
})

var btnclear = document.getElementById('btnclear')
btnclear.addEventListener('click', function (e) {
    clearForm('')
})

var btnupdatecancel = document.getElementById('btnupdatecancel')
btnupdatecancel.addEventListener('click', function (e) {
    var update = document.getElementById('update')
    update.scrollTop=0
    update.style = " display: none"
})

var btnrequestcancel = document.getElementById('btnrequestcancel')
btnrequestcancel.addEventListener('click', function (e) {
    var request = document.getElementById('request')
    request.scrollTop = 0
    request.style = " display: none"
})

var nav = document.getElementById('menuitems')
nav.addEventListener('click', function (e) {
    if(e.target.parentNode.classList.contains('menuitem')){
        for (i = 0; i < nav.children.length; i++) {
            nav.children[i].classList.remove('selected')
        }
        e.target.parentNode.classList.add('selected')
    }
})

var btnupdate = document.getElementById('btnupdate')
btnupdate.addEventListener('click',function(e){
    var productname = document.getElementById("updatename").value
    productname.trim()
    var productcat = document.getElementById("updatecat").value
    var productdimension= document.getElementById("updatedimension").value
    productdimension.trim()
    var productcolor = document.getElementById("updatecolor").value
    productcolor.trim()
    var img = document.getElementById("updateimage").src
    var productid = document.getElementById("updatename").name
    var description = document.getElementById('updatedescription').value
    valid=validate(productname,productcat,dimension,color,img,description)
    if (valid.error) {
        msgbox(valid.message, 'CORRECT THE FOLLOWING ERRORS', "rgb(148, 48, 48)", "left")
    } else {
        var form = new FormData()
        form.append('id',productid)
        form.append('name', productname)
        form.append('cat', productcat)
        form.append('dimension', productdimension)
        form.append('color', productcolor)
        loading.classList.remove('hidden')
        if(updateimage!=null){
            form.append('imagefile', updateimage, productname.replace(" ", '_') + ".jpg")
        }
        form.append('description', description)
        fetch('/updateproduct', {
            method: 'POST',
            body:form
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            loading.classList.add('hidden')
            var product=document.getElementById(response.id)
            product.children[0].children[0].src=response.image
            product.children[1].innerText = response.name
            product.children[2].innerText= response.category
            product.children[3].innerText = response.dimension
            product.children[4].innerText = response.color
            product.children[5].innerText = response.description
            clearForm('update')
            msgbox(response.result, 'UPDATE PRODUCT', "rgb(17, 170, 111)", "left")
            document.getElementById('update').style = " display: none"
        })
    }
})

var tabledelete = document.getElementById('product-table-delete')
tabledelete.addEventListener('click',function(e){
    if(e.target.classList.contains('fa-trash-o')){
        for(i=0;i<table.children.length;i++){
            tabledelete.children[i].onmouseover = null
        }
        var caller = e.target.parentNode.parentNode.id
        var product = e.target.parentNode.parentNode.children[1].innerText
        msgbox('Are you sure u want to DELETE ' + product + ' from the Database ?', "CONFIRM DELETE", "rgb(148, 48, 48)", "left", true,caller)
    } else if (e.target.classList.contains('fa-edit')){
        clearForm('update')
        document.getElementById('update').style = " display: block"
        document.getElementById('updateimage').src = e.target.parentNode.parentNode.children[0].children[0].src
        document.getElementById('updatename').value = e.target.parentNode.parentNode.children[1].innerText
        document.getElementById('updatecat').value = e.target.parentNode.parentNode.children[2].innerText
        document.getElementById('updatedimension').value = e.target.parentNode.parentNode.children[3].innerText
        document.getElementById('updatecolor').value = e.target.parentNode.parentNode.children[4].innerText
        document.getElementById('updatedescription').value = e.target.parentNode.parentNode.children[5].innerText
        document.getElementById('updatename').name = e.target.parentNode.parentNode.id

    }
})

var btndelete = document.getElementById('btndelete')
btndelete.addEventListener('click',function(e){
    var id = e.target.parentNode.name
    loading.classList.remove('hidden')
    fetch('/deleteproduct', {
        method: 'POST',
        body: JSON.stringify({ productid: id })
    }).then(function (response) {
        return response.json()
    }).then(function (response) {
        loading.classList.add('hidden')
        document.getElementById('btnclosemsg').dispatchEvent(new Event('click'))
        var product = document.getElementById(id)
        product.parentNode.removeChild(product)
        msgbox(response.result, 'ADD PRODUCTS', "rgb(17, 170, 111)", "left")
    })
})

var btncancel = document.getElementById('btncancel')
btncancel.addEventListener('click',function(e){
    document.getElementById('btnclosemsg').dispatchEvent(new Event('click'))
})

var table = document.getElementById('request-table')
table.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-primary')) {
        document.getElementById('request').style = " display: block"
        var details = document.getElementById('heading')
        details.innerText = "Customer Name: " + e.target.parentNode.parentNode.children[0].innerText + "\n"
        details.innerText += "Telephone No: " + e.target.parentNode.parentNode.children[1].innerText
        document.getElementById('email').innerText = e.target.parentNode.parentNode.children[2].innerText
        document.getElementById('name').innerText = e.target.parentNode.parentNode.children[0].innerText
        var table = document.getElementById('item-table')
        var productcount = table.children.length
        for (i = 0; i < productcount; i++) {
            table.removeChild(table.lastChild)
        }
        var id = e.target.parentNode.parentNode.id

        fetch('/getcustomerrequest', {
            method: 'POST',
            body: JSON.stringify({ customerid: id })
        }).then(function (response) {
            return response.json()
        }).then(function (response) {
            for(i=0;i<response.length;i++){
                var product = document.createElement('tr')
                product.className = 'table-row'
                var name = document.createElement('td')
                name.innerText = response[i].name
                var dimension = document.createElement('td')
                dimension.style ="text-align:right;"
                dimension.innerText = response[i].dimension
                var quantity = document.createElement('td')
                quantity.style = "text-align:center;"
                quantity.innerText = response[i].quantity
                var price = document.createElement('td')
                price.style = "text-align:right;"
                price.innerHTML = "<input type='tel'  class='form-control price' style='text-align:right;width:80px;'>" 
                var total = document.createElement('td')
                total.className = 'total'
                product.append(name)
                product.append(dimension)
                product.append(quantity)
                product.append(price)
                product.append(total)
                table.name=id
                table.append(product)
            }
        })
    }
})

var btnsendresponse = document.getElementById('btnsendresponse')
btnsendresponse.addEventListener('click',function(e){
    var itemtable = document.getElementById('item-table')
    var prices = document.getElementsByClassName('price')
    if (itemtable.children.length >0) {
        var email = document.getElementById('email').innerText
        var name = document.getElementById('name').innerText
        var total = document.getElementById('total').innerText
        var id=itemtable.name
        var error=false
        for(i=0;i<prices.length;i++){
            if(prices[i].value==''){
                error=true
            }
        }
    
        if(!error){
            var count =prices.length
            for (i = 0; i < count; i++) {
                prices.item(0).parentNode.innerText = prices.item(0).value
            }
            var count = prices.length
            for (i = 0; i < count; i++) {
                prices.item(0).parentNode.innerText = prices.item(0).value
            }
            var html = document.getElementById('quotation-table').outerHTML
            loading.classList.remove('hidden')
            fetch('/sendresponse', {
                method: 'POST',
                body: JSON.stringify({ id:id,customername: name, email: email,html:html,total:total })
            }).then(function (response) {
                return response.json()
            }).then(function (response) {
                loading.classList.add('hidden')
                document.getElementById('total').innerText = '0'
                msgbox(response.sent, 'SEND EMAIL', "rgb(148, 48, 48)", "left")
                document.getElementById('btnquotationrequest').dispatchEvent(new Event('click'))
                document.getElementById('request').style = " display: none"
            })
        }else{
            msgbox("please enter the price for all items", 'SEND EMAIL', "rgb(148, 48, 48)", "left")
        }
    }else{
        msgbox("please select a customer request first", 'SEND EMAIL', "rgb(148, 48, 48)", "left")
    }
})

var itemtable = document.getElementById('item-table')
itemtable.addEventListener('input', function (e) {
    if (e.target.classList.contains('form-control')) {
        if ((!isNaN(e.data))) {
        } else {
            var data = e.target.value
            var value = data.split('')
            value.pop()
            e.target.value = value.join('')
        }
        var total = 0
        var price = e.target.value
            if(price==''){
                e.target.parentNode.parentNode.children[4].innerText =''
            }else{
                var quantity = e.target.parentNode.parentNode.children[2].innerText
                e.target.parentNode.parentNode.children[4].innerText = parseInt(price) * parseInt(quantity)
            }
            var addtotal = false
            for(i=0;i<itemtable.children.length;i++){
                if (itemtable.children[i].children[4].innerText!=''){
                    addtotal=true
                    var val = itemtable.children[i].children[4].innerText
                    total+=parseInt(val)
                }
            }
            if(addtotal){
                document.getElementById('total').innerText = total
            }else{
                document.getElementById('total').innerText = 0
            }
            
        }
})



//callable functions

function getProductByCategory(cat,table) {
    fetch('/products_by_category_update', {
        method: 'POST',
        body: JSON.stringify({ category: cat })
    }).then(function (response) {
        return response.json()
    }).then(function (response) {
        for (i = 0; i < response.length; i++) {
            var productimage = document.createElement('td')
            var image = document.createElement('img')
            image.style.height = '60px'
            image.style.width = '50px'
            image.className = 'productpic'
            image.src = response[i].image
            productimage.append(image)
            var productname = document.createElement('td')
            productname.innerText = response[i].name
            var productcategory = document.createElement('td')
            productcategory.innerText = response[i].category
            var productdimension = document.createElement('td')
            productdimension.innerText = response[i].dimension
            productdimension.className = 'hidden'
            var productcolor = document.createElement('td')
            productcolor.innerText = response[i].color
            productcolor.className = 'hidden'
            var productdescription = document.createElement('td')
            productdescription.innerText = response[i].description
            productdescription.className = 'hidden'
            var product = document.createElement('tr')
            product.id=response[i].id
            product.className = "table-row"
            product.append(productimage)
            product.append(productname)
            product.append(productcategory)
            product.append(productdimension)
            product.append(productcolor)
            product.append(productdescription)
            table.append(product)
            if (table.id == 'product-table-delete') {
                var action = document.createElement('td')
                var btnedit = document.createElement('span')
                btnedit.className = "fa fa-edit"
                btnedit.id = "edit"
                var btndelete= document.createElement('span')
                btndelete.className="fa fa-trash-o"
                btndelete.id="delete"
                action.append(btnedit)
                action.append(btndelete)
                product.append(action)
            }
        }
    })
}

function getProducts(table){
    fetch('/getproducts_update', {
        method: 'GET',
    }).then(function (response) {
        return response.json()
    }).then(function (response) {
        for (i = 0; i < response.length; i++) {
            var product = document.createElement('tr')
            product.id = response[i].id
            var productimage = document.createElement('td')
            var image = document.createElement('img')
            image.className = 'productpic'
            image.style.height = '60px'
            image.style.width = '50px'
            image.src = response[i].image
            productimage.append(image)
            var productname = document.createElement('td')
            productname.innerText = response[i].name
            var productcategory = document.createElement('td')
            productcategory.innerText = response[i].category
            var productdimension = document.createElement('td')
            productdimension.innerText = response[i].dimension
            productdimension.className='hidden'
            var productcolor = document.createElement('td')
            productcolor.innerText = response[i].color
            productcolor.className = 'hidden'
            var productdescription = document.createElement('td')
            productdescription.innerText = response[i].description
            productdescription.className = 'hidden'
            product.className = "table-row"
            product.append(productimage)
            product.append(productname)
            product.append(productcategory)
            product.append(productdimension)
            product.append(productcolor)
            product.append(productdescription)
            table.append(product)
            if (table.id == 'product-table-delete') {
                var action = document.createElement('td')
                action.innerHTML ='<span id="edit" class="fa fa-edit"></span> <span id="delete" class="fa fa-trash-o"></span>'
                product.append(action)
            }
        }
    })
}

function clearTable(table){
    var productcount = table.children.length
    for(i=0;i<productcount;i++){
        table.removeChild(table.lastChild)
    }
}

function clearForm(form){
     document.getElementById(form+"name").value=''
    document.getElementById(form +"cat").value=''
    document.getElementById(form + "dimension").value = ''
    document.getElementById(form + "color").value = ''
    document.getElementById(form + "image").src = host + '/static/images/item.jpg'
    document.getElementById('btn' + form + 'uploadimg').value = ''
    document.getElementById(form + 'description').value = ''
}


function validate(productname, productcat, productdimension,productcolor, img,description){
    var errormsg=''
    var err= false
    if (productname === "") {
        errormsg += "enter name of the product\n"
        err= true
    }
    if (productcat === '') {
        errormsg += "select product category\n"
        err = true
    }
    if (productdimension === '') {
        errormsg += "Enter product dimension\n"
        err = true
    }
    if (productcolor === '') {
        errormsg += "select product color\n"
        err = true
    }
    if (img === host + '/static/images/item.jpg') {
        errormsg += "upload product image"
        err = true
    }
    if (description === '') {
        errormsg += "Enter product description\n"
        err = true
    }else{
        if (description.length < 20) {
            errormsg += "Product description should be 20 or more characters\n"
            err = true
        }
    }
    return {error:err,message:errormsg}
}

// File Reader

function readFile(file,img) {
    if (file) {
        if (/(jpe?g|png|gif)$/i.test(file.type)) {
            var r = new FileReader();
            r.onloadend = function(e) {
                var base64Img = e.target.result;
                document.getElementById(img).src = base64Img;
                return base64Img;
            }
            r.readAsDataURL(file);
            return document.getElementById(img).src
        } else {
            msgbox("Failed file type")
        }
    } else {
        msgbox("Failed to load file")
    }
}