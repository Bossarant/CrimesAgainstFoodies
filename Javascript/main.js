let Json; // Declare Json in a broader scope
let gameInitialized = false; // To track if the game elements have been added
let localTempSuggestions = []; // To store user suggestions locally

document.addEventListener('DOMContentLoaded', function() {
    fetch("Json/PF.json") // Adjusted path assuming Json folder is at the same level as index.html
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            Json = data;
            populateListSection(); // Populate the list section with JSON data
        })
        .catch((err) => {
            console.error("Failed to load JSON data:", err);
            alert("Something went wrong while loading data: " + err.message);
        });

    const btn = document.getElementById('btn');
    const sound = document.getElementById('sound');
    const parentElement = document.querySelector('.parent');
    const footerElement = document.getElementById('footer');

    if (footerElement) {
        footerElement.style.color = "white";
    }

    if (btn) {
        btn.addEventListener('click', function() {
            if (sound) {
                sound.play();
            }

            if (!gameInitialized) {
                parentElement.insertAdjacentHTML('beforeend', '<div id="two" class="all"></div>');
                parentElement.insertAdjacentHTML('beforeend', '<div id="and"></div>');
                parentElement.insertAdjacentHTML('beforeend', '<div id="three" class="all"></div>');
                parentElement.insertAdjacentHTML('beforeend', '<div id="four" class="all"></div>');
                
                document.querySelectorAll('.all').forEach(el => {
                    el.style.border = "1px solid lightskyblue";
                });
                gameInitialized = true;
            }
            game();
        });
    }

    // Search functionality for lists
    const searchInput = document.getElementById('list-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(event) {
            const searchTerm = event.target.value.toLowerCase().trim();
            let filteredPreparations = Json.Preperation; // Default to all if search is empty
            let filteredFoods = Json.Food;         // Default to all if search is empty

            if (searchTerm) {
                if (Json && Json.Preperation) {
                    filteredPreparations = Json.Preperation.filter(item => item.toLowerCase().includes(searchTerm));
                }
                if (Json && Json.Food) {
                    filteredFoods = Json.Food.filter(item => item.toLowerCase().includes(searchTerm));
                }
            }
            populateListSection(filteredPreparations, filteredFoods);
        });
    }

    // Suggest new item button
    const suggestItemButton = document.getElementById('suggest-item-btn');
    if (suggestItemButton) {
        suggestItemButton.addEventListener('click', function() {
            const suggestionTextElement = document.getElementById('new-suggestion-text');
            const suggestionText = suggestionTextElement.value.trim();
            const selectedTypeElement = document.querySelector('input[name="suggestion-type"]:checked');

            if (!suggestionText) {
                alert("Please enter your suggestion.");
                suggestionTextElement.focus();
                return;
            }

            if (!selectedTypeElement) {
                alert("Please select a type for your suggestion (Food, Preperation, or Both).");
                return;
            }

            const suggestionType = selectedTypeElement.value;

            const newSuggestion = {
                id: `temp_${Date.now()}`,
                item: suggestionText,
                type: suggestionType,
                status: 'Pending', // Default status
                date: new Date().toISOString()
            };

            localTempSuggestions.push(newSuggestion);
            console.log("Suggestion added to local temp list:", newSuggestion);
            console.log("Current localTempSuggestions:", localTempSuggestions); // For debugging

            // Store in localStorage
            try {
                localStorage.setItem('pendingSuggestions', JSON.stringify(localTempSuggestions));
                console.log("Suggestions saved to localStorage.");
            } catch (e) {
                console.error("Error saving suggestions to localStorage:", e);
                alert("There was an issue saving your suggestion locally. It might not be available on the admin page.");
            }

            alert(`Thank you! Your suggestion "${newSuggestion.item}" as "${newSuggestion.type}" has been submitted for review.`);

            // Clear the input field and reset radio buttons (optional)
            suggestionTextElement.value = '';
            // To reset radio buttons, you might need to uncheck them or check the default one.
            // For simplicity, we'll leave them as is, or the user can select again.
            // If there's a default checked radio (e.g., 'Both'), re-check it:
            const defaultRadio = document.getElementById('type-both');
            if (defaultRadio) {
                defaultRadio.checked = true;
            }
        });
    }
});

function renderList(listElement, items, noMatchMessage = "No items match your search.") {
    if (!listElement) return;
    listElement.innerHTML = ''; // Clear existing items
    if (items && items.length > 0) {
        items.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            listElement.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = noMatchMessage;
        listElement.appendChild(li);
    }
}

function populateListSection(preparationsToShow = Json.Preperation, foodsToShow = Json.Food) {
    const preparationsListElement = document.getElementById('preparations-list');
    const foodsListElement = document.getElementById('foods-list');

    const initialLoad = !Json || (!Json.Preperation && !Json.Food);
    const noMatchMsg = initialLoad ? "Loading items..." : "No items match your search.";

    renderList(preparationsListElement, preparationsToShow, noMatchMsg);
    renderList(foodsListElement, foodsToShow, noMatchMsg);
}


function getPreperation() {
    // Ensure Json and Json.Preperation are loaded
    if (!Json || !Json.Preperation || Json.Preperation.length === 0) return "Loading...";
    const varPreperation = Json.Preperation[Math.floor(Math.random() * Json.Preperation.length)];
    return varPreperation;
}

function getfood() {
    // Ensure Json and Json.Food are loaded
    if (!Json || !Json.Food || Json.Food.length === 0) return "Loading...";
    const varfood = Json.Food[Math.floor(Math.random() * Json.Food.length)];
    return varfood;
}

function game() {
    const oneElement = document.getElementById('one');
    const twoElement = document.getElementById('two');
    const threeElement = document.getElementById('three');
    const fourElement = document.getElementById('four');
    const andElement = document.getElementById('and');

    if (oneElement) oneElement.innerHTML = getPreperation();
    if (twoElement) twoElement.innerHTML = getfood();
    if (threeElement) threeElement.innerHTML = getPreperation();
    if (fourElement) fourElement.innerHTML = getfood();
    if (andElement) andElement.innerHTML = "and";
}