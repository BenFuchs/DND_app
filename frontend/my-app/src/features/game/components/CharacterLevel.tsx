import React from 'react'

interface CharacterLevelProps {
    level: number;
}

const CharacterLevel = ({ level }: CharacterLevelProps) => {
  return (
    <div>
        <strong>Level:</strong> {level}
    </div>
  )
}

export default CharacterLevel