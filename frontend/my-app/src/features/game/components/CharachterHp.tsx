
interface CharacterHPProps {
  CharClass: number;
  hitpoints: number;
}

const CharacterHP = ({ hitpoints, CharClass }: CharacterHPProps) => {
  return (
    <div>
        <strong>HP:</strong> {hitpoints}
    </div>
  )
}

export default CharacterHP