from flask import Flask,redirect,render_template,url_for,request,jsonify,session
from werkzeug.security import generate_password_hash,check_password_hash
from werkzeug.utils import secure_filename
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask_mail import Mail, Message
import os
import pymysql
import warnings

app = Flask(__name__)
app.config['SECRET_KEY']='timberteclimited'
app.config['MAIL_SERVER']='mail.timberteclimited.co.ke'
app.config['MAIL_PORT']=465
app.config['MAIL_USERNAME']='sales@timberteclimited.co.ke'
app.config['MAIL_PASSWORD']='timbertec@2020'
app.config['MAIL_USE_SSL']=True
mail=Mail(app)

currentuser=''
Base_dir = app.root_path
product_image_dir ='static/images/product_images'
#database configuration
#conn=MySQLdb.connect(host='Harztech.mysql.pythonanywhere-services.com',user='Harztech',password='timbertec',db='Harztech$timbertecdb') 
#conn=MySQLdb.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        cursor=conn.cursor()
        cursor.execute("""CREATE table if not exists tbproducts(id  INTEGER(10)  PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50), category TEXT(20), price INTEGER(10), image MEDIUMTEXT, dimension VARCHAR(20), color VARCHAR(50),description MEDIUMTEXT)""")
        cursor.execute("""CREATE table if not exists tbusers(user_id  INTEGER(10)  PRIMARY KEY AUTO_INCREMENT, username VARCHAR(20), surname VARCHAR(20), othername VARCHAR(20), email TEXT(100), password TEXT)""")
        cursor.execute("""CREATE table if not exists tbcustomers(id  INTEGER(10)  PRIMARY KEY AUTO_INCREMENT,name VARCHAR(30), phone TEXT(10), email TEXT, active BOOLEAN)""") 
        cursor.execute("""CREATE table if not exists tbquotations(id  INTEGER(10) PRIMARY KEY AUTO_INCREMENT, productid INTEGER(10),customerid INTEGER(10),quantity INTEGER(10) ,FOREIGN KEY (productid) REFERENCES tbproducts(id) ON DELETE CASCADE ON UPDATE CASCADE)""")
        conn.close() 

# fuctions for rendering templates
@app.route("/",methods=["POST","GET"])
def home():
        return render_template('home.html')

@app.route('/login',methods=["POST","GET"])
def login():
        try:
                #database connection 
                conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
                cursor=conn.cursor()
                cursor.execute("select * from tbusers")
                users=cursor.fetchall()
                if len(users)==0:
                        return render_template('create_account.html',msg='welcome, First time user',)
                else:
                        if session.get(currentuser):
                                return redirect(url_for('admin'))
                        else:
                                return render_template('login.html')
        except Exception as ex:
                return jsonify({"login":False,"message":str(ex)})
        finally:
                conn.close()

@app.route('/settings',methods=["POST","GET"])
def settings():
    if session.get(currentuser): 
        return render_template('settings.html',user=session.get('user'))
    else:
        return redirect(url_for('login'))

@app.route('/reset_password_request',methods=["POST","GET"])
def resetPasswordRequest():
        if  session.get(currentuser):
                session.pop(currentuser,None)
                session.pop('user',None)
        return render_template('reset_password_request.html')

@app.route('/reset_password/<token>',methods=["POST","GET"])
def resetPassword(token):
        if  session.get(currentuser):
                redirect(url_for('admin'))
        serialize = Serializer(app.config['SECRET_KEY'])

        try:
                user= serialize.loads(token)
                return render_template('reset_password.html',user_id=user['user_id'][0])
        except Exception as ex:
                 return render_template('error.html',message=str(ex))

@app.route('/about',methods=["POST","GET"])
def about():
    return render_template('about.html')

@app.route('/services',methods=["POST","GET"])
def services():
    return render_template('services.html')


@app.route('/product-details',methods=["POST","GET"])
def productDetails():
    return render_template('product-details.html')

@app.route('/workshop',methods=["POST","GET"])
def workshop():
    return render_template('workshop.html')


@app.route('/admin',methods=["POST","GET"])
def admin():
    if session.get(currentuser):
        return render_template('admin.html',user=session.get('user'))
    return redirect(url_for('login'))

#database connections

@app.route('/products',methods=["POST"])
def products():
    try:
        data = request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name,category,image,dimension,color,id,description from tbproducts LIMIT 10 OFFSET %s""",(data['offset'],))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        
        return jsonify(result)
        
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/getproducts_update',methods=["GET"])
def getProductsUpdate():
    try: 
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name,category,image,dimension,color,id,description from tbproducts""")
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
                result.append(dict(zip(columns,item)))
        
        return jsonify(result)
        
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/products_by_category',methods=["GET","POST"])
def products_by_category():
    try:
        data=request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name, price, category,image,dimension,color,id,description from tbproducts where category=%s LIMIT 10 OFFSET %s""",(data['category'].title(),data['offset']))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        return jsonify(result)
        
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()
        
@app.route('/products_by_category_update',methods=["GET","POST"])
def products_by_category_update():
    try:
        data=request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name, price, category,image,dimension,color,id,description from tbproducts where category=%s""",(data['category'].title()))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        return jsonify(result)
        
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/products_by_name',methods=["GET","POST"])
def products_by_name():
    try:
        data=request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name, price, category,image,dimension,color,id,description FROM tbproducts WHERE name LIKE %s LIMIT 10 OFFSET %s""",('%' +data['name'].title() + '%',data['offset']))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        return jsonify(result)
        
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/addproduct', methods=["POST"])
def addproduct():
    try:
        if request.method=='POST':
            product= request.form
            image = request.files['imagefile']
            imagepath=os.path.join(product_image_dir, secure_filename(image.filename))
            conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
            cursor=conn.cursor()
            productname=product['name'].title()
            cursor.execute("""SELECT name from tbproducts where name = %s LIMIT 1""",(productname,))
            data=cursor.fetchall()
            if len(data)==0:
                cursor.execute("""INSERT into tbproducts (name,category,image,dimension,color,description) values(%s,%s,%s,%s,%s,%s)""",(productname,product['cat'].title(),imagepath,product['dimension'],product['color'],product['description']))
                image.save(os.path.join(app.root_path,imagepath))
                conn.commit()
                res="item was added on database" 
            else:
                res=product['name'] + " already exists in the database"

            return jsonify({'result':res})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()

@app.route('/create_account', methods=["POST"])
def create_account():
    try:
        if request.method=='POST':
            newuser= request.get_json(force=True)
            conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
            cursor=conn.cursor()
            username=newuser['username'].title()
            cursor.execute("""SELECT username from tbusers where username = %s LIMIT 1""",(username,))
            data=cursor.fetchall()
            if len(data)==0:
                hashedpassword=generate_password_hash(newuser['password'],'sha256')
                cursor.execute("""insert into tbusers(username,surname,othername,email,password)  values(%s,%s,%s,%s,%s)""",(newuser['username'].title(),newuser['surname'].title(),newuser['othernames'].title(),newuser['email'],hashedpassword))
                conn.commit()
                res="account for " + username + " created"
            else:
                res="user with username " +newuser['username'] + " already exists in the database"

            return jsonify({'result':res})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()


@app.route('/update_account', methods=["POST"])
def updateAccount():
    try:
        update= request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""UPDATE tbusers set username=%s,surname=%s,othername=%s,email=%s WHERE user_id=%s""",(update['username'].title(),update['surname'].title(),update['othernames'].title(),update['email'],currentuser))
        conn.commit()
        res="account details has been updated created"
        session['user']=update['othernames'].title()
        return jsonify({'result':res})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()

@app.route('/update_account_all', methods=["POST"])
def updateAccountAll():
    try: 
        update= request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        hashedpassword=generate_password_hash(update['password'],'sha256')
        cursor.execute("""UPDATE tbusers set username=%s,surname=%s,othername=%s,email=%s,password=%s WHERE user_id=%s""",(update['username'].title(),update['surname'].title(),update['othernames'].title(),update['email'],hashedpassword,currentuser))
        conn.commit()
        res="account details has been updated created"
        session['user']=update['othernames'].title()
        return jsonify({'result':res})
    except Exception as ex:
        print(str(ex))
    finally: 
            conn.close()

@app.route('/get_user', methods=["GET"])
def getUser():
    try:
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT * from tbusers where user_id = %s LIMIT 1""",(currentuser,))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        return jsonify(result)
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()

@app.route('/updateproduct', methods=["POST"])
def updateProduct():
    try:
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        if request.method=='POST':
            product= request.form
            productid=product['id']
            print(len(request.files))
            if(len(request.files)>0):
                image=request.files['imagefile']
                imagepath=os.path.join(product_image_dir, secure_filename(image.filename))
                cursor.execute("""UPDATE  tbproducts set name = %s ,category = %s, image = %s, dimension=%s, color=%s, description=%s where id = %s """,(product['name'],product['cat'],imagepath,product['dimension'],product['color'],product['description'],productid))
                image.save(os.path.join(Base_dir,imagepath))
                conn.commit()
            else:
                cursor.execute("""UPDATE  tbproducts set name = %s ,category = %s, dimension=%s, color=%s, description=%s where id = %s """,(product['name'],product['cat'],product['dimension'],product['color'],product['description'],productid))
                conn.commit()
            cursor.execute("""SELECT * from tbproducts where id=%s""",(productid,))
            update=cursor.fetchall()
            res="product details updated successfully"
            return jsonify({'result':res,'name':update[0][1],'category':update[0][2],'image':update[0][4],'dimension':update[0][5],'color':update[0][6],'id':update[0][0],'description':update[0][7]})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()

@app.route('/deleteproduct',methods=["POST"])
def deleteproduct():
        try:
                product=request.get_json(force=True)
                productid=product['productid']
                conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
                cursor=conn.cursor()
                cursor.execute("""SELECT image from  tbproducts where id = %s""" ,(productid,))
                data=cursor.fetchall()
                imagepath=data[0][0]
                cursor.execute("""DELETE from  tbproducts where id = %s""" ,(productid,))
                os.remove(os.path.join(Base_dir,imagepath))
                conn.commit()
                return jsonify({'result':"Product deleted"})
        except Exception as ex:
                print(str(ex))
        finally:
                conn.close()

@app.route('/relatedproducts',methods=["POST"])
def relatedProducts():
    try:
        data=request.get_json(force=True)
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name, dimension,color,image,id,category,description from tbproducts where category=%s and name != %sORDER BY RAND() LIMIT 4 """,(data['cat'],data['name']))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        return jsonify(result)
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/addquotationrequest', methods=["POST"])
def addQuotationRequest():
    try: 
       if request.method=='POST':
            data= request.get_json(force=True)
            conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
            cursor=conn.cursor()
            cursor.execute("""INSERT into tbcustomers (name,phone,email,active) values(%s,%s,%s,true)""",(data[0]['name'].title(),data[0]['phone'],data[0]['email'].title()))
            customerid=  conn.insert_id()
            for i in range(1,len(data)):
                cursor.execute("""INSERT into tbquotations (customerid,productid,quantity) values(%s,%s,%s)""",(customerid,data[i]['id'],data[i]['quantity']))
            conn.commit()
            return jsonify({'result':"success"})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()
@app.route('/getcustomers',methods=["GET"])
def getCustomers():
    try:
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT name, phone, email,id from tbcustomers WHERE active=True""")
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for customer in data:
            result.append(dict(zip(columns,customer)))
        return jsonify(result)
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

@app.route('/getcustomerrequest',methods=["GET","POST"])
def getCustomerRequest():
    try:
        data=request.get_json(force=True)
        print(data['customerid'])
        conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
        cursor=conn.cursor()
        cursor.execute("""SELECT p.name,p.dimension,q.quantity from tbproducts as p INNER JOIN tbquotations as q ON p.id = q.productid where q.customerid=%s """,(data['customerid'],))
        data=cursor.fetchall()
        columns =[ column[0] for column in cursor.description]
        result=[]
        for item in data:
            result.append(dict(zip(columns,item)))
        print(len(result))
        return jsonify(result)
    except Exception as ex:
        print(str(ex))
    finally:
        conn.close()

#email sending functions
@app.route('/sendresponse',methods=["POST"])
def sendResponse():
        data=request.get_json(force=True)
        try:
                msg = Message(subject='Quotation From Timbertec Limited',sender='sales@timberteclimited.co.ke',recipients=[data['email']] )
                msg.html='<p>Hello ' + data['customername'] + '\nWith regards to your quotation request the follow are the prices for the requested products</p>'
                msg.html+=data['html']
                msg.html+='<h4 class="col-sm-12">Total Amount<span style="position:relative;float:right;right:-10px;" id="total">' + data['total'] + '</span></h4>'
                mail.send(msg)
                conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
                cursor=conn.cursor()
                cursor.execute("""UPDATE  tbcustomers set active = false where id = %s """,(data['id'],))
                conn.commit()
                return jsonify({'sent':'Email successfully sent to: ' + data['email']}) 
        except Exception as ex:
                print(str(ex))
                return jsonify({'sent':"Email NOT sent\nPlease check your connection or the email address  and try again"})

@app.route('/resetrequest',methods=["POST"])
def resetRequest():
        data=request.get_json(force=True)
        try:
                conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
                cursor=conn.cursor()
                cursor.execute("select user_id from tbusers where email= %s",(data['email'],))
                user=cursor.fetchall()
                if   not  user:
                    return jsonify({'sent':False,'message':'user with email address '+data['email']+ ' Does NOT exist in the system'})   

                serialize = Serializer(app.config['SECRET_KEY'],1800)
                token = serialize.dumps({'user_id':user[0]}).decode('utf-8')
                if session.get(str(user[0])):
                        return jsonify({'sent':False,'message':'you can not reset password if your already logged in'})
                msg = Message(subject='Timbertec Limited Reset Password',sender='admin@timberteclimited.co.ke',recipients=[data['email']] )
                msg.body=f'''''click the reset password link below to reset  your password:
               { url_for('resetPassword',token=token,_external=True)}
                If you did not request a password request Please ingore this email.Please note that this link will expire in 30 minutes'''
                mail.send(msg)
                return jsonify({'sent':True}) 
        except Exception as ex:
                print(str(ex))
                return jsonify({'sent':False,'message':'Email NOT sent\nPlease check your connection or the email address  and try again'})

@app.route('/changepassword', methods=["POST"])
def changePassword():
    try:
        if request.method=='POST':
            data= request.get_json(force=True)
            conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
            cursor=conn.cursor()
            hashedpassword=generate_password_hash(data['password'],'sha256')
            cursor.execute("""UPDATE  tbusers set password = %s where user_id = %s """,(hashedpassword,data['userid']))
            conn.commit()
            res="password was successfully reset"
            return jsonify({'result':res})
    except Exception as ex:
        print(str(ex))
    finally:
            conn.close()

#login function
@app.route("/validateLogin",methods=["POST","GET"])
def validateLogin():
        message=""
        try:
                #database connection 
                conn=pymysql.connect(host='www.timberteclimited.co.ke',user='timberte_harun',password='timbertec@2020',db='timberte_timbertecdb') 
                cursor=conn.cursor()
                cursor.execute("select * from tbusers")
                users=cursor.fetchall()
        except Exception as ex:
                return jsonify({"login":False,"message":str(ex)})
        finally:
                conn.close()

        if request.method=='POST':
                user= request.get_json(force=True)
        for dbuser in users:            
                if dbuser[1]==user['username'].title():
                        if check_password_hash(dbuser[5],user['password']):
                                global currentuser
                                currentuser=str(dbuser[0])
                                session[currentuser]=True
                                session['user']=dbuser[3]
                                message="success" 
                                return jsonify({"login":True,"message":message})
                        else:
                                message="wrong password"
                                return jsonify({"login":False,"message":message})       
                else:
                        message="incorrect username"
                        data={"login":False,"message":message}
        return jsonify(data)

@app.route('/logout',methods=["GET","POST"])
def logout():
    if session.get(currentuser):
        session.pop(currentuser,None)
        session.pop('user',None)
        return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)