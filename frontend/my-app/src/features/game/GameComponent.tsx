import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateGold, getGoldAsync, getModsAsync } from "../game/gameSlice";
import { RootState } from "../../app/store";
import { motion, AnimatePresence } from "framer-motion";

import CharacterName from "../game/components/CharacterName";
import CharacterClass from "../game/components/CharacterClass";
import CharacterRace from "../game/components/CharacterRace";
import CharacterStats from "../game/components/CharacterStats";
import Skills from "../game/components/Skills";
import CurrencyCalculator from "../game/components/CurrencyCalculator";
import DiceRollsModal from "./components/DiceRollsModal";
import styles from "./styleSheets/gamecomponent.module.css";
import DiceRoll from "./components/DiceRoll";
import "./styleSheets/gamecomponent.module.css"
import CharacterGold from "./components/CharacterGold";
import CharacterHP from "./components/CharachterHp";
import CharacterLevel from "./components/CharacterLevel";

// TypeScript interfaces
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
  level: number;
  hitpoints: number;
}

interface Mods {
  Mods: {
    [key: string]: number;
  };
}

interface SkillMap {
  [key: string]: number;
}

const GameComponent = () => {
  const dispatch = useAppDispatch();
  const { gold, loading, error } = useAppSelector(
    (state: RootState) => state.game
    
  );

  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [Mods, setMods] = useState<Mods | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  // Toggles for modal
  const open = () => setModal(true);
  const close = () => setModal(false);

  useEffect(() => {
    const storedSheetData = localStorage.getItem("SheetData");
    if (storedSheetData) {
      const parsedData = JSON.parse(storedSheetData);
      setSheetData(parsedData.data);
    }
  }, []);
 
  useEffect(() => {
    if (sheetData) {
      const { race, id: sheetID } = sheetData;
      dispatch(getGoldAsync({ race, sheetID }));
      dispatch(getModsAsync({ race, sheetID }))
        .unwrap()
        .then(setMods)
        .catch((err) => console.error("Error fetching mods:", err));
    }
  }, [sheetData, dispatch]);

  const handleAddGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
        try {
            await dispatch(
                updateGold({ amount, action: "add", race: sheetData.race, id:sheetData.id })
            );
            // Fetch the updated gold
            dispatch(getGoldAsync({ race: sheetData.race, sheetID: sheetData.id }));
        } catch (err) {
            console.error("Error adding gold:", err);
        }
    }
};

  const handleSubtractGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
      try {
        await dispatch(
          updateGold({ amount, action: "subtract", race: sheetData.race, id:sheetData.id })
        );
        // Fetch the updated gold
        dispatch(getGoldAsync({ race: sheetData.race, sheetID: sheetData.id }));
      } catch (err) {
        console.error("Error subtracting gold:", err);
      }
    }
  };

  const calculateSkills = (): SkillMap => {
    if (!Mods) return {};
    return {
      Acrobatics: Mods.Mods.stat_Dexterity || 0,
      Athletics: Mods.Mods.stat_Strength || 0,
      Arcana: Mods.Mods.stat_Intelligence || 0,
      Deception: Mods.Mods.stat_Charisma || 0,
      Medicine: Mods.Mods.stat_Wisdom || 0,
      Persuasion: Mods.Mods.stat_Charisma || 0,
      Stealth: Mods.Mods.stat_Dexterity || 0,
      Insight: Mods.Mods.stat_Wisdom || 0,
      Intimidation: Mods.Mods.stat_Charisma || 0,
      Nature: Mods.Mods.stat_Intelligence || 0,
      Perception: Mods.Mods.stat_Wisdom || 0,
      Performance: Mods.Mods.stat_Charisma || 0,
      Religion: Mods.Mods.stat_Intelligence || 0,
      SleightOfHand: Mods.Mods.stat_Dexterity || 0,
      Survival: Mods.Mods.stat_Wisdom || 0,
    };
  };

  const skills: SkillMap = Mods ? calculateSkills() : {};

  const charClassString = (): string => {
    const classes = ["Unknown", "Barbarian", "Wizard", "Cleric", "Rogue"];
    return classes[sheetData?.char_class || 0];
  };

  const charRaceString = (): string => {
    const races = ["Unknown", "Human", "Gnome", "Elf", "Halfling"];
    return races[sheetData?.race || 0];
  };

  return (
    <div className={styles.container}>
    <div className={styles.firstColumn}>
      {sheetData ? (
        <>
          <CharacterName name={sheetData.char_name} />
          <CharacterClass charClass={charClassString()} />
          <CharacterRace race={charRaceString()} />
          <CharacterLevel level={sheetData.level} />
          <CharacterHP hitpoints={sheetData.hitpoints} />
          <CharacterGold gold={gold.gold} />
          <CharacterStats
            stats={Object.entries(sheetData)
              .filter(([key]) => key.startsWith("stat"))
              .map(([key, value]) => ({ name: key, value }))}
          />
        </>
      ) : (
        <p>Loading sheet data...</p>
      )}
    </div>

    <div className={styles.secondColumn}>
      {sheetData ? (
        !Mods ? (
          <p>Loading skills...</p>
        ) : (
          <Skills skills={skills} />
        )
      ) : (
        <p>Loading sheet data...</p>
      )}
    </div>

    <div className={styles.thirdColumn}>
      <CurrencyCalculator onAdd={handleAddGold} onSubtract={handleSubtractGold} />
      {/* {sheetData && <TraitsComponent sheetID={sheetData.id} />} */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (modal ? close() : open())}
      >
        Open Dice Tray
      </motion.button>
      <AnimatePresence>
        {modal && (
          <DiceRollsModal
            handleClose={close}
            modal={modal}
            backdropClass={styles.backdrop}
            modalClass={styles.modal}
          >
            <DiceRoll />
          </DiceRollsModal>
        )}
      </AnimatePresence>
    </div>

    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
  </div>
);
};

export default GameComponent;