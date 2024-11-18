import React from 'react'

interface CharacterGoldProps {
    gold: number;
}

const CharacterGold = ({ gold }: CharacterGoldProps) => {
  return (
    <div>
        <strong>Gold:</strong> {gold}
    </div>
  )
}

export default CharacterGold