// Lab 1: Pokedex with PokeAPI
// TODO: Implement the fetch and DOM rendering logic below.

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const pokemonCard = document.getElementById("pokemon-card");
const errorDiv = document.getElementById("error-message");

const pokeName = document.getElementById("poke-name");
const pokeId = document.getElementById("poke-id");
const pokeImg = document.getElementById("poke-img");
const pokeTypes = document.getElementById("poke-types");

// TODO: Write an async function fetchPokemon(query)
// - Make a fetch request to `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
// - Check if response.ok is true. If not, throw an error (e.g., "Pokemon not found!").
// - Parse the response JSON.
// - Hide any previous errors and show the pokemonCard.
// - Extract name, ID, types, and official artwork image URL.
//   (Hint for artwork: data.sprites.other['official-artwork'].front_default)
// - Update the DOM elements with the fetched data.
// - Catch errors and display them in errorDiv while hiding the pokemonCard.

async function fetchPokemon(query) {
  // Write your async fetch and render logic here:
}

// TODO: Attach click event listener to searchBtn to trigger search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchPokemon(query);
  }
});

