import json

def update_pokedex_number(json_file_path, pokemon_name, pokedex_number):
    try:
        with open(json_file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        
        updated = False
        for card in data:
            if card["name"].lower() == pokemon_name.lower():
                card["pokedexNumber"] = pokedex_number
                updated = True
                break
        
        if updated:
            with open(json_file_path, "w", encoding="utf-8") as file:
                json.dump(data, file, ensure_ascii=False, indent=4)
            print(f"Le numéro de Pokédex de '{pokemon_name}' a été mis à jour avec succès.")
            return True
        else:
            print(f"Le Pokémon '{pokemon_name}' n'a pas été trouvé dans le fichier JSON.")
            return False
    
    except FileNotFoundError:
        print(f"Le fichier {json_file_path} est introuvable.")
        return False
    except json.JSONDecodeError:
        print("Le fichier JSON est mal formé.")
        return False
    except Exception as e:
        print(f"Une erreur inattendue s'est produite : {e}")
        return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage : python update_pokedex.py <chemin_json> <nom_pokemon> <numero_pokedex>")
    else:
        json_file_path = sys.argv[1]
        pokemon_name = sys.argv[2]
        try:
            pokedex_number = int(sys.argv[3])
        except ValueError:
            print("Le numéro de Pokédex doit être un entier.")
            sys.exit(1)

        update_pokedex_number(json_file_path, pokemon_name, pokedex_number)
