import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getNum_of_sheetsAsync,
  selectNumSheets,
  selectSheetStatus,
  create_new_sheetAsync,
  rollStatsAsync,
  selectStats,
  deleteSheetAsync,
  getSheetDataAsync,
} from "../sheets/sheetsSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../../StyleSheets/gamecomponent.module.css'


// Define types for Sheets data
export interface Sheet {
  sheet_name: string;
  sheetID: number;
}

export interface SheetData {
  username: string;
  sheet_count: number;
  max_sheets: number;
  sheets: Sheet[];
}

const SheetsComp = () => {
  const dispatch = useAppDispatch();
  const numSheets = useAppSelector(selectNumSheets) as SheetData | null; // Type assertion here
  const status = useAppSelector(selectSheetStatus);
  const stats = useAppSelector(selectStats);
  const navigate = useNavigate();

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
      toast.error("Please select a race first!");
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
      window.location.reload();
    } else {
      toast.error("Please fill out all fields!");
    }
  };

  const handleRollStat = () => {
    console.log("stats:", stats);
    dispatch(rollStatsAsync());
  };

  const handleGetSheetData = (sheetID: number) => {
    dispatch(getSheetDataAsync(sheetID))
      .then((result) => {
        if (result.payload) {
          // Store the fetched sheet data in local storage
          localStorage.setItem("SheetData", JSON.stringify(result.payload));

          // Navigate to the GameComponent with the selected sheetID
          navigate(`/game/${sheetID}`);
        } else {
          console.error("No sheet data returned.");
        }
      })
      .catch((error) => console.error("Error fetching sheet data:", error));
  };

  const handleDeleteSheet = (sheetID: number) => {
    dispatch(deleteSheetAsync(sheetID))
      .then(() => {
        console.log("Deleted Sheet ID: ", sheetID);
        if (numSheets) {
          const updatedSheets = numSheets.sheets.filter(
            (sheet: Sheet) => sheet.sheetID !== sheetID
          );
          dispatch({ type: "UPDATE_SHEETS", payload: updatedSheets });
        }
        toast.success("Character sheet deleted successfully!");
        window.location.reload()
      })
      .catch((error) => {
        console.error("Failed to delete sheet:", error);
        toast.error("Error deleting sheet.");
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
    const { username, sheet_count, sheets, max_sheets } = numSheets;

    return (
      <div>
        <h1>Username: {username}</h1>
        <h2>Number of Sheets: {sheet_count}</h2>
        {Array.isArray(sheets) &&
          sheets.map((sheet: Sheet, index: number) => (
            <ul key={index}>
              <button className={styles.button}
                onClick={() => {
                  console.log(
                    `Selected sheet: ${sheet.sheet_name || "Unnamed Character"}`
                  );
                  handleGetSheetData(sheet.sheetID);
                }}
              >
                {sheet.sheet_name || "Unnamed Character"}
              </button>
              {" -- "}
              <button onClick={() => handleDeleteSheet(sheet.sheetID)} className={styles.button}>
                Delete character
              </button>
            </ul>
          ))}
        <Outlet />
        {sheet_count < max_sheets && (
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