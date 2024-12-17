import styles from '../../../StyleSheets/gamecomponent.module.css'

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
      <button onClick={handleLevelUp} className={styles.button}>Level up!</button>
    </div>
  );
};

export default CharacterLevel;
