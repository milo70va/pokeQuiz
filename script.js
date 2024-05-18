document.addEventListener('DOMContentLoaded', () => {
  const resultElement = document.getElementById("result");
  const pokemonImageElement = document.getElementById("pokemonImage");
  const optionsContainer = document.getElementById("options");
  const pointsElement = document.getElementById("pointsValue");
  const totalCount = document.getElementById("totalCount");
  const mainContainer = document.querySelector(".main-container");
  const loadingContainer = document.getElementById("loadingContainer");

  let usedPokemonIds = [];
  let showLoading = false;
  let count = 0;
  let points = 0;

  async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
  }

  async function loadQuestionWithOptions() {
    if (showLoading) {
      showLoadingWindow();
      hidePuzzleWindow();
    }

    let pokemonId = getRandomPokemonId();
    while (usedPokemonIds.includes(pokemonId)) {
      pokemonId = getRandomPokemonId();
    }
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    const options = [pokemon.name];
    const optionsIds = [pokemon.id];
    while (options.length < 4) {
      let randomPokemonId = getRandomPokemonId();
      while (optionsIds.includes(randomPokemonId)) {
        randomPokemonId = getRandomPokemonId();
      }
      optionsIds.push(randomPokemonId);
      const randomPokemon = await fetchPokemonById(randomPokemonId);
      const randomOption = randomPokemon.name;
      options.push(randomOption);
      if (options.length === 4) {
        showLoading = false;
      }
    }

    shuffleArray(options);

    resultElement.textContent = "¿Como se llama este bichito?";
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    optionsContainer.innerHTML = "";
    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = (event) => checkAnswer(option === pokemon.name, event);
      optionsContainer.appendChild(button);
    });

    if (!showLoading) {
      hideLoadingWindow();
      showPuzzleWindow();
    }
  }

  function checkAnswer(isCorrect, event) {
    const selectedButton = document.querySelector(".selected");
    if (selectedButton) {
      return;
    }

    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if (isCorrect) {
      displayResult("¡Friki de m**rda!", "correct");
      points++;
      event.target.classList.add("correct");
    } else {
      displayResult("Se nota que no eres virgen", "wrong");
      event.target.classList.add("wrong");
    }

    updatePoints();

    setTimeout(() => {
      showLoading = true;
      loadQuestionWithOptions();
    }, 3000);
  }

  function updatePoints() {
    const percentage = ((points / count) * 100).toFixed(2);
    pointsElement.textContent = `${percentage}%`;
  }

  function getRandomPokemonId() {
    return Math.floor(Math.random() * 649) + 1;
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function displayResult(result) {
    resultElement.textContent = result;
  }

  function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
  }

  function showLoadingWindow() {
    mainContainer.classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
  }

  function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer.classList.remove("hide");
    mainContainer.classList.add("show");
  }

  function hidePuzzleWindow() {
    mainContainer.classList.add("hide");
  }

  loadQuestionWithOptions();
});
