//import * as Carousel from "./Carousel.js";
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
  
  // Event Listeners
  breedSelect.addEventListener("change", (event) => loadBreedInfo(event.target.value));
  