const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async (req, res) => {
    let { search, category } = req.query;
    let filter = {};

    const validCategories = ["Trending", "Rooms", "Iconic cities", "Mountain", "Castles", "Amazing pools", "Camping", "Farms", "Arctic"];

    if (category && validCategories.includes(category)) {
        filter.category = category;
    }

    if (search && search.trim() !== "") {
        let regex = new RegExp(search.trim(), "i");
        filter.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
        ];
    }

    const allListing = await Listing.find(filter);
    res.render("listings/index", { allListing, search: search || "", category: category || "" });
}

module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
}

module.exports.showlisting = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
})

module.exports.createlisting = (async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Listing image is required!");
        return res.redirect("/listings/new");
    }

    let queryStr = `${req.body.listing.location}, ${req.body.listing.country}`;
    let response = await geocodingClient.forwardGeocode({
        query: queryStr,
        limit: 1,
    }).send();

    if (!response.body.features || response.body.features.length === 0) {
        req.flash("error", "Invalid location provided! Could not geocode address.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    newlisting.geometry = response.body.features[0].geometry; // GeoJSON Point: [longitude, latitude]
    await newlisting.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
})

module.exports.editlisting = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
})

module.exports.updatelisting = (async (req, res) => {
    let { id } = req.params;
    const { title, description, price, location, country, category } = req.body.listing || {};
    const updateData = { title, description, price, location, country, category };

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // If location or country changed, re-geocode
    if (location && country && (location !== listing.location || country !== listing.country)) {
        let response = await geocodingClient.forwardGeocode({
            query: `${location}, ${country}`,
            limit: 1,
        }).send();
        if (response.body.features && response.body.features.length > 0) {
            updateData.geometry = response.body.features[0].geometry;
        }
    }

    Object.assign(listing, updateData);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
})

module.exports.deletelisting = (async (req, res) => {
    let { id } = req.params;
    const deletelisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletelisting);
    res.redirect("/listings");
})