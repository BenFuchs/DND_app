
import { useEffect, useState } from "react";

interface SkillsProps {
  skills: { [key: string]: number };
  proficiency: number;
}

const Skills = ({ skills, proficiency = 0 }: SkillsProps) => {
  const [selectedSkills, setSelectedSkills] = useState<{ [key: string]: boolean }>({});

useEffect(() => {
  const SDT_selected_skills = localStorage.getItem('TempDataSelectedProficiency');
  if (SDT_selected_skills) {
    try {
      const parsedSkills: string[] = JSON.parse(SDT_selected_skills);
      const restoredState: { [key: string]: boolean } = {};

      parsedSkills.forEach((skill) => {
        restoredState[skill] = true;
      });

      setSelectedSkills(restoredState);
    } catch (err) {
      console.error("Failed to parse stored proficiencies:", err);
    }
  }
}, []);


const toggleSkill = (key: string) => {
  setSelectedSkills((prev) => {
    const updated = {
      ...prev,
      [key]: !prev[key],
    };

    const selectedProficiency = Object.keys(updated).filter((k) => updated[k]);
    // console.log("Selected skill keys:", selectedProficiency);
    localStorage.setItem('TempDataSelectedProficiency', JSON.stringify(selectedProficiency))
    return updated;
  });
};

  if (!skills || Object.keys(skills).length === 0) {
    return <p>No skills data available.</p>;
  }


  
  // console.log("Proficiency Bonus:", proficiency); // Debugging
// console.log(Object.keys(skills)[0]); // logs the first skill name, e.g., 'Acrobatics'

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
              {key}: {displayValue}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Skills;
