const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
   image: Joi.string().allow("", null),
   price: Joi.number().min(0).required(),
   category: Joi.string().valid("Trending", "Rooms", "Iconic cities", "Mountain", "Castles", "Amazing pools", "Camping", "Farms", "Arctic").required(),
  }).required()
});


const reviewSchema = Joi.object({
  review:Joi.object({
    comment:Joi.string().required(),
    rating:Joi.number().required().min(1).max(5),
  }).required()
})

module.exports = {reviewSchema,listingSchema};