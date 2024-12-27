from typing import List
import random

class Card:
    SHAPES = ["Circles", "Triangles", "Crosses", "Squares", "Stars", "Whot"]

    def __init__(self, shape: str, number: int):
        self.shape = shape
        self.number = number

    def __str__(self):
        return f"{self.number} of {self.shape}"

    def get_shape(self):
        return self.shape

    def get_number(self):
        return self.number


class Deck:
    def __init__(self):
        self.cards = []
        self.create_deck()
        self.shuffle()

    def create_deck(self):
        for shape in Card.SHAPES[:-1]:  # Exclude "Whot"
            numbers = {
                "Circles": [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
                "Triangles": [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
                "Crosses": [1, 2, 3, 5, 7, 10, 11, 13, 14],
                "Squares": [1, 2, 3, 5, 7, 10, 11, 13, 14],
                "Stars": [1, 2, 3, 4, 5, 7, 8]
            }[shape]
            for number in numbers:
                self.cards.append(Card(shape, number))
        for _ in range(5):  # Add 5 Whot cards
            self.cards.append(Card("Whot", 20))

    def shuffle(self):
        random.shuffle(self.cards)

    def pop_card(self, index=0):
        return self.cards.pop(index)

    def is_empty(self):
        return len(self.cards) == 0


class Player:
    def __init__(self, name: str, is_computer: bool = False):
        self.name = name
        self.hand = []
        self.is_computer = is_computer

    def add_card(self, card: Card):
        self.hand.append(card)

    def remove_card(self, index: int):
        return self.hand.pop(index)

    def is_empty(self):
        return len(self.hand) == 0

    def show_hand(self):
        return ", ".join(str(card) for card in self.hand)

    def choose_action(self, top_card: Card, current_shape: str):
        if self.is_computer:
            # Simple AI logic for the computer's action
            for i, card in enumerate(self.hand):
                if card.get_shape() == top_card.get_shape() or card.get_number() == top_card.get_number() or card.get_shape() == "Whot":
                    return f"play {i}"
            return "draw"
        else:
            return input("Choose an action - 'draw' or 'play <index>': ")


class WhotGame:
    def __init__(self, player_names: List[str]):
        self.deck = Deck()
        self.players = [
            Player(name, is_computer=(i != 0)) for i, name in enumerate(player_names)
        ]
        self.current_player_index = 0
        self.discard_pile = []
        self.current_shape = None

    def start_game(self):
    # Ensure the deck is not empty
        if not self.deck.is_empty():
        # Deal the first card to the discard pile
            initial_card = self.deck.pop_card(0)
            self.discard_pile.append(initial_card)
            self.current_shape = initial_card.get_shape()
            print(f"Starting card on the discard pile: {initial_card}")


    def deal_cards(self, cards_to_deal: int):
        if cards_to_deal < 1 or cards_to_deal > 5:
            raise ValueError("Number of cards must be between 1 and 5.")

        self.deck.shuffle()
        for player in self.players:
            for _ in range(cards_to_deal):
                if not self.deck.is_empty():
                    player.add_card(self.deck.pop_card(0))

        # Ensure a card is placed in the discard pile
        if not self.discard_pile:
            self.start_game()


    def apply_special_card_effect(self, card: Card):
        special_card_effects = {
            1: self.hold_on_effect,
            2: self.pick_two_effect,
            5: self.pick_three_effect,
            8: self.suspension_effect,
            14: self.general_market_effect
        }
        effect_function = special_card_effects.get(card.get_number())
        if effect_function:
            return effect_function()
        return False

    def hold_on_effect(self):
        print("Hold On! You get another turn.")
        return True

    def pick_two_effect(self):
        next_player_index = (self.current_player_index + 1) % len(self.players)
        print(f"{self.players[next_player_index].name} must draw two cards!")
        for _ in range(2):
            if not self.deck.is_empty():
                self.players[next_player_index].add_card(self.deck.pop_card(0))
        return False

    def pick_three_effect(self):
        next_player_index = (self.current_player_index + 1) % len(self.players)
        print(f"{self.players[next_player_index].name} must draw three cards!")
        for _ in range(3):
            if not self.deck.is_empty():
                self.players[next_player_index].add_card(self.deck.pop_card(0))
        return False

    def suspension_effect(self):
        print("Suspension! The next player misses a turn.")
        self.current_player_index = (self.current_player_index + 2) % len(self.players)
        return False

    def general_market_effect(self):
        print("General Market! All other players draw one card.")
        for i, player in enumerate(self.players):
            if i != self.current_player_index:
                if not self.deck.is_empty():
                    player.add_card(self.deck.pop_card(0))
        return False
    def can_play_card(self, card: Card) -> bool:
        """
        Check if a card can be played based on the current game state.
        """
        if not self.discard_pile:
            return True  # Any card can be played if the discard pile is empty.

        top_card = self.discard_pile[-1]

        # A card can be played if:
        # 1. It matches the shape or number of the top card.
        # 2. It is a Whot card (special card).
        if card.get_shape() == top_card.get_shape() or card.get_number() == top_card.get_number():
            return True
        if card.get_shape() == "Whot":
            return True
        return False
    
    def next_turn(self):
        current_player = self.players[self.current_player_index]
        print(f"\n{current_player.name}'s turn.")
        print("Current Discard Pile:", self.discard_pile[-1])
        print("Your Hand:", current_player.show_hand())

        action = current_player.choose_action(self.discard_pile[-1], self.current_shape)

        if action.lower() == 'draw':
            if not self.deck.is_empty():
                current_player.add_card(self.deck.pop_card(0))
                print(f"{current_player.name} drew a card.")
            else:
                print("The deck is empty! No cards to draw.")

        elif action.startswith('play'):
            _, index_str = action.split()
            index = int(index_str)
            if 0 <= index < len(current_player.hand):
                card_to_play = current_player.hand[index]
                if self.can_play_card(card_to_play):
                    self.discard_pile.append(current_player.remove_card(index))
                    print(f"{current_player.name} played {card_to_play}.")

                    if self.apply_special_card_effect(card_to_play):
                        return

                    if card_to_play.get_shape() == "Whot":
                        if current_player.is_computer:
                            self.current_shape = random.choice(Card.SHAPES[:-1])
                            print(f"Computer chose {self.current_shape} as the new shape.")
                        else:
                            self.current_shape = input("Choose a new shape (Circles, Triangles, Crosses, Squares, Stars): ")
                            while self.current_shape not in Card.SHAPES[:-1]:
                                self.current_shape = input("Invalid shape. Choose again: ")
                        print(f"Next shape is now {self.current_shape}.")
                        return
                else:
                    print("You cannot play that card!")
            else:
                print("Invalid index!")

        self.current_player_index = (self.current_player_index + 1) % len(self.players)

    def play_game(self):
        while True:
            for player in self.players:
                if player.is_empty():
                    print(f"{player.name} has finished their cards! {player.name} wins! Game Over!")
                    return

            self.next_turn()



def main():
    while True:
        try:
            num_players = int(input("Enter number of players (2-4): "))
            if num_players < 2 or num_players > 4:
                raise ValueError("Number of players must be between 2 and 4.")
            break
        except ValueError as e:
            print(e)

    player_names = [input(f"Enter name for Player {i + 1}: ") for i in range(num_players)]

    while True:
        try:
            cards_to_deal = int(input("Enter number of cards to deal (1-5): "))
            if cards_to_deal < 1 or cards_to_deal > 5:
                raise ValueError("Number of cards must be between 1 and 5.")
            break
        except ValueError as e:
            print(e)

    game = WhotGame(player_names)
    game.start_game()
    game.deal_cards(cards_to_deal)
    game.play_game()


if __name__ == "__main__":
    main()
