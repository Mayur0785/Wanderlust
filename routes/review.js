const express = require("express");
const router = express.Router({mergeParams:true});

const wrapasyncfn = require("../utils/asyncwrap");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedIn, isreviewauthor } = require("../middleware");

const reviewcontroller = require("../controllers/review");

//validate review by using joi server side validation
const validatereview = (req,res,next)=>{
     let {error} =  reviewSchema.validate(req.body);
       if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
       }else{
        next();
       }
};


//review post route
router.post("/",isLoggedIn,validatereview, wrapasyncfn(reviewcontroller.createreview))

//review delete route
router.delete("/:reviewId",isLoggedIn,isreviewauthor,wrapasyncfn(reviewcontroller.deletereview)
)

module.exports = router;