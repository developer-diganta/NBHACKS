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
const http=require("http");
const socketio=require("socket.io");
const server = http.createServer(app);
const io=socketio(server);









let currentlyOnline=[];
function formatMessage(user,message){
  const msg={
    name:user,
    message:message
  }
  return msg;
}




mongoose.connect("mongodb+srv://surya-admin:test@1234@cluster0.ilsr2.mongodb.net/UsersSignin", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("Database succussfull.");
}).catch((e) => {
    console.log("No connection");
})




const ChatSchema ={
  RoomName: {
    type:String
  },
  chats:[]
}

const Chat=mongoose.model("Chat",ChatSchema);






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
    },
    chats:[]
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
                  var t="Kushal";
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
                            Stock : stock,
                        });
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
                    res.render('login', {msg: "User not found!"});
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
              console.log(data);
              data.chats.push("Kushal");
                res.render('account', {accountInfo: data, userid: userId});
            }
        })
    } catch (error) {
        console.log(error);
    }
})



app.get("/products/:userid",(req,res)=>{
  try{

        const newProduct = new Product({
        Pid : "60a0b540ea04cf62d0548d3a",
        Name : "Default",
        PdtOwner : "y",
        Stocks : "100",
        Review : "4",
        Prise : "1000",
        Description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    });
newProduct.save();
userid=req.params.userid;
console.log("user"+userid);
Product.find((error, products) => {
            // console.log(products);
            res.render('product',{productArr: products,accountid:userid,login:true})
        })

  }catch(error){
    console.log(error);
  }
});





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







io.on("connection",socket=>{
  socket.on("joinRoom",({user,roomname})=>{
    Chat.findOne({RoomName:roomname},async(error,data)=>{
      if(error){
        console.log(error);
      }
      else{
        if(!data){
          const newRoom=new Chat({
            RoomName:roomname,
            chat:[]
          })
          const usersChat = await newRoom.save();

        }
      }
    })
    console.log("UNAME"+user);
    var USER={
      id:socket.id,
      user:user,
      room:roomname
    };
    console.log(USER);
    currentlyOnline.push(USER);
    console.log(currentlyOnline);
    socket.join(USER.room);
    socket.broadcast.to(USER.room).emit("message",formatMessage(USER.user,`${USER.user} is Online`));
    socket.emit("")
  });

socket.on("chatMessage",(msg)=>{
  console.log(msg);
  console.log(currentlyOnline);
  console.log(socket.id);

  let currentUSER;
  for(i=0;i<currentlyOnline.length;i++){
    if(currentlyOnline[i].id==socket.id){
      console.log("in");
      currentUSER=currentlyOnline[i];
      console.log(currentUSER);
    }
  }
  room=currentUSER.room;
  console.log("THE ROOM IS :"+room);
  Chat.findOne({RoomName:room},function(err,foundList){
    if(!foundList)
    console.log("NOTTTTT");
    foundList.chats.push(currentUSER.user+"->"+msg);
    foundList.save();
  })
  Chat.findOne({RoomName:room},function(err,foundList){
    if(!foundList)
    console.log("NOTTTTT");
    console.log(foundList.chats);
  })
  console.log(currentUSER.room);
  io.to(currentUSER.room).emit("message",formatMessage(currentUSER.user,msg));
});

socket.on("disconnect",()=>{
  for(i=0;i<currentlyOnline.length;i++){
    if(currentlyOnline[i].id==socket.id){
      const user=currentlyOnline[i];
      io.to(user.room).emit("message",`${user.name} has left!`);

    }
  }
});
});

app.post("/chat",function(req,res){
  SignIn.findOne({_id:req.body.user_id},function (error,l){
    if(l.chats.length!=0){
      console.log(l);
      res.render("prevChat",{name:req.body.user,chatter:req.body.button,chat:l.chats});
    }
  })
  console.log(req.body.button);
  console.log(req.body.user);
  res.render("index",{name:req.body.user,chatter:req.body.button});
})







app.get('/singleProduct/:productid', (req, res) => {
  const userid=req.params.userid;
    const productId = req.params.productid;
    try {
        Product.findOneAndUpdate({_id : productId},(error, products) => {
            console.log("************");
            // console.log(products);
            res.render('singlePage',{userid:userid,login:true})
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/singleProduct/:productid', (req, res) => {
    console.log("************");
    const userid=req.body.userid;

    const productId = req.params.productid;
    try {
        Product.findOne({_id : productId},(error, products) => {
            // console.log(products);
            res.render('singlePage', {singleArr: products,accountid:userid,login:true});
        })
    } catch (error) {
        console.log(error);
    }
})


app.get("/profile/:userid",function(req,res){
  userid=req.params.userid;
  var a;
  SignIn.findOne({_id:userid},(error,val)=>{
    a=val.UserName;
  })
  SignIn.find((error,products) => {
    res.render("profile",{accountid:userid,products:products,name:a});
  })
})

server.listen(process.env.PORT || 3000,function(){
  console.log("Running on 3000")
});
