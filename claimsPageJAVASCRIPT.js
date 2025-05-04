function openRequestForm() {
    const select = document.getElementById('team-select');
    const selectedValue = select.value;

    if (selectedValue === '') {
        alert("Παρακαλώ επίλεξε μια ομάδα.");
        return;
    }

    document.getElementById('popup-title').textContent = `New request to ${selectedValue}`;
    document.getElementById('request-popup').style.display = 'block';
}

function closeRequestForm() {
    document.getElementById('request-popup').style.display = 'none';
}

