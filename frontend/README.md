# Movie Discovery App

A responsive movie discovery web application that allows users to explore popular movies, search for specific movies, filter by genre, change sorting, view detailed movie information, and maintain a persistent personal wishlist.

The application uses a **React frontend**, a **Node.js/Express backend**, **TMDB** as the external movie data provider, and **MongoDB** for wishlist persistence.

---

## Features

### Movie Discovery

* Browse popular movies without performing a search.
* Explore movies by genre.
* Sort movies by:

  * Most Popular
  * Top Rated
  * Newest
* Navigate through multiple pages of results.
* Responsive movie grid for desktop, tablet, and mobile screens.

### Movie Search

* Search for movies by title.
* Search results are paginated.
* Empty states are displayed when no movies match the search.
* Previous requests are cancelled when a new request is started.

### Movie Details

Each movie has a dedicated details page containing:

* Movie title
* Poster
* Backdrop image
* Rating
* Release date
* Runtime
* Genres
* Tagline
* Overview
* Wishlist action

### Wishlist

Users can:

* Add movies to their wishlist.
* Remove movies from their wishlist.
* View their saved movies on a dedicated Wishlist page.
* Keep wishlist data after refreshing the browser.

A browser-generated user ID is stored in `localStorage` and used to associate wishlist items with that browser.

### User Experience

The application includes:

* Loading skeletons
* Error states
* Empty states
* Retry actions
* Responsive layouts
* Mobile navigation
* Smooth mobile menu animation
* Dark cinematic UI
* Hover states and subtle transitions
* Fallback UI when movie images or descriptions are unavailable

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Context API
* JavaScript

### Backend

* Node.js
* Express.js
* Axios
* REST API

### Database

* MongoDB
* Mongoose

### External API

* TMDB API

### Development Tools

* Git
* GitHub
* VS Code

---

## Application Architecture

The frontend does not communicate directly with TMDB.

Instead, requests follow this architecture:

```text
React Frontend
      |
      v
Node.js + Express Backend
      |
      v
TMDB API
```

Wishlist requests use the backend and MongoDB:

```text
React Frontend
      |
      v
Express Wishlist API
      |
      v
MongoDB
```

### Why use a backend abstraction layer?

The backend acts as an abstraction layer between the frontend and the external movie API.

This provides several benefits:

* The TMDB API key is not exposed to the browser.
* External API implementation details remain on the server.
* The frontend communicates with a consistent application API.
* Movie data can be formatted before being sent to the client.
* External API changes can be handled within the backend service layer.

---

## Project Structure

```text
movie-discovery-app/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── MovieCard.jsx
│       │   ├── MovieCardSkeleton.jsx
│       │   └── Navbar.jsx
│       │
│       ├── context/
│       │   └── WishlistContext.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Movies.jsx
│       │   ├── MovieDetails.jsx
│       │   └── Wishlist.jsx
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── movieController.js
│   │   └── wishlistController.js
│   │
│   ├── models/
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── movieRoutes.js
│   │   └── wishlistRoutes.js
│   │
│   ├── services/
│   │   └── movieService.js
│   │
│   └── server.js
│
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database
* A TMDB API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/Anusaini-12/movie-discovery-app.git
cd movie-discovery-app
```

---

# Backend Setup

## 2. Go to the Server Directory

```bash
cd backend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
```

### Environment Variables

| Variable       | Description                     |
| -------------- | ------------------------------- |
| `PORT`         | Port used by the Express server |
| `MONGO_URI`    | MongoDB connection string       |
| `TMDB_API_KEY` | TMDB API key                    |

Do not commit the `.env` file to GitHub.

---

## 5. Start the Backend

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

The root endpoint can be used to verify that the server is running:

```text
http://localhost:5000/
```

---

# Frontend Setup

## 6. Open a New Terminal

From the project root:

```bash
cd frontend
```

## 7. Install Dependencies

```bash
npm install
```

## 8. Start the Frontend

```bash
npm run dev
```

The Vite development server will provide the local frontend URL, normally:

```text
http://localhost:5173
```

---

# API Endpoints

## Movie Endpoints

### Get Popular Movies

```http
GET /api/movies/popular?page=1
```

### Get Genres

```http
GET /api/movies/genres
```

### Search Movies

```http
GET /api/movies/search?query=batman&page=1
```

### Discover Movies

```http
GET /api/movies/discover?genre=28&sort=popular&page=1
```

Supported sorting values:

```text
popular
topRated
newest
```

### Get Movie Details

```http
GET /api/movies/:id
```

Example:

```http
GET /api/movies/550
```

---

## Wishlist Endpoints

### Get Wishlist

```http
GET /api/wishlist?userId=<user-id>
```

### Add Movie

```http
POST /api/wishlist
```

Example request body:

```json
{
  "movieId": 550,
  "title": "Fight Club",
  "posterPath": "https://image.tmdb.org/...",
  "userId": "browser-generated-user-id"
}
```

### Remove Movie

```http
DELETE /api/wishlist/:movieId?userId=<user-id>
```

---

# Important Technical Decisions

## 1. Backend Abstraction for TMDB

The frontend communicates with the Express backend instead of directly calling TMDB.

The backend contains a separate movie service responsible for communicating with TMDB.

This keeps external API logic separate from controllers and frontend components.

---

## 2. Service and Controller Separation

The backend separates responsibilities into:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
TMDB
```

Controllers handle HTTP requests and responses, while the movie service handles communication with TMDB.

This makes the backend easier to maintain and extend.

---

## 3. React Context for Wishlist State

The wishlist is shared across multiple pages:

* Movie Details
* Wishlist
* Navbar

Instead of passing wishlist data through multiple component levels, the application uses React Context.

This also allows the wishlist count in the navbar to update when a movie is added or removed.

---

## 4. MongoDB Persistence

Wishlist data is stored in MongoDB instead of only using browser storage.

This allows the application to demonstrate actual backend persistence.

The browser stores a generated user ID in `localStorage`, which is used to associate wishlist records with that browser.

---

## 5. Duplicate Wishlist Protection

The wishlist schema contains a compound unique index:

```text
movieId + userId
```

This prevents the same movie from being stored multiple times for the same user.

The backend also checks for an existing movie before creating a new wishlist record.

---

## 6. Request Cancellation

The Movies page uses `AbortController`.

When a new search, filter, or discovery request starts, an earlier request can be cancelled.

This helps avoid unnecessary work and reduces the chance of an older response overwriting newer results.

---

## 7. Centralized Movie Formatting

TMDB responses are transformed on the backend before being returned to the frontend.

For example, image paths are converted into complete image URLs and missing values receive fallback values.

This keeps the frontend simpler and gives it a consistent movie data structure.

---

# Handling Loading, Empty and Error States

The application does not assume that every request will succeed.

### Loading

Movie skeleton cards are displayed while movie data is loading.

### Empty

If a search produces no results, the user sees a dedicated empty state instead of a blank page.

### Error

If the API request fails, an error message and retry action are displayed.

### Missing Data

The application handles incomplete movie information.

For example:

* Missing poster → `No Image`
* Missing overview → `No description available.`
* Missing release date → `Release date unavailable`

---

# Assumptions

The following assumptions were made during development:

1. Authentication was not required by the assignment, so the application uses a browser-generated user ID instead of a full login system.

2. A user's wishlist is associated with the browser through the generated `localStorage` user ID.

3. TMDB is responsible for providing movie information, ratings, genres, and images.

4. The application uses English (`en-US`) movie data.

5. The application is intended as a demonstration/project application rather than a production-scale streaming platform.

---

# Known Limitations

### 1. No User Authentication

There is currently no registration or login system.

The wishlist is associated with a browser-generated ID.

Clearing browser storage or changing browsers will result in a different user ID.

### 2. TMDB Dependency

Movie discovery, search, genres, images, and movie details depend on TMDB being available.

If TMDB is unavailable or the API key reaches its limits, movie requests can fail.

### 3. No Advanced Caching

The current application does not have a dedicated caching layer such as Redis.

Repeated requests may therefore result in additional API calls.

### 4. Local Development API URLs

The frontend currently uses the local backend URL during development:

```text
http://localhost:5000
```

For production deployment, this should be replaced with the deployed backend URL through environment configuration.

### 5. No Authentication-Based Multi-Device Wishlist

Because the application does not have user accounts, the wishlist does not automatically follow a user across different devices.

---

# AI Tools Used

AI tools were used as development assistance during the project.

They were used for tasks such as:

* Discussing application architecture.
* Generating and refining initial implementation ideas.
* Helping structure React components.
* Debugging development issues.
* Reviewing implementation approaches.
* Improving UI styling and responsive layouts.
* Explaining unfamiliar code and technical concepts.

AI-generated code was reviewed, modified, tested, and integrated into the project manually.

The final implementation was tested through the running application rather than relying only on generated output.

---

# What I Would Improve With Additional Time

If more development time were available, I would improve the application in the following areas:

### Authentication

Add user registration and login so that wishlists can be securely associated with user accounts.

### Better Caching

Introduce server-side caching to reduce repeated requests to TMDB and improve response times.

### More Discovery Options

Add additional filters such as:

* Release year
* Minimum rating
* Language
* Runtime
* Multiple genres

### Better Pagination

Replace basic previous/next pagination with a more advanced pagination system or infinite scrolling while keeping accessibility in mind.

### Recommendation System

Add personalized movie recommendations based on the user's wishlist and browsing preferences.

### Production Configuration

Move API URLs and environment-specific configuration into frontend environment variables and add proper production deployment configuration.

### Testing

Add automated tests for:

* Backend API endpoints
* Wishlist operations
* Search behavior
* Filtering
* Pagination
* Important UI interactions

### Accessibility

Perform a more comprehensive accessibility audit covering keyboard navigation, screen readers, focus management, semantic HTML, and color contrast.

---

# Future Improvements

Possible future features include:

* User authentication
* Personalized recommendations
* Watch history
* Multiple watchlists
* Movie trailers
* Actor and director pages
* Similar movie recommendations
* Advanced filtering
* Server-side caching
* Automated testing
* Production monitoring

---

# Project Goal

The main goal of this project was to build more than a simple movie API wrapper.

The application demonstrates:

* Frontend application architecture
* REST API design
* Third-party API integration
* Database persistence
* State management
* Request cancellation
* Pagination
* Error handling
* Responsive UI design
* Separation of concerns
* Practical product-oriented UX decisions

The architecture was designed so that the frontend remains independent of the external TMDB API and communicates through the application's own backend API.

---

## License

This project was created as a development assignment/project demonstration.
