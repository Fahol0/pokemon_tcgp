import json

# Fonction pour calculer la probabilité totale par booster
def calculate_booster_probabilities(input_file):
    # Variables pour stocker la somme des probas par booster
    prob_dracaufeu = 0
    prob_mewtwo = 0
    prob_pikachu = 0

    # Charger le fichier JSON
    with open(input_file, 'r') as file:
        pokemons = json.load(file)

    # Itérer sur chaque carte et mettre à jour les variables de probabilité pour chaque booster
    for pokemon in pokemons:
        prob_normale = pokemon.get('prob_normale', 0)  # Récupérer la probabilité normale de la carte

        # Ajouter la probabilité à chaque booster où la carte apparaît
        if "Booster Dracaufeu" in pokemon["booster"]:
            prob_dracaufeu += prob_normale
        if "Booster Mewtwo" in pokemon["booster"]:
            prob_mewtwo += prob_normale
        if "Booster Pikachu" in pokemon["booster"]:
            prob_pikachu += prob_normale
    
    # Scale à 1
    prob_dracaufeu /= 4.1272
    prob_mewtwo /= 4.1247
    prob_pikachu /= 4.1272

    # Retourner les probabilités mises à jour pour chaque booster
    return prob_dracaufeu, prob_mewtwo, prob_pikachu

# Exemple d'exécution
if __name__ == "__main__":
    input_file = 'data/pokemons.json'  # Nom du fichier d'entrée (assure-toi que le fichier existe)
    prob_dracaufeu, prob_mewtwo, prob_pikachu = calculate_booster_probabilities(input_file)

    # Affichage des résultats
    print(f"Probabilité totale pour Booster Dracaufeu: {prob_dracaufeu * 100:.2f}%")
    print(f"Probabilité totale pour Booster Mewtwo: {prob_mewtwo * 100:.2f}%")
    print(f"Probabilité totale pour Booster Pikachu: {prob_pikachu * 100:.2f}%")
