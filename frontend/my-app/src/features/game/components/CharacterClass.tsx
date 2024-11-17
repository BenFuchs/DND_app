// CharacterClass.tsx
interface CharacterClassProps {
    charClass: string;
  }

  const CharacterClass = ({ charClass }: CharacterClassProps) => (

    <div>
      <strong>Character Class:</strong> {charClass}
    </div>
  );
  
  export default CharacterClass;
  