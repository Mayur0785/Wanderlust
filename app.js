require('dotenv').config() 
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing");
const ReviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // use to parse the data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public"))) // it is used to use static files
app.engine("ejs",ejsmate);


const dburl = process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("Error in mongo session", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,  // after 7 days it will expire
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "lax",
        secure : process.env.NODE_ENV === "production",
    },
};




// app.get("/",(req,res)=>{
//     res.send("Hii i am root");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());   // it is used to store user related
passport.deserializeUser(User.deserializeUser());  // It is used to remove user related

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username : "delta-student"
//     });

//     let registeredUser = await User.register(fakeuser,"Helloworld"); // registered method (user,"password",callback);
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


// err handler
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    if (err.name === "CastError") {
        statusCode = 404;
        message = "Resource not found (invalid ID)";
    }
    res.status(statusCode).render("listings/error.ejs",{message});
})




async function main(){
    await mongoose.connect(dburl);
}



main().then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
})


if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening to port ${port}`);
})



