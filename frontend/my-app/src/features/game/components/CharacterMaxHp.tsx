
interface CharacterHPProps {
  CharClass: number;
  hitpoints: number;
}

const CharacterMaxHP = ({ hitpoints, CharClass }: CharacterHPProps) => {
  return (
    <div>
        <strong>HP:</strong> {hitpoints}
    </div>
  )
}

export default CharacterMaxHP