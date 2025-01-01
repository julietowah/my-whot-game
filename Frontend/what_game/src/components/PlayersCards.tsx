import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PlayersCards: React.FC = () => {
  const location = useLocation();
  const { players, discard_pile, deck } = location.state || {}; // Get players, discard pile, and deck from state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

  interface GameStatus {
    current_player: string;
    // Add other properties as needed
  }

  const getCardImage = (card: string) => {
    const formattedCard = card.replace(/ /g, "_");
    const imagePath = `/cards/${formattedCard}.png`;
    return imagePath;
  };

  useEffect(() => {
    if (discard_pile && discard_pile.length > 0) {
      const imagePath = getCardImage(discard_pile);
      console.log("Generated Image Path for Discard Pile:", imagePath);
    }
  }, [discard_pile]);

  const startGame = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/start");
      console.log("Game started:", response.data);
      setGameStarted(true);
      setGameStatus(response.data);
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/status");
        setGameStatus(response.data);
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };
    if (gameStarted) {
      fetchGameStatus();
    }
  }, [gameStarted]);

  // Function to handle player actions
  const handlePlayerAction = async (
    playerName: string,
    action: string,
    index?: number
  ) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/play", {
        player_name: playerName,
        action: action,
        index: index,
      });
      console.log("Action response:", response.data);
      setGameStatus(response.data); // Update the game status after the action
    } catch (error) {
      console.error("Error playing turn:", error);
    }
  };

  const renderPlayerCards = (player: any, index: number) => (
    <div
      key={index}
      className={`absolute ${
        index === 0
          ? "top-0 left-1/2 transform -translate-x-1/2"
          : index === 1
          ? "bottom-0 left-1/2 transform -translate-x-1/2"
          : index === 2
          ? "top-1/2 left-5 transform -translate-y-1/2"
          : "top-1/2 right-5 transform -translate-y-1/2"
      } text-center py-3 sm:py-5`}
    >
      <h3 className="text-sm sm:text-lg font-semibold">
        {player?.name || `Player ${index + 1}`}
      </h3>
      <div
        className={`${
          index === 2 || index === 3
            ? "flex flex-col items-center gap-2 mt-2"
            : "flex flex-wrap justify-center gap-2 mt-2"
        }`}
      >
        {player?.hand
          ? player.hand.split(", ").map((card: string, i: number) => (
              <div key={i} className="shadow rounded-lg p-1">
                {index >= 1 ? (
                  // For computer players, show back of the card
                  <img
                    src="/cards/whot.png" // Path to the back of the card image
                    alt="Card Back"
                    className="h-12 sm:h-16 object-contain"
                    onClick={() => handlePlayerAction(player.name, "play", i)} // Play card on click
                  />
                ) : (
                  // For human players, show the actual card
                  <img
                    src={getCardImage(card)}
                    alt={card}
                    className="h-12 sm:h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/cards/fallback.png";
                    }}
                    onClick={() => handlePlayerAction(player.name, "play", i)} // Play card on click
                  />
                )}
              </div>
            ))
          : "No Cards"}
      </div>
    </div>
  );

  return (
    <div className="relative bg-custom bg-blue-50 h-[100vh] w-[100vw] flex items-center justify-center">
      {/* Overlay for Start Game Button */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Start Game</h2>
            <p className="mb-4">Click below to start the game.</p>
            <button
              onClick={startGame}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Center Area for Deck and Discard Pile */}
      <div className="flex items-center justify-center gap-8 w-[200px] h-[200px] p-4">
        {/* Deck */}
        <div className="flex flex-col items-center">
          <img
            src="/cards/whot.png"
            alt="Deck"
            className="h-32 sm:h-40 object-contain shadow-lg"
            onError={(e) => {
              e.currentTarget.src = "/cards/whot.png";
            }}
            onClick={() =>
              handlePlayerAction(gameStatus?.current_player ?? "", "draw")
            } // Draw card on click
          />
          <p className="text-center text-sm sm:text-sm font-bold mt-1">
            {deck?.length || 0} Cards
          </p>
        </div>

        {/* Discard Pile */}
        <div className="flex flex-col items-center">
          {discard_pile && discard_pile.length > 0 ? (
            <img
              src={getCardImage(discard_pile)} // Show last card in discard pile
              alt="Discard Pile"
              className="h-32 sm:h-40 object-contain shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "/cards/fallback.png";
              }}
            />
          ) : (
            <div className="h-32 sm:h-40 w-24 sm:w-32 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
              <p className="text-center text-sm sm:text-lg font-bold">
                Discard Pile
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Render Players */}
      {players &&
        players.map((player: any, index: number) =>
          renderPlayerCards(player, index)
        )}
    </div>
  );
};

export default PlayersCards;
