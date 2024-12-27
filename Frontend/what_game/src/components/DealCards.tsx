import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button"; // Import your reusable button

const DealCards: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData; // Get game data passed from setup

  const [cardsToDeal, setCardsToDeal] = useState<number>(1); // Default value for cards to deal

  const handleShareCards = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/share_cards", {
        cards_to_deal: cardsToDeal,
      });
      console.log("API Response:", response.data);

      console.log(response.data); // Handle successful card sharing
      // Navigate to PlayersCards page with player data
      navigate("/players", {
        state: navigate("/players", {
          state: {
            players: response.data.players,
            discard_pile: response.data.discard_pile,
            deck: response.data.deck,
          },
        }),
      });
    } catch (error) {
      console.error("Error sharing cards:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h2 className="text-3xl font-bold mb-6">Deal Cards</h2>
      <div className="mt-4">
        <label className="mr-2">Number of Cards to Deal:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={cardsToDeal}
          onChange={(e) => setCardsToDeal(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>
      <Button onClick={handleShareCards} label="Share Cards" className="mt-6" />
    </div>
  );
};

export default DealCards;
