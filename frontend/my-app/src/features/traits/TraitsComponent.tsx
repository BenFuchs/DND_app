import React, { useEffect } from "react";
import { getRaceTraitsAsync } from "./traitsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

interface TraitsProps {
  sheetID: number;
}

const TraitsComponent = ({ sheetID }: TraitsProps) => {
  const dispatch = useAppDispatch();
  const traits = useAppSelector((state: RootState) => state.traits.features);
  const loading = useAppSelector((state: RootState) => state.traits.loading);

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await dispatch(getRaceTraitsAsync(sheetID)); 
        // console.log("Resolved traits:", response); // Log resolved traits
      } catch (error) {
        // console.error("Error fetching traits:", error);
      }
    };
    fetchTraits();
  }, [dispatch, sheetID]);

//   console.log("Traits in state:", traits);

  if (loading) {
    return <p>Loading traits...</p>;
  }

  if (!traits || traits.length === 0) {
    return <p>No traits available.</p>;
  }

  return (
    <div>
      <h1>Traits</h1>
      <ul>
        {traits.map((trait, index) => (
          <li key={index}>
            <strong>{trait.name}:</strong> {trait.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TraitsComponent;
