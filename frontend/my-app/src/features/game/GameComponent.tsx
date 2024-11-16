import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateGold, getGoldAsync, getModsAsync } from "../game/gameSlice";
import { RootState } from "../../app/store";
import { motion, AnimatePresence } from 'framer-motion';

import CharacterName from "../game/components/CharacterName";
import CharacterClass from "../game/components/CharacterClass";
import CharacterRace from "../game/components/CharacterRace";
import CharacterStats from "../game/components/CharacterStats";
import Skills from "../game/components/Skills";
import CurrencyCalculator from "../game/components/CurrencyCalculator";
import DiceRollsModal from "./components/DiceRollsModal";
import styles from "./styleSheets/gamecomponent.module.css";
import DiceRoll from "./components/DiceRoll";
import TraitsComponent from "../traits/TraitsComponent";

// TypeScript interface for sheet data
interface SheetData {
  id: number;
  char_name: string;
  char_class: number;
  char_gold: number;
  stat_Strength: number;
  stat_Dexterity: number;
  stat_Constitution: number;
  stat_Intelligence: number;
  stat_Wisdom: number;
  stat_Charisma: number;
  race: number;
}

// TypeScript interface for Mods
interface Mods {
  Mods: {
    stat_Dexterity: number;
    stat_Strength: number;
    stat_Intelligence: number;
    stat_Charisma: number;
    stat_Wisdom: number;
    stat_Constitution: number;
  };
}

// TypeScript type for skills
interface SkillMap {
  [key: string]: number;
}

const GameComponent = () => {
  //   const { sheetID } = useParams<{ sheetID: string }>();
  const dispatch = useAppDispatch();
  const { gold, loading, error } = useAppSelector(
    (state: RootState) => state.game
  );

  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [Mods, setMods] = useState<Mods | null>(null);
  const [modal, setmodal] = useState<boolean>(false);

  const open = () => {
    setmodal(true);
  };

  const closed = () => {
    setmodal(false);
  };

  useEffect(() => {
    const storedSheetData = localStorage.getItem("SheetData");
    if (storedSheetData) {
      const parsedData = JSON.parse(storedSheetData);
      setSheetData(parsedData.data);
    }
  }, []);

  useEffect(() => {
    if (sheetData) {
      const race = sheetData.race;
      const sheetID = sheetData.id;
      dispatch(getGoldAsync({ race, sheetID }));
      dispatch(getModsAsync({ race, sheetID }))
        .unwrap()
        .then((fetchedMods) => setMods(fetchedMods))
        .catch((error) => console.error("Error fetching mods:", error));
    }
  }, [sheetData, dispatch]);

  const handleAddGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
      try {
        await dispatch(
          updateGold({ amount, action: "add", race: sheetData.race })
        );
      } catch (err) {
        console.error("Error adding gold:", err);
      }
    }
  };

  const handleSubtractGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
      try {
        await dispatch(
          updateGold({ amount, action: "subtract", race: sheetData.race })
        );
      } catch (err) {
        console.error("Error subtracting gold:", err);
      }
    }
  };

  // Ensure calculateSkills always returns a valid SkillMap with numbers
  const calculateSkills = (): SkillMap => {
    if (!Mods) return {}; // Return empty object if Mods is unavailable

    return {
      Acrobatics: Mods.Mods.stat_Dexterity ?? 0,
      Athletics: Mods.Mods.stat_Strength ?? 0,
      Arcana: Mods.Mods.stat_Intelligence ?? 0,
      Deception: Mods.Mods.stat_Charisma ?? 0,
      Medicine: Mods.Mods.stat_Wisdom ?? 0,
      Persuasion: Mods.Mods.stat_Charisma ?? 0,
      Stealth: Mods.Mods.stat_Dexterity ?? 0,
      Insight: Mods.Mods.stat_Wisdom ?? 0,
      Intimidation: Mods.Mods.stat_Charisma ?? 0,
      Nature: Mods.Mods.stat_Intelligence ?? 0,
      Perception: Mods.Mods.stat_Wisdom ?? 0,
      Performance: Mods.Mods.stat_Charisma ?? 0,
      Religion: Mods.Mods.stat_Intelligence ?? 0,
      SleightOfHand: Mods.Mods.stat_Dexterity ?? 0,
      Survival: Mods.Mods.stat_Wisdom ?? 0,
    };
  };

  // Assign skills with the correct type
  const skills: SkillMap = Mods ? calculateSkills() : {};

  return (
    <div>
      <h1>Game Component</h1>
      {sheetData ? (
        <div>
          <CharacterName name={sheetData.char_name} />
          <CharacterClass charClass={sheetData.char_class} />
          <CharacterRace race={sheetData.race} />
          <p>
            <strong>Gold:</strong> {gold}
          </p>
          <CharacterStats
            stats={Object.entries(sheetData)
              .filter(([key]) => key.startsWith("stat"))
              .map(([key, value]) => ({ name: key, value }))}
          />
          {!Mods ? (
            <p>Loading skills...</p> // Fallback message while Mods is loading
          ) : (
            <Skills skills={skills} />
          )}
        </div>
      ) : (
        <p>Loading sheet data...</p>
      )}
      <CurrencyCalculator
        onAdd={handleAddGold}
        onSubtract={handleSubtractGold}
      />

      {sheetData ? (
        <div>
          {/* Existing components */}
          <TraitsComponent sheetID={sheetData.id} />
        </div>
      ) : (
        <p>Loading sheet data...</p>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (modal ? closed() : open())}
      >
        Open Dice tray
      </motion.button>

      <AnimatePresence>
        {modal && (
          <DiceRollsModal
            handleClose={closed}
            modal={modal}
            backdropClass={styles.backdrop} // Pass CSS class for backdrop
            modalClass={styles.modal} // Pass CSS class for modal
          >
            <DiceRoll />  {/* Render the DiceRoll component directly as a child */}
          </DiceRollsModal>
        )}
      </AnimatePresence>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default GameComponent;
