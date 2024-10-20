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

  // Get Favourties Function
  async function getFavourites() {
    try {
    const response = await axios.get("/favourites");
    const favourties = response.data;
    
    // Clear existing carousel
    Carousel.clear();
  





    
    }
  }