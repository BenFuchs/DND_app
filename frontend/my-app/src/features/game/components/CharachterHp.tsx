import React from 'react'

interface CharacterHPProps {
    hitpoints: number;
}

const CharacterHP = ({ hitpoints }: CharacterHPProps) => {
  return (
    <div>
        <strong>HP:</strong> {hitpoints}
    </div>
  )
}

export default CharacterHP