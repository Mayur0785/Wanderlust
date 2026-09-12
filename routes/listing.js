const express = require("express");
const router = express.Router();
const wrapasyncfn = require("../utils/asyncwrap");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema");
const Listing = require("../models/listing");
const {isLoggedIn, isowner} = require("../middleware");
const { findById } = require("../models/user");
const multer = require("multer");
const {storage} = require("../cloudconfig");

const upload = multer({storage});

const listingcontroller = require("../controllers/listing");

//validate listing by using joi
const validatelisting = (req,res,next)=>{
     let {error} =  listingSchema.validate(req.body);
       if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
       }else{
        next();
       }
}

//router.route is used to compact the same path code

//index route
router.get("/", wrapasyncfn(listingcontroller.index))

//new route  (show route cha varti thevaych aahe) hachat new la show route chi id smajto 
router.get("/new",isLoggedIn ,listingcontroller.rendernewform)


//show route 
router.get("/:id", wrapasyncfn(listingcontroller.showlisting));


//create route 
router.post("/",isLoggedIn ,upload.single("listing[image]"), validatelisting,wrapasyncfn(listingcontroller.createlisting))


// edit route
router.get("/:id/edit",isLoggedIn ,isowner, wrapasyncfn(listingcontroller.editlisting));


//update route
router.put("/:id",isLoggedIn ,isowner ,upload.single("listing[image]"),validatelisting, wrapasyncfn(listingcontroller.updatelisting));




//delete route
router.delete("/:id",  isLoggedIn,isowner ,wrapasyncfn(listingcontroller.deletelisting))


module.exports = router;