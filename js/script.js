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
        .catch((error) => console.error("Erreur :", error));
    
    function initializeApp() {
        // Créer les onglets
        ["Global", "Booster Dracaufeu", "Booster Mewtwo", "Booster Pikachu"].forEach((booster, index) => {
            const li = document.createElement("li");
            li.textContent = booster === "Global" ? "Global" : booster;
            li.className = index === 0 ? "active" : "";

            if (booster !== "Global") {
                // Ajout d'une zone pour les probabilités
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

        // Synchronise l'affichage
        displayBooster(activeBooster);
    }

    function updateProbability(booster) {
        // Calcul de la probabilité d'obtenir de nouvelles cartes
        const filteredCards = cardData.filter((card) => card.booster.includes(booster));
        const remainingProbability = filteredCards
            .filter((card) => !card.owned)
            .reduce((sum, card) => sum + card.rarity, 0);

        const probDisplay = document.getElementById(`${booster}-probability`);
        probDisplay.textContent = `Probabilité : ${(remainingProbability * 100).toFixed(2)}%`;
    }

    function getCardProbability(cardType, position) {
        const posIndex = position - 1; // Convertir 1-5 en index 0-4
        if (probabilities[cardType] && probabilities[cardType][posIndex] !== undefined) {
            return probabilities[cardType][posIndex];
        } else {
            throw new Error(`Type de carte ou position invalide : ${cardType}, ${position}`);
        }
    }
    
    function calculateCardTotalProbability(card) {
        // Calculer la probabilité cumulée sur les 5 positions pour une carte donnée
        return [1, 2, 3, 4, 5].reduce((total, position) => {
            return total + getCardProbability(card.type, position);
        }, 0);
    }
    
    function calculateBoosterProbability(filteredCards) {
        // Probabilité cumulée pour au moins une carte non possédée
        const probabilities = filteredCards
            .filter((card) => !card.owned) // Cartes non possédées uniquement
            .map(calculateCardTotalProbability); // Récupérer les probabilités totales
    
        // Union des probabilités (formule : 1 - produit des probabilités complémentaires)
        const globalProbability = 1 - probabilities.reduce((product, prob) => product * (1 - prob), 1);
        return globalProbability;
    }
    
    function updateProbability(booster) {
        const filteredCards = cardData.filter((card) => card.booster.includes(booster));
    
        // Calculer la probabilité globale
        const globalProbability = calculateBoosterProbability(filteredCards);
    
        const probDisplay = document.getElementById(`${booster}-probability`);
        probDisplay.textContent = `Probabilité : ${(globalProbability * 100).toFixed(2)}%`;
    }
       
});