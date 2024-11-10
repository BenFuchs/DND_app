import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getNum_of_sheetsAsync,
  selectNumSheets,
  selectSheetStatus,
  create_new_sheetAsync,
  rollStatsAsync,
  selectStats,
  deleteSheetAsync,
} from "../sheets/sheetsSlice";

// Define types for Sheets data
export interface Sheet {
  sheet_name: string;
  sheetID: number;
}

export interface SheetData {
  username: string;
  sheet_count: number;
  sheets: Sheet[];
}

const SheetsComp = () => {
  const dispatch = useAppDispatch();
  const numSheets = useAppSelector(selectNumSheets) as SheetData | null; // Type assertion here
  const status = useAppSelector(selectSheetStatus);
  const stats = useAppSelector(selectStats);

  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [characterName, setCharacterName] = useState<string>("");
  const [charClass, setCharClass] = useState<number | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("Access");
    if (access) {
      dispatch(getNum_of_sheetsAsync());
    }
  }, [dispatch]);

  const handleCreateSheet = () => {
    if (selectedRace !== null) {
      setShowForm(true);
    } else {
      alert("Please select a race first!");
    }
  };

  const handleCreateCharacterSheet = () => {
    if (characterName && charClass && selectedRace !== null) {
      dispatch(
        create_new_sheetAsync({
          characterName,
          charClass,
          race: selectedRace,
          stats,
        })
      );
    } else {
      alert("Please fill out all fields!");
    }
  };

  const handleRollStat = () => {
    console.log("stats:", stats);
    dispatch(rollStatsAsync());
  };

  const handleDeleteSheet = (sheetID: number) => {
    dispatch(deleteSheetAsync(sheetID))
      .then(() => {
        console.log("Deleted Sheet ID: ", sheetID)
        // After deletion, filter out the deleted sheet from the local state
        if (numSheets) {
          const updatedSheets = numSheets.sheets.filter(
            (sheet: Sheet) => sheet.sheetID !== sheetID
          );
          // Dispatch an action to update the state after deletion
          dispatch({ type: "UPDATE_SHEETS", payload: updatedSheets });
        }
      })
      .catch((error) => {
        console.error("Failed to delete sheet:", error);
        alert("Error deleting sheet.");
      });
  };

  const statNames = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error loading the number of sheets.</div>;
  }

  if (numSheets && typeof numSheets === "object") {
    const { username, sheet_count, sheets } = numSheets;

    return (
      <div>
        <h1>Username: {username}</h1>
        <h2>Number of Sheets: {sheet_count}</h2>

        {/* Display buttons for each character sheet */}
        <div>
          {sheets.map((sheet: Sheet, index: number) => (
            <ul key={index}>
              <button
                onClick={() => {
                  console.log(`Selected sheet: ${sheet.sheet_name}`)
                }
                }
              >
                {sheet.sheet_name || "Unnamed Character"}
              </button>
              {" -- "}
              <button onClick={() => handleDeleteSheet(sheet.sheetID)}>
                Delete character
              </button>
            </ul>
          ))}
        </div>

        {sheet_count < 3 && (
          <div>
            <div>
              <label>Select Race: </label>
              <select
                value={selectedRace ?? ""}
                onChange={(e) => setSelectedRace(Number(e.target.value))}
              >
                <option value="">Select a race</option>
                <option value={1}>Human</option>
                <option value={2}>Gnome</option>
                <option value={3}>Elf</option>
                <option value={4}>Halfling</option>
              </select>
            </div>
            <button onClick={handleCreateSheet}>
              Create new character sheet
            </button>

            {showForm && (
              <div>
                <div>
                  <label>Character Name: </label>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Enter character name"
                  />
                </div>

                <div>
                  <label>Class: </label>
                  <select
                    value={charClass ?? ""}
                    onChange={(e) => setCharClass(Number(e.target.value))}
                  >
                    <option value="">Select Class</option>
                    <option value={1}>Barbarian</option>
                    <option value={2}>Wizard</option>
                    <option value={3}>Cleric</option>
                    <option value={4}>Rogue</option>
                  </select>
                </div>

                <div>
                  <button onClick={handleRollStat}>Roll Stats</button>
                  <div>
                    {stats?.map((stat: number, index: number) => (
                      <div key={index}>
                        <label>{statNames[index]}: </label>
                        <input type="number" value={stat} readOnly />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleCreateCharacterSheet}>Submit</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>No sheets available or invalid data.</h1>
    </div>
  );
};

export default SheetsComp;
