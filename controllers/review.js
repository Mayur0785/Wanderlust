
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createreview = (async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created!");
   res.redirect(`/listings/${listing._id}`);
})

module.exports.deletereview = (async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});    // it is used to delete the review from the reviews array . review array ke under reviewID match ho gyi toh woh delete ho jayegi..
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}) 
