let Json; // Declare Json in a broader scope
let gameInitialized = false; // To track if the game elements have been added

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
            const newItem = prompt("Enter a new food item or preparation method to suggest:");
            if (newItem && newItem.trim() !== "") {
                const trimmedItem = newItem.trim();
                console.log("User suggested:", trimmedItem);
                // In a real application, you would send this to a backend server
                // e.g., using fetch API to POST the data.
                // The server would then handle writing to temp.json after validation/approval.
                // For now, we simulate success with an alert.
                /*
                fetch('/api/suggest-item', { // This is a placeholder for your backend endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: trimmedItem })
                })
                .then(response => response.json())
                .then(data => alert(data.message || `Suggestion "${trimmedItem}" submitted!`))
                .catch(error => {
                    console.error("Error submitting suggestion:", error);
                    alert("Could not submit suggestion at this time.");
                });
                */
                alert(`Thank you! Your suggestion "${trimmedItem}" has been noted and will be reviewed.`);
            } else if (newItem !== null) { // User clicked OK but entered nothing or only spaces
                alert("Suggestion cannot be empty. Please enter a valid item.");
            }
            // If newItem is null, user clicked "Cancel" on the prompt, so do nothing.
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