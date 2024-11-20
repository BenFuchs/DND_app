import React from 'react';
import { useParams } from 'react-router-dom';
import InventoryComponent from './features/inventory/Inventory';

const InventoryWrapper: React.FC = () => {
  const { sheetID } = useParams<{ sheetID: string }>();
  
  // Convert sheetID to a number if necessary and provIDe a race value
  const ID = Number(sheetID);


  return <InventoryComponent ID={ID}  />;
};

export default InventoryWrapper;
