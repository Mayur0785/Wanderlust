const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){                                     // check user signup / login or not 

        req.session.redirecturl = req.originalUrl;    // original url la session madhe store kel aahe

        req.flash("error","You must be Logged in to create a listing!");
       return  res.redirect("/login");
    }
    next();
}


module.exports.saveredirecturl = (req,res,next)=>{    // it is used to save redirect session url to locals  
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
};

module.exports.isowner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let ownerId = listing.owner._id || listing.owner;
    if (!res.locals.curruser || !ownerId.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isreviewauthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    if (!res.locals.curruser || !review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
