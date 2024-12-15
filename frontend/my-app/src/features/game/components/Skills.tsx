import React, { useState } from "react";

interface SkillsProps {
  skills: { [key: string]: number };
  proficiency: number;
}

const Skills = ({ skills, proficiency = 0 }: SkillsProps) => {
  const [selectedSkills, setSelectedSkills] = useState<{ [key: string]: boolean }>({});

  const toggleSkill = (key: string) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!skills || Object.keys(skills).length === 0) {
    return <p>No skills data available.</p>;
  }

  console.log("Proficiency Bonus:", proficiency); // Debugging

  return (
    <div>
      {Object.entries(skills).map(([key, value]) => {
        const isSelected = !!selectedSkills[key];
        const displayValue = isSelected ? value + proficiency : value;

        return (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
          >
            <input
              type="checkbox"
              id={`checkbox-${key}`}
              checked={isSelected}
              onChange={() => toggleSkill(key)}
              style={{ marginRight: "8px" }}
            />
            <label htmlFor={`checkbox-${key}`}>
              <strong>{key}:</strong> {displayValue}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Skills;
