document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('login-section');
    const suggestionsSection = document.getElementById('suggestions-section');
    const loginButton = document.getElementById('github-login-btn');
    const suggestionsListDiv = document.getElementById('suggestions-list');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    // const logoImage = document.getElementById('admin-logo-image'); // Not directly used in this script's new logic
    const newSuggestionItemNameInput = document.getElementById('new-suggestion-item-name');
    const addNewSuggestionButton = document.getElementById('add-new-suggestion-btn');

    let pfData = { Food: [], Preperation: [] }; // To store PF.json content

    // Fetch PF.json data on load
    fetch('../Json/PF.json')
        .then(response => {
            if (!response.ok) {
                // If PF.json is not found, it's a problem for approvals.
                // For this simulation, we'll log an error and continue with empty pfData,
                // meaning approvals won't be "saved" to any existing master list.
                console.error(`HTTP error! status: ${response.status} - ${response.statusText} while fetching PF.json. Approvals will only affect the session if PF.json is missing.`);
                // In a real app, might want to disable approval functionality or warn user more prominently.
                return { Food: [], Preperation: [] }; // Return default structure on error
            }
            return response.json();
        })
        .then(data => {
            pfData = data;
            console.log("PF.json loaded successfully:", pfData);
        })
        .catch(error => {
            console.error('Error loading or parsing PF.json:', error);
            // pfData remains as its default { Food: [], Preperation: [] }
            // This means approvals won't be added to any existing master list shown in this session from PF.json
        });

    // Simulate login
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            // In a real app, this would trigger GitHub OAuth flow.
            // For now, we just "log in" and show the suggestions.
            console.log("Simulated GitHub login initiated.");
            if (loginSection) {
                loginSection.classList.add('hidden');
            }
            if (suggestionsSection) {
                suggestionsSection.classList.remove('hidden');
            }
            loadSuggestions();
        });
    }

    // Add New Suggestion Functionality
    if (addNewSuggestionButton && newSuggestionItemNameInput) {
        addNewSuggestionButton.addEventListener('click', function() {
            const itemName = newSuggestionItemNameInput.value.trim();
            const selectedTypeElement = document.querySelector('input[name="admin-suggestion-type"]:checked');

            if (!itemName) {
                alert('Please enter a name for the food item suggestion.');
                newSuggestionItemNameInput.focus();
                return;
            }

            if (!selectedTypeElement) {
                // This case should ideally not happen if one is checked by default, but good for robustness
                alert('Please select a type for the suggestion.');
                return;
            }

            const selectedType = selectedTypeElement.value;

            const newSuggestion = {
                id: `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Temporary unique ID
                item: itemName,
                type: selectedType, // Add the selected type
                status: 'Pending', // Default status for new items
                date: new Date().toISOString()
            };

            // Add to localStorage
            try {
                let pendingSuggestions = JSON.parse(localStorage.getItem('pendingSuggestions') || '[]');
                pendingSuggestions.push(newSuggestion);
                localStorage.setItem('pendingSuggestions', JSON.stringify(pendingSuggestions));
                console.log("New suggestion added to localStorage pendingSuggestions:", newSuggestion);
            } catch (e) {
                console.error("Error updating localStorage pendingSuggestions:", e);
                alert("There was an issue saving your new suggestion to localStorage.");
                // Optionally, don't proceed to add to DOM if saving fails, or handle differently
            }

            addSuggestionToDOM(newSuggestion); // This will prepend it to the list in the UI

            // Clear input and reset radio to default
            newSuggestionItemNameInput.value = '';
            const defaultRadio = document.getElementById('admin-type-both');
            if (defaultRadio) {
                defaultRadio.checked = true;
            }

            console.log("Admin added new suggestion to list:", newSuggestion);
            alert(`Suggestion "${itemName}" of type "${selectedType}" added to the pending list.`);
        });
    }
    function loadSuggestions() {
        if (!suggestionsListDiv) return;
        suggestionsListDiv.innerHTML = '<p>Loading suggestions...</p>';

        try {
            const localSuggestions = localStorage.getItem('pendingSuggestions');
            if (localSuggestions) {
                console.log("Found suggestions in localStorage.");
                const parsedSuggestions = JSON.parse(localSuggestions);
                if (parsedSuggestions && parsedSuggestions.length > 0) {
                    displaySuggestions(parsedSuggestions);
                    return; // Exit if localStorage suggestions are loaded
                } else {
                    console.log("localStorage suggestions were empty or invalid.");
                }
            }
        } catch (e) {
            console.error("Error reading suggestions from localStorage:", e);
            // Proceed to fetch from temp.json if localStorage fails
        }

        // Fallback to fetching temp.json
        console.log("Fetching suggestions from ../Json/temp.json");
        fetch('../Json/temp.json')
            .then(response => {
                if (!response.ok) {
                    // If temp.json is not found (404), it's not necessarily an error if localStorage was primary.
                    // Treat as empty suggestions in this case, or handle based on specific needs.
                    if (response.status === 404) {
                        console.warn("../Json/temp.json not found, displaying empty suggestions list.");
                        return []; // Return empty array to display "No pending suggestions"
                    }
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(suggestions => {
                displaySuggestions(suggestions);
            })
            .catch(error => {
                console.error('Error loading suggestions from ../Json/temp.json:', error);
                if (suggestionsListDiv) {
                    suggestionsListDiv.innerHTML = `<p class="error">Could not load suggestions. Error: ${error.message}</p>`;
                }
            });
    }

    function displaySuggestions(suggestions) {
        if (!suggestionsListDiv) return;

        if (!suggestions || suggestions.length === 0) {
            suggestionsListDiv.innerHTML = '<p>No pending suggestions found.</p>';
            return;
        }

        suggestionsListDiv.innerHTML = ''; // Clear loading/error message

        suggestions.forEach(suggestion => {
            const itemDiv = createSuggestionItemElement(suggestion);
            suggestionsListDiv.appendChild(itemDiv);
        });
    }

    // Function to add a single new suggestion to the DOM (prepends to list)
    function addSuggestionToDOM(suggestion) {
        if (!suggestionsListDiv) return;

        // If "No pending suggestions" or error/loading message is present, remove it
        const existingMessageP = suggestionsListDiv.querySelector('p');
        if (existingMessageP && (
            existingMessageP.textContent === 'No pending suggestions found.' ||
            existingMessageP.textContent === 'Loading suggestions...' ||
            existingMessageP.classList.contains('error')
        )) {
            suggestionsListDiv.innerHTML = '';
        }

        const itemDiv = createSuggestionItemElement(suggestion);
        suggestionsListDiv.prepend(itemDiv); // Add to the top for visibility
    }

    // Helper to escape HTML to prevent XSS if data isn't trusted
    function escapeHTML(str) {
        if (typeof str !== 'string') return str; // Return non-strings as is
        return str.replace(/[&<>"']/g, function (match) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
        });
    }

    function renderSuggestionContent(contentElement, suggestion) {
        // Ensure suggestion.type is displayed. Default to 'N/A' if not present.
        const typeDisplay = escapeHTML(suggestion.type || 'N/A');
        contentElement.innerHTML = `<strong>Item:</strong> ${escapeHTML(suggestion.item) || 'N/A'}<br>
                                    <strong>Type:</strong> ${typeDisplay}<br>
                                    <strong>Status:</strong> ${escapeHTML(suggestion.status) || 'N/A'}<br>
                                    <strong>Date:</strong> ${suggestion.date ? new Date(suggestion.date).toLocaleString() : 'N/A'}`;
    }

    function createSuggestionItemElement(suggestion) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('suggestion-item');
        itemDiv.setAttribute('data-suggestion-id', suggestion.id); // Store ID for reference

        const contentP = document.createElement('p');
        contentP.classList.add('suggestion-content-display');
        renderSuggestionContent(contentP, suggestion); // renderSuggestionContent now includes the type
        itemDiv.appendChild(contentP);

        // Container for edit form inputs (initially hidden)
        const editFormInputsDiv = document.createElement('div');
        editFormInputsDiv.classList.add('edit-form-inputs', 'hidden');
        itemDiv.appendChild(editFormInputsDiv);

        // Approval type checkboxes
        const approvalTypeDiv = document.createElement('div');
        approvalTypeDiv.classList.add('approval-type-checkboxes');
        approvalTypeDiv.style.marginBottom = '10px'; // Add some spacing

        const types = ["Food", "Preperation", "Both"];
        types.forEach(typeValue => {
            const label = document.createElement('label');
            label.style.marginRight = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = `approval-type-${suggestion.id}`; // Unique name per suggestion item
            checkbox.value = typeValue;
            checkbox.id = `approve-${typeValue}-${suggestion.id}`;

            // Pre-check based on suggestion.type
            if (suggestion.type && suggestion.type.toLowerCase() === typeValue.toLowerCase()) {
                checkbox.checked = true;
            }

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` Approve as ${typeValue}`));
            approvalTypeDiv.appendChild(label);
        });
        itemDiv.appendChild(approvalTypeDiv); // Add checkboxes before action buttons

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('suggestion-item-actions');

        const approveButton = document.createElement('button');
        approveButton.textContent = 'Approve';
        approveButton.classList.add('approve-btn');
        approveButton.addEventListener('click', () => {
            const foodCheckbox = document.getElementById(`approve-Food-${suggestion.id}`);
            const prepCheckbox = document.getElementById(`approve-Preperation-${suggestion.id}`);
            const bothCheckbox = document.getElementById(`approve-Both-${suggestion.id}`);

            let approvedToFood = false;
            let approvedToPrep = false;

            if (bothCheckbox && bothCheckbox.checked) {
                approvedToFood = true;
                approvedToPrep = true;
            } else {
                if (foodCheckbox && foodCheckbox.checked) {
                    approvedToFood = true;
                }
                if (prepCheckbox && prepCheckbox.checked) {
                    approvedToPrep = true;
                }
            }

            if (!approvedToFood && !approvedToPrep) {
                alert("Please select an approval type (Food, Preperation, or Both).");
                return;
            }

            // Update client-side pfData
            if (approvedToFood && !pfData.Food.includes(suggestion.item)) {
                pfData.Food.push(suggestion.item);
                console.log(`"${suggestion.item}" added to pfData.Food.`);
            }
            if (approvedToPrep && !pfData.Preperation.includes(suggestion.item)) {
                pfData.Preperation.push(suggestion.item);
                console.log(`"${suggestion.item}" added to pfData.Preperation.`);
            }
            console.log("Updated pfData:", pfData);

            // Update localStorage for pending suggestions
            try {
                let pendingSuggestions = JSON.parse(localStorage.getItem('pendingSuggestions') || '[]');
                const updatedPendingSuggestions = pendingSuggestions.filter(s => s.id !== suggestion.id);
                localStorage.setItem('pendingSuggestions', JSON.stringify(updatedPendingSuggestions));
                console.log(`Suggestion ID ${suggestion.id} removed from localStorage pendingSuggestions.`);
            } catch (e) {
                console.error("Error updating localStorage pendingSuggestions:", e);
            }

            // Update UI
            itemDiv.remove();
            alert(`"${suggestion.item}" approved and removed from pending list.`);
            console.log(`Approved and removed: ${suggestion.item} (ID: ${suggestion.id})`);

            // If all items are removed, display "No pending suggestions found."
            if (suggestionsListDiv && suggestionsListDiv.children.length === 0) {
                suggestionsListDiv.innerHTML = '<p>No pending suggestions found.</p>';
            }
        });

        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.classList.add('reject-btn');
        rejectButton.addEventListener('click', () => {
            console.log(`Rejected: ${suggestion.item} (ID: ${suggestion.id})`);
            alert(`"${suggestion.item}" rejected (simulated).`);
            itemDiv.remove(); // Remove from view
            // In a real app: API call to backend to remove item from temp.json
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => toggleEditMode(itemDiv, suggestion, true));

        actionsDiv.appendChild(approveButton);
        actionsDiv.appendChild(rejectButton);
        actionsDiv.appendChild(editButton);
        itemDiv.appendChild(actionsDiv);

        return itemDiv;
    }

    function toggleEditMode(itemDiv, suggestion, isEditing) {
        const contentDisplay = itemDiv.querySelector('.suggestion-content-display');
        const editFormInputsDiv = itemDiv.querySelector('.edit-form-inputs');
        const actionsDiv = itemDiv.querySelector('.suggestion-item-actions'); // The div containing Approve/Reject/Edit

        if (isEditing) {
            contentDisplay.classList.add('hidden');
            actionsDiv.classList.add('hidden'); // Hide Approve/Reject/Edit buttons

            // Create and append edit form elements
            editFormInputsDiv.innerHTML = `
                <label for="edit-item-${suggestion.id}">Item Name:</label>
                <input type="text" id="edit-item-${suggestion.id}" value="${escapeHTML(suggestion.item || '')}">
                <label for="edit-status-${suggestion.id}">Status:</label>
                <input type="text" id="edit-status-${suggestion.id}" value="${escapeHTML(suggestion.status || '')}">
                <button class="save-edit-btn">Save</button>
                <button class="cancel-edit-btn">Cancel</button>
            `;
            editFormInputsDiv.classList.remove('hidden');

            editFormInputsDiv.querySelector('.save-edit-btn').addEventListener('click', () => {
                const updatedItem = itemDiv.querySelector(`#edit-item-${suggestion.id}`).value.trim();
                const updatedStatus = itemDiv.querySelector(`#edit-status-${suggestion.id}`).value.trim();

                if (updatedItem) {
                    suggestion.item = updatedItem; // Update the in-memory suggestion object
                    suggestion.status = updatedStatus;
                    renderSuggestionContent(contentDisplay, suggestion); // Update the display paragraph
                    console.log(`Simulated: Saved changes for suggestion ID ${suggestion.id}`, suggestion);
                    // alert(`Changes to "${suggestion.item}" saved (simulated).`); // Can be noisy
                    toggleEditMode(itemDiv, suggestion, false); // Exit edit mode
                } else {
                    alert('Item name cannot be empty.');
                }
            });

            editFormInputsDiv.querySelector('.cancel-edit-btn').addEventListener('click', () => {
                toggleEditMode(itemDiv, suggestion, false); // Exit edit mode, discard changes
            });
        } else { // Exiting edit mode
            contentDisplay.classList.remove('hidden');
            actionsDiv.classList.remove('hidden'); // Show Approve/Reject/Edit buttons
            editFormInputsDiv.classList.add('hidden');
            editFormInputsDiv.innerHTML = ''; // Clear the edit form
        }
    }

    // Theme Toggle Functionality
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('adminTheme', theme);
        if (themeToggleButton) {
            themeToggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme') || 
                                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Apply saved theme or system preference on load
    const savedTheme = localStorage.getItem('adminTheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light if no preference
    }

    // Ensure login button exists before trying to add event listener
    // (already handled by `if (loginButton)` check above)
});