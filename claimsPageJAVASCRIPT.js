// Function to open the request form popup
function openRequestForm() {
    const select = document.getElementById('team-select'); // Get the team selection dropdown
    const selectedValue = select.value; // Get the selected team value

    // Check if a team has been selected
    if (selectedValue === '') {
        alert("Παρακαλώ επίλεξε μια ομάδα."); // Alert the user if no team is selected
        return;
    }

    // Update the popup title with the selected team name
    document.getElementById('popup-title').textContent = `New request to ${selectedValue}`;

    // Show the request form popup
    document.getElementById('request-popup').style.display = 'block';
}

// Function to close the request form popup
function closeRequestForm() {
    // Hide the request form popup
    document.getElementById('request-popup').style.display = 'none';
}


