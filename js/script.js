// script.js

// variables globales
let cardDate = [];

const probabilities = {
    "1l": [0.02, 0.02, 0.02, 0, 0],
    "2l": [0, 0, 0, 0.002571, 0.01714],
    "3l": [0, 0, 0, 0.00357, 0.01428],
    "4l": [0, 0, 0, 0.00333, 0.01332],
    "1e": [0, 0, 0, 0.00321, 0.01286],
    "2e": [0, 0, 0, 0.0005, 0.002],
    "3e": [0, 0, 0, 0.00222, 0.00888],
    "1c": [0, 0, 0, 0.00013, 0.00053]
};

let activeBooster = "Global";

let proba_dracaufau;
let proba_mewtwo;
let proba_pikachu;

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.getElementById("booster-tabs");
    const display = document.getElementById("card-display");

    // Charger les données depuis le fichier JSON
    fetch("data/pokemons.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données");
            }
            return response.json();
        })
        .then((data) => {
            cardData = data; // Assigner les données chargées
            initializeApp();
        })
        .catch((error) => console.error("Erreur lors du chargement des données:", error));

    function initializeApp() {
        const tabs = document.getElementById("booster-tabs");
        tabs.innerHTML = "";

        ["Global", "Booster Dracaufeu", "Booster Mewtwo", "Booster Pikachu"].forEach((booster, index) => {
            const li = document.createElement("li");
            li.textContent = booster === "Global" ? "Global" : booster;
            li.className = index === 0 ? "active" : "";
        
            if (booster !== "Global") {
                const probabilityDisplay = document.createElement("span");
                probabilityDisplay.className = "probability-display";
                probabilityDisplay.id = `${booster}-probability`;
                probabilityDisplay.textContent = "Probabilité : 100%"; // Initialisation
                li.appendChild(probabilityDisplay);
            }
        
            li.addEventListener("click", () => displayBooster(booster));
            tabs.appendChild(li);
        });
        
        // Afficher l’onglet "Global" par défaut
        displayBooster("Global");
        
        // Calculer les probabilités pour chaque booster
        calculateBoosterProbability();
        
        document.getElementById("Booster Dracaufeu-probability").textContent = `Probabilité : ${(proba_dracaufeu * 100 / 4.1272).toFixed(2)}%`;
        document.getElementById("Booster Mewtwo-probability").textContent = `Probabilité : ${(proba_mewtwo * 100 / 4.1247).toFixed(2)}%`;
        document.getElementById("Booster Pikachu-probability").textContent = `Probabilité : ${(proba_pikachu * 100 / 4.1272).toFixed(2)}%`;
    }

    // Références aux boutons de sauvegarde et chargement
    const saveButton = document.getElementById("save-button");
    const loadButton = document.getElementById("load-button");
    const loadFileInput = document.getElementById("load-file");

    // Fonction pour sauvegarder les données
    saveButton.addEventListener("click", saveData);

    // Fonction pour charger les données
    loadButton.addEventListener("click", () => loadFileInput.click());
    loadFileInput.addEventListener("change", loadData);

    // Sauvegarde les données des cartes actuelles dans un fichier JSON.
    function saveData() {
        const dataToSave = JSON.stringify(cardData, null, 2); // Mise en forme lisible
        const blob = new Blob([dataToSave], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pokemon_cards.json"; // Nom du fichier généré
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // Charge les données depuis un fichier JSON sélectionné.
    function loadData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newData = JSON.parse(e.target.result); // Analyse le JSON
                if (Array.isArray(newData)) {
                    cardData = newData; // Remplace les données actuelles
                    calculateBoosterProbability(); // Recalcule les probabilités avec les nouvelles données
                    initializeApp(); // Réinitialise l'application avec les nouvelles données
                    alert("Les données ont été chargées avec succès !");
                } else {
                    alert("Le fichier JSON n'est pas valide.");
                }
            } catch (error) {
                alert("Erreur lors du chargement des données : " + error.message);
            }
        };
        reader.readAsText(file);
    }

    function displayBooster(booster) {
        activeBooster = booster;

        // Mettre à jour les onglets actifs
        Array.from(tabs.children).forEach((tab) => {
            tab.classList.toggle("active", tab.textContent.includes(booster));
        });
    
        // Afficher les cartes
        display.innerHTML = "";
        const filteredCards = cardData
            .filter((card) => card.booster.includes(booster))
            .sort((a, b) => a.pokedexNumber - b.pokedexNumber);
    
        filteredCards.forEach((card) => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card"; // Assure que chaque carte a la classe CSS
            if (card.owned) cardDiv.classList.add("checked");
    
            const img = document.createElement("img");
            img.src = `img/${card.name}.jpg`;
            img.alt = card.name;
    
            cardDiv.appendChild(img);
            cardDiv.addEventListener("click", () => toggleCard(card));
            display.appendChild(cardDiv);
        });

        //Recalculer la probabilité si ce n'est pas l'onglet global
        if (booster !== "Global") updateProbability(booster);
    }    

    function toggleCard(card) {
        // Met à jour l'état de la carte
        card.owned = !card.owned;

        // Mettre à jour la probabilité de tous les boosters où la carte est présente
        const action = card.owned ? "remove" : "add";
        updateProbability(card, action);

        // Synchronise l'affichage
        displayBooster(activeBooster);
    }

    function calculateBoosterProbability() {
        proba_dracaufeu = 0;
        proba_mewtwo = 0;
        proba_pikachu = 0;

        cardData.forEach((card) => {
            const prob_normale = card.prob_normale || 0;
    
            if (!card.owned) {
                if (card.booster.includes("Booster Dracaufeu")) {
                    proba_dracaufeu += prob_normale;
                }
                if (card.booster.includes("Booster Mewtwo")) {
                    proba_mewtwo += prob_normale;
                }
                if (card.booster.includes("Booster Pikachu")) {
                    proba_pikachu += prob_normale;
                }
            }
        });

        proba_dracaufau = proba_dracaufau;
        proba_mewtwo = proba_mewtwo;
        proba_pikachu = proba_pikachu;
    }

    function updateProbability(card, action) {
        const prob_normale = card.prob_normale;
    
        card.booster.forEach(booster => {
            let proba = 0;
    
            if (booster === "Booster Dracaufeu") {
                proba = proba_dracaufeu;
                if (action === "add") {
                    proba += prob_normale;
                } else if (action === "remove") {
                    proba -= prob_normale;
                }
                proba_dracaufeu = proba;
                document.getElementById("Booster Dracaufeu-probability").textContent = `Probabilité : ${(proba * 100 / 4.1272).toFixed(2)}%`;
            }
            else if (booster === "Booster Mewtwo") {
                proba = proba_mewtwo;
                if (action === "add") {
                    proba += prob_normale;
                } else if (action === "remove") {
                    proba -= prob_normale;
                }
                proba_mewtwo = proba;
                document.getElementById("Booster Mewtwo-probability").textContent = `Probabilité : ${(proba * 100 / 4.1247).toFixed(2)}%`;
            }
            else if (booster === "Booster Pikachu") {
                proba = proba_pikachu;
                if (action === "add") {
                    proba += prob_normale;
                } else if (action === "remove") {
                    proba -= prob_normale;
                }
                proba_pikachu = proba;
                document.getElementById("Booster Pikachu-probability").textContent = `Probabilité : ${(proba * 100 / 4.1272).toFixed(2)}%`;
            }
        });
    }
});