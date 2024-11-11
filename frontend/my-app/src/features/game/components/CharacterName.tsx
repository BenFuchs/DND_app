// CharacterName.tsx
interface CharacterNameProps {
    name: string;
  }
  
  const CharacterName = ({ name }: CharacterNameProps) => (
    <div>
      <strong>Character Name:</strong> {name}
    </div>
  );
  
  export default CharacterName;
  