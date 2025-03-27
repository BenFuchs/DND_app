import { Button } from '@mui/material';

interface CharacterLevelProps {
  level: number;
  id: number;
  race: number;
  charClass: number;
  handleLevelUp: () => void; // Add handleLevelUp as a prop
}

const CharacterLevel = ({ level, id, race, charClass, handleLevelUp }: CharacterLevelProps) => {
  return (
    <div>
      <strong>Level:</strong> {level}{" "}
      <Button variant='contained' onClick={handleLevelUp}>Level up!</Button>
    </div>
  );
};

export default CharacterLevel;
