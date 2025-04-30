function openRequestForm() {
    const select = document.getElementById('team-select');
    const selectedValue = select.value;

    if (selectedValue === '') {
        alert("Παρακαλώ επίλεξε μια ομάδα.");
        return;
    }

    document.getElementById('popup-title').textContent = `New request to ${selectedValue}`;
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeRequestForm() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}