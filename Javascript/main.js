let Json; // Declare Json in a broader scope
let gameInitialized = false; // To track if the game elements have been added

document.addEventListener('DOMContentLoaded', function() {
    fetchAndStorePfJson();

    // User Auth
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userProfile = document.getElementById('user-profile');
    const welcomeMessage = document.getElementById('welcome-message');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');
    const loginModal = document.getElementById('login-modal');
    const showLoginModalBtn = document.getElementById('show-login-modal-btn');
    const closeBtn = document.querySelector('.close-btn');

    showLoginModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.classList.add('hidden');
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });
    });

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('jwt_token', data.access_token);
                loginModal.classList.add('hidden');
                userProfile.classList.remove('hidden');
                welcomeMessage.textContent = `Welcome, ${username}!`;
                saveFavoriteBtn.classList.remove('hidden');
                checkAdmin(username);
            } else {
                alert(data.msg);
            }
        });
    });

    function checkAdmin(username) {
        const adminLink = document.getElementById('admin-link');
        if (username === 'admin') {
            adminLink.classList.remove('hidden');
        }
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt_token');
        loginForm.classList.remove('hidden');
        userProfile.classList.add('hidden');
        saveFavoriteBtn.classList.add('hidden');
    });

    saveFavoriteBtn.addEventListener('click', () => {
        const token = localStorage.getItem('jwt_token');
        const item1 = document.getElementById('one').textContent.replace('🔓','').replace('🔒','').trim();
        const item2 = document.getElementById('two').textContent.replace('🔓','').replace('🔒','').trim();
        const item3 = document.getElementById('three').textContent.replace('🔓','').replace('🔒','').trim();
        const item4 = document.getElementById('four').textContent.replace('🔓','').replace('🔒','').trim();

        fetch('http://127.0.0.1:5000/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ item1, item2, item3, item4 })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
        });
    });

    const upvoteBtn = document.getElementById('upvote-btn');
    upvoteBtn.addEventListener('click', () => {
        const item1 = document.getElementById('one').textContent.replace('🔓','').replace('🔒','').trim();
        const item2 = document.getElementById('two').textContent.replace('🔓','').replace('🔒','').trim();
        const item3 = document.getElementById('three').textContent.replace('🔓','').replace('🔒','').trim();
        const item4 = document.getElementById('four').textContent.replace('🔓','').replace('🔒','').trim();

        // This is a simplified approach. A more robust solution would be to
        // create the combination in the database when it's generated, and then
        // retrieve its ID to use for upvoting. For now, we'll just create a
        // new combination on every upvote.
        fetch('http://127.0.0.1:5000/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item1, item2, item3, item4 })
        })
        .then(response => response.json())
        .then(data => {
             return fetch(`http://127.0.0.1:5000/api/upvote/${data.combination_id}`, {
                method: 'POST'
            });
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            loadHallOfFame();
        });
    });

    function loadHallOfFame() {
        const hallOfFameList = document.getElementById('hall-of-fame-list');
        hallOfFameList.innerHTML = '';
        fetch('http://127.0.0.1:5000/api/hall-of-fame')
            .then(response => response.json())
            .then(data => {
                data.forEach(combo => {
                    const li = document.createElement('li');
                    li.textContent = `${combo.item1} ${combo.item2} and ${combo.item3} ${combo.item4} - ${combo.upvotes} upvotes`;
                    hallOfFameList.appendChild(li);
                });
            });
    }

    loadHallOfFame();


    function fetchAndStorePfJson() {
        const selectedTheme = document.getElementById('theme-dropdown').value;
        let url = 'http://127.0.0.1:5000/api/items';
        if (selectedTheme) {
            url += `?category=${selectedTheme}`;
        }

        fetch(url) // Fetch from the new backend endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                Json = data;
                populateListSection(); // Populate with fetched data
            })
            .catch((err) => {
                console.error("Failed to load items from backend:", err);
                // Attempt to provide a default empty structure if fetch fails, to prevent errors elsewhere
                if (!Json) { // If Json is still not defined after all attempts
                    Json = { Food: [], Preperation: [] };
                    populateListSection(); // Populate with empty data
                }
                alert("Something went wrong while loading essential food data: " + err.message + "\nSome functionalities might be limited.");
            });
    }

    const themeDropdown = document.getElementById('theme-dropdown');
    if (themeDropdown) {
        themeDropdown.addEventListener('change', fetchAndStorePfJson);
    }

    const btn = document.getElementById('btn');
    const parentElement = document.querySelector('.parent');
    const footerElement = document.getElementById('footer');

    if (footerElement) {
        footerElement.style.color = "white";
    }

    if (btn) {
        btn.addEventListener('click', function() {
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
    const searchInput = document.getElementById('ingredient-search');
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
                item: suggestionText,
                type: suggestionType
            };

            fetch('http://127.0.0.1:5000/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSuggestion),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert(`Thank you! Your suggestion "${newSuggestion.item}" as "${newSuggestion.type}" has been submitted for review.`);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an issue submitting your suggestion. Please try again later.');
            });

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

function populateListSection(preparationsToShow = Json.Preperation, foodsToShow = Json.Food) {
    const categoriesContainer = document.getElementById('ingredient-categories');
    categoriesContainer.innerHTML = ''; // Clear existing categories

    const categories = {
        'Preparations': preparationsToShow,
        'Foods': foodsToShow
    };

    for (const category in categories) {
        const items = categories[category];
        const categoryElement = document.createElement('div');
        categoryElement.className = 'ingredient-category';

        const titleElement = document.createElement('div');
        titleElement.className = 'ingredient-category-title';
        titleElement.textContent = `${category} (${items.length})`;
        titleElement.addEventListener('click', () => {
            listElement.classList.toggle('open');
        });

        const listElement = document.createElement('ul');
        listElement.className = 'ingredient-list';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });

        categoryElement.appendChild(titleElement);
        categoryElement.appendChild(listElement);
        categoriesContainer.appendChild(categoryElement);
    }
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

let lockedItems = {
    one: false,
    two: false,
    three: false,
    four: false
};

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('lock-btn')) {
        const targetId = event.target.dataset.target;
        lockedItems[targetId] = !lockedItems[targetId];
        event.target.textContent = lockedItems[targetId] ? '🔒' : '🔓';
        document.getElementById(targetId).classList.toggle('locked', lockedItems[targetId]);
    }
});

function game() {
    const oneElement = document.getElementById('one');
    const twoElement = document.getElementById('two');
    const threeElement = document.getElementById('three');
    const fourElement = document.getElementById('four');
    const andElement = document.getElementById('and');

    if (oneElement && !lockedItems.one) oneElement.innerHTML = `${getPreperation()} <button class="lock-btn" data-target="one">🔓</button>`;
    if (twoElement && !lockedItems.two) twoElement.innerHTML = `${getfood()} <button class="lock-btn" data-target="two">🔓</button>`;
    if (threeElement && !lockedItems.three) threeElement.innerHTML = `${getPreperation()} <button class="lock-btn" data-target="three">🔓</button>`;
    if (fourElement && !lockedItems.four) fourElement.innerHTML = `${getfood()} <button class="lock-btn" data-target="four">🔓</button>`;
    if (andElement) andElement.innerHTML = "and";

    const generateImageBtn = document.getElementById('generate-image-btn');
    const upvoteBtn = document.getElementById('upvote-btn');
    generateImageBtn.classList.remove('hidden');
    upvoteBtn.classList.remove('hidden');
    generateImageBtn.onclick = () => {
        const item1 = document.getElementById('one').textContent.replace('🔓','').replace('🔒','').trim();
        const item2 = document.getElementById('two').textContent.replace('🔓','').replace('🔒','').trim();
        const item3 = document.getElementById('three').textContent.replace('🔓','').replace('🔒','').trim();
        const item4 = document.getElementById('four').textContent.replace('🔓','').replace('🔒','').trim();
        const prompt = `${item1} ${item2} and ${item3} ${item4}`;

        const socialSharingButtons = document.getElementById('social-sharing-buttons');
        socialSharingButtons.classList.remove('hidden');

        const twitterShareBtn = document.getElementById('twitter-share-btn');
        twitterShareBtn.href = `https://twitter.com/intent/tweet?text=Check%20out%20this%20culinary%20crime%20I%20generated%3A%20${prompt}&url=https://bossarant.github.io/CrimesAgainstFoodies/`;

        const redditShareBtn = document.getElementById('reddit-share-btn');
        redditShareBtn.href = `https://www.reddit.com/submit?url=https://bossarant.github.io/CrimesAgainstFoodies/&title=A%20New%20Culinary%20Crime%3A%20${prompt}`;

        const imageContainer = document.getElementById('image-container');
        const generatedImage = document.getElementById('generated-image');

        // Show loading indicator
        imageContainer.classList.remove('hidden');
        generatedImage.src = 'loading.gif'; // A placeholder loading animation

        fetch('http://127.0.0.1:5000/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.image_url) {
                generatedImage.src = data.image_url;
            } else {
                console.error('Error generating image:', data.error);
                alert('There was an issue generating the image. Please try again later.');
                imageContainer.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an issue generating the image. Please try again later.');
            imageContainer.classList.add('hidden');
        });
    };
}