// CharacterClass.tsx
interface CharacterClassProps {
    charClass: number;
  }
  
  const CharacterClass = ({ charClass }: CharacterClassProps) => (
    <div>
      <strong>Character Class:</strong> {charClass}
    </div>
  );
  
  export default CharacterClass;
  