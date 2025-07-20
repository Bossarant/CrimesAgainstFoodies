document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('login-section');
    const suggestionsSection = document.getElementById('suggestions-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginButton = document.getElementById('github-login-btn');
    const suggestionsListDiv = document.getElementById('suggestions-list');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    // const logoImage = document.getElementById('admin-logo-image'); // Not directly used in this script's new logic
    const newSuggestionItemNameInput = document.getElementById('new-suggestion-item-name');
    const addNewSuggestionButton = document.getElementById('add-new-suggestion-btn');


    // Simulate login
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            // In a real app, this would trigger GitHub OAuth flow.
            // For now, we just "log in" and show the suggestions.
            console.log("Simulated GitHub login initiated.");
            if (loginSection) {
                loginSection.classList.add('hidden');
            }
            if (dashboardSection) {
                dashboardSection.classList.remove('hidden');
            }
            if (suggestionsSection) {
                suggestionsSection.classList.remove('hidden');
            }
            loadDashboardStats();
            loadSuggestions();
        });
    }

    function loadDashboardStats() {
        const statsDiv = document.getElementById('dashboard-stats');
        if (!statsDiv) return;
        statsDiv.innerHTML = '<p>Loading stats...</p>';

        fetch('http://127.0.0.1:5000/api/admin/stats')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(stats => {
                statsDiv.innerHTML = `
                    <p><strong>Pending Suggestions:</strong> ${stats.pending_suggestions}</p>
                    <p><strong>Total Food Items:</strong> ${stats.total_foods}</p>
                    <p><strong>Total Preparation Items:</strong> ${stats.total_preparations}</p>
                `;
            })
            .catch(error => {
                console.error('Error loading dashboard stats:', error);
                statsDiv.innerHTML = `<p class="error">Could not load stats. Error: ${error.message}</p>`;
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
                item: itemName,
                type: selectedType
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
                alert(`Suggestion "${itemName}" of type "${selectedType}" added to the pending list.`);
                loadSuggestions(); // Refresh the list
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an issue adding the suggestion. Please try again later.');
            });

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

        fetch('http://127.0.0.1:5000/api/admin/suggestions')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(suggestions => {
                displaySuggestions(suggestions);
            })
            .catch(error => {
                console.error('Error loading suggestions from backend:', error);
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
            fetch(`http://127.0.0.1:5000/api/admin/approve/${suggestion.id}`, {
                method: 'POST',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert(`"${suggestion.item}" approved and removed from pending list.`);
                itemDiv.remove();
                if (suggestionsListDiv && suggestionsListDiv.children.length === 0) {
                    suggestionsListDiv.innerHTML = '<p>No pending suggestions found.</p>';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an issue approving the suggestion. Please try again later.');
            });
        });

        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.classList.add('reject-btn');
        rejectButton.addEventListener('click', () => {
            fetch(`http://127.0.0.1:5000/api/admin/reject/${suggestion.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert(`"${suggestion.item}" rejected.`);
                itemDiv.remove();
                if (suggestionsListDiv && suggestionsListDiv.children.length === 0) {
                    suggestionsListDiv.innerHTML = '<p>No pending suggestions found.</p>';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an issue rejecting the suggestion. Please try again later.');
            });
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