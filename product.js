const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { response } = require('express');
const mongoose = require('mongoose');
const e = require('express');

const app = express();
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UsersSignin", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("Database succussfull.");
}).catch((e) => {
    console.log("No connection");
})

const signInSchema = {
    UserName:{
        type : String,
        required : true
    },
    EmailAddress:{
        type : String,
        required : true
    },
    Password:{
        type : String,
        required : true
    },
    Address:{
        type : String,
        // required : true
    },
    Contact:{
        type : String,
        // required : true
    },
    Pin:{
        type : String,
        // required : true
    },
    Pid : {
        type : String
    },
    Type : {
        type : String
    },
    ProductType : {
        type : String
    },
    CartItem : [],
    BaughtItem : [],
    Target : {
        type : String
    },
    Organization : {
        type : String
    },
    QuotedAmount : {
        type : String
    },
    Interest : {
        type : String
    },
    Description : String,
    Stocks : {
        type : String
    }
}

const SignIn = mongoose.model("SignIn", signInSchema);

const ProductSchema = {
    Pid : {
        type : String
    },
    PdtOwner : {
        type : String
    },
    Stocks : {
        type : String
    },
    Review : {
        type : String
    },
    Description : {
        type : String
    }
}

const Product = mongoose.model("Product", ProductSchema);

app.get('/', (req, res) => {
    res.render('home', {accountid: null, login: false});
})

app.get('/product', (req, res) => {
    res.render('product');
})

app.get('/signin', (req, res) => {
    res.render('signin');
})

app.post('/signin', (req, res) => {
    try{
        const userName = req.body.inputUserame;
        const email = req.body.inputEmail;
        const password = req.body.inputPassword;
        const confPassword = req.body.inputConfirmPassword;
        const pin = req.body.inputPin;
        const address = req.body.inputAddress;
        const contact = req.body.inputContact;
        const type = req.body.type;
        const org = req.body.inputOrganizaton;
        const interest = req.body.inputProductInterest;
        const des = req.body.inputDescription;
        const stock = req.body.inputStocks;
        console.log(des);
        if(password === confPassword){
            SignIn.findOne({EmailAddress: email}, async (error, data) => {
                if(error){
                    console.log(error);
                } else {
                    if(!data){
                        const siginInData = new SignIn({
                            UserName: userName,
                            EmailAddress: email,
                            Password: password,
                            Address: address,
                            Contact: contact,
                            Pin: pin,
                            Type : type,
                            Organization: org,
                            Interest : interest,
                            Description : String(des),
                            Stock : stock
                        })
                        const usersSignin = await siginInData.save();
                        console.log(usersSignin);
                        res.render('home', {accountid: usersSignin._id, login: true});
                        
                    } else {
                        res.render('home', {accountid: data._id, login: true});
                    }
                }
            })
        }
    } catch (error) {
        res.status(400).send(error);
    }

})

app.get('/login', (req, res) => {
    res.render('login', {msg: ""});
})

app.post('/login', (req, res) => {
    try{
        const userName = req.body.inputUserame;
        const email = req.body.inputEmail;
        const password = req.body.inputPassword;
        const confPassword = req.body.inputConfirmPassword;
        console.log(userName);
        SignIn.findOne({EmailAddress: email}, async (error, data) => {
            if(error){
                console.log(error);
            } else {
                if(!data){
                    res.render('login', {msg: "Could not found email!"});
                }
                else if(password != confPassword){
                    res.render('login', {msg: "Password did not match"});
                }
                else {
                    res.render('home', {accountid: data._id, login: true});
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get('/account/:userid', (req, res) => {
    try {
        const userId = req.params.userid;
        SignIn.findOne({_id: userId}, async (error, data) => {
            if(error){
                console.log(error);
            } else {
                res.render('account', {accountInfo: data, userid: userId});
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/account/:userid', (req, res) => {
    try {

        const userId = req.params.userid;
        // console.log(userId);
        SignIn.findOne({_id: userId}, async (error, data) => {
            if(error){
                console.log(error);
            } else {
                res.render('account', {accountInfo: data, userid: userId});
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log("Server is running.");
})