import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./Button"; // Import the reusable button
import ReusableInput from "./Input"; // Import the reusable input

const SetupGame: React.FC = () => {
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", ""]);
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSetup = async () => {
    try {
      const filteredNames = playerNames.filter((name) => name.trim() !== "");
      const response = await axios.post("http://127.0.0.1:5000/setup", {
        players: filteredNames,
      });

      // Navigate to the game page after successful setup
      console.log(response.data);
      navigate("/deal", { state: { gameData: response.data } });
    } catch (error) {
      console.error("Error setting up game:", error);
    }
  };

  const handlePlayerSelection = (numPlayers: number) => {
    setSelectedPlayers(numPlayers);
    // Reset player names when the selection changes
    setPlayerNames(Array(numPlayers).fill(""));
  };

  return (
    <div className=" flex items-center justify-center bg-blue-50 p-4 h-[100vh] w-[100vw] ">
      <div className="flex flex-col items-center justify-center border bg-white border-gray-300 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Setup Whot Game</h2>

        <h4 className="text-xl mb-2">Choose How Many Players</h4>
        <div className="flex space-x-4 mb-4">
          {[2, 3, 4].map((num) => (
            <label key={num} className="flex items-center">
              <input
                type="radio"
                name="players"
                value={num}
                onChange={() => handlePlayerSelection(num)}
                className="mr-2"
              />
              {num}
            </label>
          ))}
        </div>

        {/* Render input fields based on selected players */}
        {selectedPlayers !== null && (
          <div className="flex flex-col space-y-4 w-full max-w-md">
            {Array.from({ length: selectedPlayers }).map((_, index) => (
              <ReusableInput
                key={index}
                value={playerNames[index]}
                placeholder={`Player ${index + 1} Name`}
                onChange={(e) => {
                  const names = [...playerNames];
                  names[index] = e.target.value;
                  setPlayerNames(names);
                }}
              />
            ))}
          </div>
        )}

        <Button onClick={handleSetup} label="Start Game" className="mt-6" />
      </div>
    </div>
  );
};

export default SetupGame;
