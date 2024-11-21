import json

# Définir les probabilités par rareté
probabilities = {
    "1l": [0.02, 0.02, 0.02, 0, 0],
    "2l": [0, 0, 0, 0.002571, 0.01714],
    "3l": [0, 0, 0, 0.00357, 0.01428],
    "4l": [0, 0, 0, 0.00333, 0.01332],
    "1e": [0, 0, 0, 0.00321, 0.01286],
    "2e": [0, 0, 0, 0.0005, 0.002],
    "3e": [0, 0, 0, 0.00222, 0.00888],
    "1c": [0, 0, 0, 0.00013, 0.00053]
}

# Fonction pour calculer la probabilité d'une carte selon sa rareté
def calculate_probability(card_type):
    # Récupérer les probabilités pour ce type de carte
    if card_type in probabilities:
        prob_list = probabilities[card_type]
        # Calculer la probabilité combinée (l'union des probabilités)
        total_probability = 1 - prod([1 - p for p in prob_list])  # prod calcule le produit des éléments
        return total_probability
    else:
        return 0

# Calcul du produit des éléments d'une liste
def prod(lst):
    result = 1
    for item in lst:
        result *= item
    return result

# Charger le fichier JSON
with open('data/pokemons.json', 'r') as file:
    pokemons = json.load(file)

# Ajouter la probabilité combinée pour chaque Pokémon
for pokemon in pokemons:
    # Calculer la probabilité pour la carte (selon son type de rareté)
    pokemon['prob_normale'] = calculate_probability(pokemon['rarity'])

# Sauvegarder le fichier JSON mis à jour
with open('data/pokemons.json', 'w') as file:
    json.dump(pokemons, file, indent=4)

print("Probabilités normales calculées et fichier mis à jour avec succès.")
