// Skills.tsx
interface SkillsProps {
    skills: { [key: string]: number };
  }
  
  const Skills = ({ skills }: SkillsProps) => {
    if (!skills || Object.keys(skills).length === 0) {
      return <p>No skills data available.</p>;
    }
  
    return (
      <div>
        {Object.entries(skills).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value !== undefined ? value : "No value"}
          </p>
        ))}
      </div>
    );
  };
  export default Skills;
  