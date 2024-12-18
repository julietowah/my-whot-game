from flask import Flask, jsonify, request
from flask_cors import CORS
from game_logic import WhotGame

app = Flask(__name__)
CORS(app)

game = None  # Placeholder for the game instance

@app.route("/setup", methods=["POST"])
def setup_game():
    global game
    data = request.json
    player_names = data.get("players", [])
    
    if len(player_names) < 2 or len(player_names) > 4:
        return jsonify({"error": "Game must have 2-4 players."}), 400

    # Initialize the game with specified players
    game = WhotGame(player_names)
    return jsonify({"message": "Game setup complete", "players": player_names})

@app.route("/share_cards", methods=["POST"])
def share_cards():
    if not game:
        return jsonify({"error": "Game not set up. Please use /setup to initialize players."}), 400

    data = request.json
    cards_to_deal = data.get("cards_to_deal")

    if cards_to_deal is None or not (1 <= cards_to_deal <= 5):
        return jsonify({"error": "Number of cards must be between 1 and 5."}), 400

    try:
        game.deal_cards(cards_to_deal)  # Call method to deal cards
        return jsonify({
            "message": "Cards have been dealt successfully.",
            "players": [{"name": player.name, "hand": player.show_hand()} for player in game.players]
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
@app.route("/start", methods=["GET"])
def start_game():
    """
    Start the game after players have been initialized.
    """
    if not game:
        return jsonify({"error": "Game not set up. Please use /setup to initialize players."}), 400

    # Start dealing cards and setting up the discard pile
    game.start_game()
    
    return jsonify({
        "message": "Game started",
        "discard_pile": str(game.discard_pile[-1]) if game.discard_pile else None,
        "players": [{"name": player.name, "hand": player.show_hand()} for player in game.players]
    })


@app.route("/play", methods=["POST"])
def play_turn():
    """
    Handle a player's action (play a card or draw).
    """
    if not game:
        return jsonify({"error": "Game not set up. Please use /setup to initialize players."}), 400

    data = request.json
    player_name = data["player_name"]

    # Find the current player
    current_player = next((player for player in game.players if player.name == player_name), None)
    
    if not current_player:
        return jsonify({"error": f"Player {player_name} not found."}), 404

    # Handle computer players
    if current_player.is_computer:
        action = current_player.choose_action(game.discard_pile[-1], game.current_shape)
        if action == "draw":
            if not game.deck.is_empty():
                drawn_card = game.deck.pop_card(0)
                current_player.add_card(drawn_card)
                return jsonify({"message": f"{player_name} drew a card.", "hand": current_player.show_hand()})
            else:
                return jsonify({"error": "The deck is empty! Cannot draw a card."}), 400

        elif action.startswith("play"):
            _, index_str = action.split()
            index = int(index_str)
            card_to_play = current_player.hand[index]
            game.discard_pile.append(current_player.remove_card(index))
            return jsonify({"message": f"{player_name} played {card_to_play}.", "hand": current_player.show_hand()})
    else:
        # Handle human players
        action = data["action"]
        if action["action"] == "draw":
            if not game.deck.is_empty():
                drawn_card = game.deck.pop_card(0)
                current_player.add_card(drawn_card)
                return jsonify({"message": f"{player_name} drew a card.", "hand": current_player.show_hand()})
            else:
                return jsonify({"error": "The deck is empty! Cannot draw a card."}), 400

        elif action["action"] == "play":
            index = action.get("index")
            if index is None or index < 0 or index >= len(current_player.hand):
                return jsonify({"error": "Invalid card index."}), 400
            
            card_to_play = current_player.hand[index]
            game.discard_pile.append(current_player.remove_card(index))
            return jsonify({"message": f"{player_name} played {card_to_play}.", "hand": current_player.show_hand()})

@app.route("/status", methods=["GET"])
def game_status():
    """
    Get the current status of the game.
    """
    if not game:
        return jsonify({"error": "Game not set up. Please use /setup to initialize players."}), 400

    status = {
        "discard_pile": str(game.discard_pile[-1]) if game.discard_pile else None,
        "players": [{"name": player.name, "hand_size": len(player.hand)} for player in game.players],
        "current_turn": game.players[game.current_player_index].name
    }
    
    return jsonify(status)

if __name__ == "__main__":
    app.run(debug=True)
