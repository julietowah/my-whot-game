import React from "react";
import { useLocation } from "react-router-dom";

const PlayersCards: React.FC = () => {
  const location = useLocation();
  const { players, discard_pile } = location.state || {}; // Get players data passed from DealCards

  const getCardImage = (card: string) => {
    // Replace spaces with underscores and use lowercase for file names
    const formattedCard = card.replace(/ /g, "_");
    return `/cards/${formattedCard}.png`;
  };

  const renderPlayerCards = (player: any, index: number) => (
    <div
      key={index}
      className={`absolute ${
        index === 0
          ? "top-2 left-1/2 transform -translate-x-1/2"
          : index === 1
          ? "bottom-2 left-1/2 transform -translate-x-1/2"
          : index === 2
          ? "top-1/2 left-2 transform -translate-y-1/2"
          : "top-1/2 right-2 transform -translate-y-1/2"
      } text-center py-3 sm:py-5`}
    >
      <div className="bg-white shadow-md rounded-lg p-2 sm:p-4">
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
                  <img
                    src={getCardImage(card)}
                    alt={card}
                    className="h-12 sm:h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/cards/fallback.png"; // Fallback image for missing cards
                    }}
                  />
                </div>
              ))
            : "No Cards"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-custom bg-blue-50 h-[100vh] w-[100vw] flex items-center justify-center">
      {/* Center Area for the Game */}
      <div className="absolute bg-white shadow-lg rounded-full h-40 w-40 sm:h-48 sm:w-48 flex items-center justify-center">
        {discard_pile && discard_pile.length > 0 ? (
          <img
            src={getCardImage(discard_pile[discard_pile.length - 1])}
            alt="Discard Pile"
            className="h-32 sm:h-40 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/cards/fallback.png"; // Fallback image for missing cards
            }}
          />
        ) : (
          <p className="text-base sm:text-lg font-bold">Game Area</p>
        )}
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
