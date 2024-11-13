import React from 'react';
import { useParams } from 'react-router-dom';
import InventoryComponent from '../src/features/inventory/Inventory';

const InventoryWrapper: React.FC = () => {
  const { sheetID } = useParams<{ sheetID: string }>();
  
  // Convert sheetID to a number if necessary and provIDe a race value
  const ID = Number(sheetID);
  const race = 1; // Set this to a default or retrieve it based on your application’s context

  return <InventoryComponent ID={ID} race={race} />;
};

export default InventoryWrapper;
