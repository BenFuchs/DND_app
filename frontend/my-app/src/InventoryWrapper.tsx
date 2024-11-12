import React from 'react';
import { useParams } from 'react-router-dom';
import InventoryComponent from '../src/features/inventory/Inventory';

const InventoryWrapper: React.FC = () => {
  const { sheetID } = useParams<{ sheetID: string }>();
  
  // Convert sheetID to a number if necessary and provide a race value
  const id = Number(sheetID);
  const race = 1; // Set this to a default or retrieve it based on your application’s context

  return <InventoryComponent id={id} race={race} />;
};

export default InventoryWrapper;
