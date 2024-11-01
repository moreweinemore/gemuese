// script.js

function getFamilyMemberName() {
    return document.querySelector('h1').innerText.replace('Präferenzen von ', '').trim();
}

// Laden der Items-Liste
function loadItemsList() {
    let itemsList = JSON.parse(localStorage.getItem('itemsList'));
    if (!itemsList) {
        // Wenn keine Liste im localStorage, Standardliste verwenden
        itemsList = defaultItemsList;
        localStorage.setItem('itemsList', JSON.stringify(itemsList));
    }
    return itemsList;
}

// Generieren der Items basierend auf itemsList
function generateItems() {
    const fruitsDiv = document.querySelector('.fruits');
    fruitsDiv.innerHTML = ''; // Vorherigen Inhalt löschen

    itemsList.forEach(itemName => {
        if (!isItemCategorized(itemName)) {
            const item = document.createElement('div');
            item.classList.add('item');
            item.draggable = true;
            item.innerText = itemName;
            item.setAttribute('data-name', itemName);

            item.addEventListener('dragstart', dragStart);

            fruitsDiv.appendChild(item);
        }
    });
}

// Prüfen, ob ein Item bereits kategorisiert wurde
function isItemCategorized(itemName) {
    const name = getFamilyMemberName();
    let preferences = JSON.parse(localStorage.getItem(name)) || {
        like: [],
        neutral: [],
        dislike: []
    };

    return preferences.like.includes(itemName) || preferences.neutral.includes(itemName) || preferences.dislike.includes(itemName);
}

const categories = document.querySelectorAll('.category');
categories.forEach(category => {
    category.addEventListener('dragover', dragOver);
    category.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerText);
    e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const existingItem = document.querySelector(`.item[data-name="${data}"]`);

    if (existingItem) {
        existingItem.parentNode.removeChild(existingItem);
    }

    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.draggable = true;
    newItem.innerText = data;
    newItem.setAttribute('data-name', data);

    newItem.addEventListener('dragstart', dragStart);

    e.target.appendChild(newItem);

    savePreference(e.target.id, data);
}

function savePreference(category, item) {
    const name = getFamilyMemberName();
    let preferences = JSON.parse(localStorage.getItem(name)) || {
        like: [],
        neutral: [],
        dislike: []
    };

    // Entfernen des Items aus allen Kategorien
    ['like', 'neutral', 'dislike'].forEach(cat => {
        const index = preferences[cat].indexOf(item);
        if (index !== -1) {
            preferences[cat].splice(index, 1);
        }
    });

    // Hinzufügen des Items zur neuen Kategorie
    preferences[category].push(item);

    localStorage.setItem(name, JSON.stringify(preferences));
}

function loadPreferences() {
    const name = getFamilyMemberName();
    let preferences = JSON.parse(localStorage.getItem(name));

    if (preferences) {
        // Kategorisierte Items laden
        ['like', 'neutral', 'dislike'].forEach(category => {
            const categoryDiv = document.getElementById(category);
            categoryDiv.innerHTML = ''; // Vorherige Items löschen
            preferences[category].forEach(itemName => {
                const item = document.createElement('div');
                item.classList.add('item');
                item.draggable = true;
                item.innerText = itemName;
                item.setAttribute('data-name', itemName);

                item.addEventListener('dragstart', dragStart);

                categoryDiv.appendChild(item);
            });
        });
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

window.onload = function() {
    loadPreferences();
    generateItems();
};
