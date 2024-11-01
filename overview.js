// overview.js

const familyMembers = ['Roman', 'Mirjam', 'Josia', 'Timon', 'Micha', 'Jona'];

function loadItemsList() {
    let itemsList = JSON.parse(localStorage.getItem('itemsList'));
    if (!itemsList) {
        // Wenn keine Liste im localStorage, Standardliste verwenden
        itemsList = defaultItemsList;
        localStorage.setItem('itemsList', JSON.stringify(itemsList));
    }
    return itemsList;
}

// Funktion zum Generieren der Items für die Köchin
function generateItems() {
    const itemsContainer = document.querySelector('.fruits');
    itemsContainer.innerHTML = '';
    itemsList.forEach(itemName => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('data-name', itemName);
        item.innerText = itemName;

        item.addEventListener('click', showItemPreferences);

        itemsContainer.appendChild(item);
    });
}

function loadOverview() {
    const tableBody = document.getElementById('overview-table');

    familyMembers.forEach(name => {
        let preferences = JSON.parse(localStorage.getItem(name)) || {
            like: [],
            neutral: [],
            dislike: []
        };

        let row = document.createElement('tr');

        let nameCell = document.createElement('td');
        let nameLink = document.createElement('a');
        nameLink.href = name.toLowerCase() + '.html';
        nameLink.innerText = name;
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        ['like', 'neutral', 'dislike'].forEach(category => {
            let cell = document.createElement('td');
            cell.innerText = preferences[category].join(', ') || '-';
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    generateItems();

    // Event Listener für das Schließen des Popups
    document.querySelector('.close-btn').addEventListener('click', closePopup);
    window.addEventListener('click', outsideClick);
}

function showItemPreferences(e) {
    const itemName = e.target.getAttribute('data-name');
    document.getElementById('item-title').innerText = itemName;

    let likes = [];
    let neutrals = [];
    let dislikes = [];

    familyMembers.forEach(name => {
        let preferences = JSON.parse(localStorage.getItem(name)) || {
            like: [],
            neutral: [],
            dislike: []
        };

        if (preferences.like.includes(itemName)) {
            likes.push(name);
        } else if (preferences.neutral.includes(itemName)) {
            neutrals.push(name);
        } else if (preferences.dislike.includes(itemName)) {
            dislikes.push(name);
        }
    });

    document.getElementById('likes').innerHTML = `<span class="like">Mag ich: </span>${likes.join(', ') || '-'}`;
    document.getElementById('neutrals').innerHTML = `<span class="neutral">Geht schon: </span>${neutrals.join(', ') || '-'}`;
    document.getElementById('dislikes').innerHTML = `<span class="dislike">Mag ich nicht: </span>${dislikes.join(', ') || '-'}`;

    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function outsideClick(e) {
    if (e.target == document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
    }
}

function addItem() {
    const newItemInput = document.getElementById('new-item-name');
    const newItemName = newItemInput.value.trim();

    if (newItemName && !itemsList.includes(newItemName)) {
        itemsList.push(newItemName);
        localStorage.setItem('itemsList', JSON.stringify(itemsList));
        newItemInput.value = '';
        generateItems();
    } else {
        alert('Bitte geben Sie einen gültigen, einzigartigen Namen ein.');
    }
}

// Event Listener für den Hinzufügen-Button
document.getElementById('add-item-button').addEventListener('click', addItem);

// Initialisierung
let itemsList = loadItemsList();

window.onload = loadOverview;
