import React, { useEffect, useState } from "react";
import { getRaceTraitsAsync } from "./traitsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import ClassFeatsComp from "../classFeats/ClassFeatsComp";

interface TraitsProps {
  sheetID: number;
}

const TraitsComponent = ({ sheetID }: TraitsProps) => {
  const dispatch = useAppDispatch();
  const traits = useAppSelector((state: RootState) => state.raceTraits.features);
  const loading = useAppSelector((state: RootState) => state.raceTraits.loading);
  const [charName, setCharName] = useState<string | null>(null);

  // Extract `char_name` from localStorage
  useEffect(() => {
    const data = localStorage.getItem("SheetData");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setCharName(parsedData.data.char_name || null);
      } catch (error) {
        console.error("Failed to parse SheetData from localStorage:", error);
      }
    }
  }, []);

  // Fetch race traits using `sheetID`
  useEffect(() => {
    const fetchTraits = async () => {
      try {
        await dispatch(getRaceTraitsAsync(sheetID));
      } catch (error) {
        console.error("Error fetching traits:", error);
      }
    };
    fetchTraits();
  }, [dispatch, sheetID]);

  if (loading) {
    return <p>Loading traits...</p>;
  }

  // if (!traits || traits.length === 0) {
  //   return <p>No traits available.</p>;
  // }

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

      {/* Pass the extracted `charName` to ClassFeatsComp */}
      {charName && <ClassFeatsComp charName={charName} />}
    </div>
  );
};

export default TraitsComponent;
