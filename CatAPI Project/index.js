import * as Carousel from "./Carousel.js";
import axios from "axios";

// DOM Elements - getting all our page elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// API Configuration
// Using the API key from The Cat API
const API_KEY = "live_Lfrf2FCcQ76Dv4XHvTHzvHaWwmdaXmH3Uusr7Tvqf5zkm8HcvqacvMKTbZSYBrAx";
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Initial Load - gets all breeds when page loads
async function initialLoad() {
    try {
        const response = await axios.get("/breeds");
        const breeds = response.data;

        // Add each breed to the select dropdown
        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });

        // Load first breed's info if there are breeds
        if (breeds.length > 0) {
            await loadBreedInfo(breeds[0].id);
        }
    } catch (error) {
        console.error("Error during initial load:", error);
        infoDump.innerHTML = "<p>Error loading breeds. Please try again later.</p>";
    }
}

// Load Breed Info - gets specific breed details
async function loadBreedInfo(breedId) {
    try {
        const response = await axios.get(`/images/search?breed_ids=${breedId}&limit=5`);
        const breedData = response.data;

        // Clear existing content
        Carousel.clear();
        infoDump.innerHTML = "";

        // Add images to carousel
        breedData.forEach(item => {
            Carousel.addItem(item.url, item.id);
        });

        // Show breed information if we have it
        if (breedData.length > 0 && breedData[0].breeds.length > 0) {
            const breed = breedData[0].breeds[0];
            infoDump.innerHTML = `
                <h2>${breed.name}</h2>
                <p>${breed.description}</p>
                <ul>
                    <li><strong>Temperament:</strong> ${breed.temperament}</li>
                    <li><strong>Origin:</strong> ${breed.origin}</li>
                    <li><strong>Life Span:</strong> ${breed.life_span} years</li>
                    <li><strong>Weight:</strong> ${breed.weight.metric} kg</li>
                </ul>
            `;
        }

        // Start the carousel
        Carousel.start();
    } catch (error) {
        console.error("Error loading breed info:", error);
        infoDump.innerHTML = "<p>Error loading breed information. Please try again later.</p>";
    }
}

// Progress Bar Update - shows loading progress
function updateProgress(progressEvent) {
    if (progressEvent.lengthComputable) {
        const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
        progressBar.style.width = percentComplete + "%";
    }
}

// Favourite Function - adds an image to favorites
export async function favourite(imgId) {
    try {
        const response = await axios.post("/favourites", { image_id: imgId });
        console.log("Image favourited:", response.data);
        alert("Image added to favorites!");
    } catch (error) {
        console.error("Error favouriting image:", error);
        alert("Error adding to favorites. Please try again.");
    }
}

// Get Favourites Function - shows all favorited images
async function getFavourites() {
    try {
        const response = await axios.get("/favourites");
        const favourites = response.data;

        // Clear carousel and add favorite images
        Carousel.clear();
        favourites.forEach(fav => {
            Carousel.addItem(fav.image.url, fav.image.id);
        });

        // Update info section
        infoDump.innerHTML = "<h2>Your Favorite Cats</h2>";
        
        Carousel.start();
    } catch (error) {
        console.error("Error getting favourites:", error);
        infoDump.innerHTML = "<p>Error loading favorites. Please try again later.</p>";
    }
}

// Event Listeners - setting up our page interactions
breedSelect.addEventListener("change", (event) => loadBreedInfo(event.target.value));
getFavouritesBtn.addEventListener("click", getFavourites);

// Axios Interceptors - for handling loading states
axios.interceptors.request.use((config) => {
    console.log("Request started");
    progressBar.style.width = "0%";
    document.body.style.cursor = "progress";
    config.metadata = { startTime: new Date() };
    return config;
});

axios.interceptors.response.use((response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`Request completed in ${duration}ms`);
    progressBar.style.width = "100%";
    document.body.style.cursor = "default";
    return response;
});

// Start the app!
initialLoad();