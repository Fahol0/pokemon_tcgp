// script.js

// Données des Boosters
const Boosters = {
    Global: [...new Set(["Pikachu", "Bulbasaur", "Charmander", "Squirtle", "Eevee", "Snorlax", "Meowth", "Jigglypuff", "Pidgey"])], // Liste unique de Globales les cartes
    Booster1: ["Pikachu", "Bulbasaur", "Charmander"],
    Booster2: ["Squirtle", "Eevee", "Snorlax"],
    Booster3: ["Meowth", "Jigglypuff", "Pidgey"]
};
const probabilities = {
    Booster1: { Pikachu: 0.3, Bulbasaur: 0.4, Charmander: 0.3 },
    Booster2: { Squirtle: 0.25, Eevee: 0.5, Snorlax: 0.25 },
    Booster3: { Meowth: 0.4, Jigglypuff: 0.3, Pidgey: 0.3 }
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.getElementById("booster-tabs");
    const display = document.getElementById("card-display");

    // Créer les onglets
    Object.keys(Boosters).forEach((Booster, index) => {
        const li = document.createElement("li");
        li.textContent = Booster === "Global" ? "Global" : Booster; // Onglet "Global"
        li.className = index === 0 ? "active" : "";

        if (Booster !== "Global") {
            // Ajout d'une zone pour les probabilités (sauf pour "Global")
            const probabilityDisplay = document.createElement("span");
            probabilityDisplay.className = "probability-display";
            probabilityDisplay.id = `${Booster}-probability`;
            probabilityDisplay.textContent = "Probabilité : 100%"; // Initialisation
            li.appendChild(probabilityDisplay);
        }

        li.addEventListener("click", () => displayBooster(Booster));
        tabs.appendChild(li);
    });

    // Afficher l’onglet "Global" par défaut
    displayBooster("Global");

    function displayBooster(Booster) {
        // Mettre à jour les onglets actifs
        Array.from(tabs.children).forEach((tab) => tab.classList.remove("active"));
        tabs.querySelectorAll("li")[Object.keys(Boosters).indexOf(Booster)].classList.add("active");

        // Afficher les cartes
        display.innerHTML = "";
        Boosters[Booster].forEach((card) => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            cardDiv.dataset.card = card;

            const img = document.createElement("img");
            img.src = `images/${card}.jpg`; // Chemin vers les images
            img.alt = card;

            cardDiv.appendChild(img);
            cardDiv.addEventListener("click", () => toggleCard(cardDiv));
            display.appendChild(cardDiv);
        });
    }

    function toggleCard(cardDiv) {
        cardDiv.classList.toggle("checked");

        // Calculer les probabilités pour chaque Booster sauf "Global"
        Object.keys(Boosters).forEach((BoosterKey) => {
            if (BoosterKey === "Global") return; // Ignorer "Global"
            const checkedCards = Array.from(display.querySelectorAll(".card.checked")).map(
                (card) => card.dataset.card
            );
            const remainingCards = Boosters[BoosterKey].filter(
                (card) => !checkedCards.includes(card)
            );
            const prob = remainingCards.reduce(
                (sum, card) => sum + (probabilities[BoosterKey][card] || 0),
                0
            );
            const probDisplay = document.getElementById(`${BoosterKey}-probability`);
            probDisplay.textContent = `Probabilité : ${(prob * 100).toFixed(2)}%`;
        });
    }
});
