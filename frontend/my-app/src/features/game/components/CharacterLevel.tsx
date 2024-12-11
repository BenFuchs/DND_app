import { useState } from "react";
import { levelUpAsync } from "../gameSlice";
import { useAppDispatch } from "../../../app/hooks";

interface CharacterLevelProps {
  level: number;
  id: number;
  race: number;
  charClass: number;
}

const CharacterLevel = ({ level, id, race, charClass }: CharacterLevelProps) => {
  const dispatch = useAppDispatch();
  const [currentLevel, setCurrentLevel] = useState<number>(level);

  const handleLevelUp = async () => {
    const newLevel = currentLevel + 1;
    setCurrentLevel(newLevel); // Update local state
    console.log("New level is:", newLevel);

    try {
      await dispatch(levelUpAsync({ race, id, charClass}));
    } catch (error) {
      console.error("Error leveling up:", error);
      setCurrentLevel(currentLevel); // Revert local state if dispatch fails
    }
  };

  return (
    <div>
      <strong>Level:</strong> {currentLevel}{" "}
      <button onClick={handleLevelUp}>Level up!</button>
    </div>
  );
};

export default CharacterLevel;