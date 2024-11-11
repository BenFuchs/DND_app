// CharacterRace.tsx
interface CharacterRaceProps {
    race: number;
  }
  
  const CharacterRace = ({ race }: CharacterRaceProps) => (
    <div>
      <strong>Character Race:</strong> {race}
    </div>
  );
  
  export default CharacterRace;
  