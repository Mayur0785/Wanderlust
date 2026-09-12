const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });
const Listing = require('../models/listing');

const isDryRun = process.argv.includes('--dry-run');

// Logical category assignment mapping based on property type & location
function determineCategory(title, description, location) {
    const text = (title + " " + description + " " + location).toLowerCase();
    if (text.includes("mountain") || text.includes("chalet") || text.includes("ski") || text.includes("aspen") || text.includes("banff")) {
        return "Mountain";
    }
    if (text.includes("castle") || text.includes("chateau") || text.includes("historic villa") || text.includes("brownstone")) {
        return "Castles";
    }
    if (text.includes("pool") || text.includes("beachfront") || text.includes("maldives") || text.includes("bali") || text.includes("mykonos") || text.includes("dubai")) {
        return "Amazing pools";
    }
    if (text.includes("camp") || text.includes("treehouse") || text.includes("safari") || text.includes("rustic cabin")) {
        return "Camping";
    }
    if (text.includes("farm") || text.includes("cotswolds") || text.includes("countryside") || text.includes("cottage")) {
        return "Farms";
    }
    if (text.includes("arctic") || text.includes("igloo") || text.includes("snow") || text.includes("nordic")) {
        return "Arctic";
    }
    if (text.includes("apartment") || text.includes("loft") || text.includes("room") || text.includes("miami")) {
        return "Rooms";
    }
    if (text.includes("penthouse") || text.includes("tokyo") || text.includes("boston") || text.includes("city")) {
        return "Iconic cities";
    }
    return "Trending";
}

async function migrateData() {
    console.log(`=== STARTING WANDERLUST DATA MIGRATION (${isDryRun ? 'DRY-RUN MODE' : 'LIVE UPDATE'}) ===`);
    await mongoose.connect(process.env.ATLASDB_URL);

    const listings = await Listing.find({});
    console.log(`Total listings to inspect: ${listings.length}\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (let listing of listings) {
        const queryStr = `${listing.location}, ${listing.country}`;
        let newGeometry = null;

        try {
            const response = await geocodingClient.forwardGeocode({
                query: queryStr,
                limit: 1
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                newGeometry = response.body.features[0].geometry; // { type: "Point", coordinates: [lng, lat] }
            } else {
                console.warn(`[WARN] Could not geocode location for ID ${listing._id} ("${queryStr}"). Skipping geometry update.`);
            }
        } catch (err) {
            console.error(`[ERROR] Mapbox API error for ID ${listing._id} ("${queryStr}"): ${err.message}`);
        }

        const newCategory = determineCategory(listing.title, listing.description || "", listing.location);

        console.log(`Listing ID: ${listing._id}`);
        console.log(`  Title: "${listing.title}" (${queryStr})`);
        console.log(`  Current Category: "${listing.category || 'Trending'}" -> Proposed Category: "${newCategory}"`);
        if (newGeometry) {
            console.log(`  Current Coords: [${listing.geometry ? listing.geometry.coordinates.join(', ') : 'NONE'}] -> Proposed Coords: [${newGeometry.coordinates.join(', ')}]`);
        }

        if (!isDryRun) {
            if (newGeometry) {
                listing.geometry = newGeometry;
            }
            listing.category = newCategory;
            await listing.save();
            updatedCount++;
            console.log(`  [UPDATED] Successfully saved to database.`);
        } else {
            console.log(`  [DRY-RUN] No changes saved.`);
        }
        console.log("--------------------------------------------------");
    }

    console.log(`\nMigration completed (${isDryRun ? 'DRY-RUN' : 'LIVE'}). Updated: ${updatedCount}, Skipped: ${skippedCount}`);
    await mongoose.disconnect();
}

migrateData().catch(console.error);
