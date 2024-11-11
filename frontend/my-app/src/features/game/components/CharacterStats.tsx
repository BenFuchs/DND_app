interface Stat {
  name: string;
  value: number;
}

interface CharacterStatsProps {
  stats: Stat[];
}

const CharacterStats = ({ stats }: CharacterStatsProps) => {
  // List of stat names (properly formatted)
  const statNames = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma"
  ];

  return (
    <div>
      <h3>Stats</h3>
      <ul>
        {statNames.map((statName, index) => {
          // For each stat name, find the corresponding value
          const statValue = stats.find(stat => stat.name === `stat_${statName}`)?.value || 0;

          return (
            <li key={statName}>
              {statName}: {statValue}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CharacterStats;
