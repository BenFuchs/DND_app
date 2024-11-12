import React, { useEffect } from 'react';
import { RootState } from '../../app/store'; // Adjust imports to your store setup
import { getInventoryAsync } from '../inventory/inventorySlice'; // Adjust the path to your inventory slice
import { useAppDispatch, useAppSelector } from '../../app/hooks';

interface InventoryComponentProps {
  id: number;
  race: number;
}

const InventoryComponent: React.FC<InventoryComponentProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state: RootState) => state.inventory.items); // Assuming `items` holds the inventory data
  // const loading = useAppSelector((state: RootState) => state.inventory.loading);
  const error = useAppSelector((state: RootState) => state.inventory.error);

  useEffect(() => {
    dispatch(getInventoryAsync({ id }));
  }, [dispatch, id]);

  // if (loading) return <div>Loading inventory...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Inventory</h2>
      {inventory && inventory.length > 0 ? (
        <ul>
          {inventory.map((item: any, index: number) => (
            <li key={index}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your inventory is empty.</p>
      )}
    </div>
  );
};

export default InventoryComponent;
