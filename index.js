import * as Carousel from "./Carousel.js";
import axios from "axios";

// DOM Elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// API Configuration
const API_KEY = "your_api_key_here"; // Replace with your actual API key
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Step 1: Initial Load
async function initialLoad() {
  try {
    const response = await axios.get("/breeds");
    const breeds = response.data;

    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Load initial breed info
    if (breeds.length > 0) {
      await loadBreedInfo(breeds[0].id);
    }
  } catch (error) {
    console.error("Error during initial load:", error);
  }
}

// Step 2: Load Breed Info
async function loadBreedInfo(breedId) {
  try {
    const response = await axios.get(`/images/search?breed_ids=${breedId}&limit=5`);
    const breedData = response.data;

    // Clear existing carousel and info
    Carousel.clear();
    infoDump.innerHTML = "";

    // Populate carousel
    breedData.forEach(item => {
      Carousel.addItem(item.url, item.id);
    });

    // Display breed information
    if (breedData.length > 0 && breedData[0].breeds.length > 0) {
      const breed = breedData[0].breeds[0];
      infoDump.innerHTML = `
        <h2>${breed.name}</h2>
        <p>${breed.description}</p>
        <ul>
          <li>Temperament: ${breed.temperament}</li>
          <li>Origin: ${breed.origin}</li>
          <li>Life Span: ${breed.life_span} years</li>
          <li>Weight: ${breed.weight.metric} kg</li>
        </ul>
      `;
    }

    Carousel.start();
  } catch (error) {
    console.error("Error loading breed info:", error);
  }
}

// Progress Bar Update
function updateProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
    progressBar.style.width = percentComplete + "%";
  }
}

// Favourite Function
export async function favourite(imgId) {
  try {
    const response = await axios.post("/favourites", { image_id: imgId });
    console.log("Image favourited:", response.data);
    // TODO: Implement toggle functionality
  } catch (error) {
    console.error("Error favouriting image:", error);
  }
}

// Get Favourites Function
async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;

    // Clear existing carousel
    Carousel.clear();

    // Populate carousel with favourites
    favourites.forEach(fav => {
      Carousel.addItem(fav.image.url, fav.image.id);
    });

    Carousel.start();
  } catch (error) {
    console.error("Error getting favourites:", error);
  }
}

// Event Listeners
breedSelect.addEventListener("change", (event) => loadBreedInfo(event.target.value));
getFavouritesBtn.addEventListener("click", getFavourites);

// Axios Interceptors
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

// Initialize
initialLoad();