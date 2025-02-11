// CharacterRace.tsx
interface CharacterRaceProps {
    race: string;
  }
  
  const CharacterRace = ({ race }: CharacterRaceProps) => (
    <div>
      <strong>Character Race:</strong> {race}
    </div>
  );
  
  export default CharacterRace;
  