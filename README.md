# Wanderlust 🏡

Wanderlust is an Airbnb-inspired full-stack web application where users can explore vacation listings, create their own listings, upload images, view locations on an interactive map, and add reviews and ratings.

## Live Demo

https://wanderlust-hh3s.onrender.com

## Features

### User Authentication

- User signup and login
- Logout functionality
- Session-based authentication using Passport.js
- Protected routes
- Authentication and authorization

### Listings

- Create new listings
- View listing details
- Edit listings
- Delete listings
- Upload listing images
- Image storage using Cloudinary
- Listing categories
- Price, location and country information

### Search and Filtering

- Search listings by title, location or country
- Filter listings by category
- Tax display toggle

Available categories:

- Trending
- Rooms
- Iconic cities
- Mountain
- Castles
- Amazing pools
- Camping
- Farms
- Arctic

### Maps

- Interactive maps using Mapbox
- Location geocoding
- Automatic coordinates for new listings
- Map markers
- GeoJSON location data

### Reviews and Ratings

- Add reviews to listings
- 1–5 star ratings
- Display ratings
- Delete reviews
- Review authorization

### Validation and Error Handling

- Joi input validation
- Centralized error handling
- Invalid listing/review ID handling
- Protected listing update fields
- Flash messages for user feedback
- Image and location validation

## Tech Stack

### Frontend

- EJS
- EJS-Mate
- Bootstrap 5
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session

### External Services

- Cloudinary - Image upload and storage
- Mapbox - Maps and geocoding

### Deployment

- GitHub
- Render

## Project Structure

```text
Wanderlust/
│
├── controllers/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   ├── listings/
│   └── users/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│
├── init/
│
├── app.js
├── middleware.js
├── schema.js
├── cloudconfig.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Environment Variables

To run the project locally, create a `.env` file in the project root and add your own credentials.

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token

NODE_ENV=development
```

Do not upload the `.env` file to GitHub.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Mayur0785/Wanderlust.git
```

### 2. Go to the project directory

```bash
cd Wanderlust
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the `.env` file

Add your MongoDB, Cloudinary and Mapbox credentials.

### 5. Start the application

```bash
npm start
```

The application will run locally on:

```text
http://localhost:8080
```

## Database

MongoDB Atlas is used as the database.

The main collections are:

- Users
- Listings
- Reviews

Listings and reviews use MongoDB ObjectId references to maintain relationships between documents.

## Image Upload

Listing images are uploaded using Cloudinary.

The application stores the Cloudinary image URL and image filename with the listing data in MongoDB.

## Maps and Location

Mapbox is used for:

- Location search
- Forward geocoding
- Displaying interactive maps
- Showing listing locations using map markers

Listing locations are stored using GeoJSON Point coordinates.

## Authentication and Authorization

Passport.js is used for user authentication.

Authorization middleware ensures that:

- Only logged-in users can create listings.
- Only listing owners can edit or delete their listings.
- Only authorized users can delete their reviews.

## Deployment

The application is deployed using Render.

Deployment flow:

```text
GitHub
   ↓
Render
   ↓
Node.js + Express + EJS
   ↓
MongoDB Atlas
   ↓
Cloudinary
   ↓
Mapbox
```

## Screenshots

Screenshots of the application will be added here.

## Future Improvements

Some features planned for future versions:

- Booking and reservation system
- Payment integration
- User dashboard
- Host dashboard
- Wishlist
- Pagination
- Advanced search filters
- Availability management
- Email notifications

## What I Learned

While building this project, I worked with:

- Full-stack web development
- Node.js and Express.js
- MVC architecture
- MongoDB and Mongoose
- Authentication and authorization
- RESTful routes
- Session management
- Cloudinary integration
- Mapbox API integration
- Geocoding
- EJS server-side rendering
- Input validation
- Error handling
- Git and GitHub
- Deployment using Render

## Author

**Mayur Kapse**

GitHub: https://github.com/Mayur0785

## License

This project was built for learning and portfolio purposes.