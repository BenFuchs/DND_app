import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  updateGold,
  getGoldAsync,
  getModsAsync,
  getSheetDataTokenAsync,
  levelUpAsync,
} from "./gameSlice";
import { RootState } from "../../app/store";
import { motion, AnimatePresence } from "framer-motion";
import CharacterName from "./components/CharacterName";
import CharacterClass from "./components/CharacterClass";
import CharacterRace from "./components/CharacterRace";
import CharacterStats from "./components/CharacterStats";
import Skills from "./components/Skills";
import CurrencyCalculator from "./components/CurrencyCalculator";
import DiceRoll from "./components/DiceRoll";
import styles from "../../StyleSheets/gamecomponent.module.css";
import CharacterGold from "./components/CharacterGold";
import CharacterHP from "./components/CharachterHp";
import CharacterLevel from "./components/CharacterLevel";
import { PayloadAction } from "@reduxjs/toolkit";
import DiceRollsModal from "./components/DiceRollsModal";
import { ToastContainer, toast } from "react-toastify";
import LoadingIcon from "../hashLoading/loadingIcon";
import { Button } from "@mui/material";

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
  proficiency: number;
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
  const [proficiencyBonus, setproficiencyBonus] = useState<number>(2);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currencyAmount, setcurrencyAmount] = useState<number>(0);

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

      // Fetch gold and mods
      dispatch(getGoldAsync({ race, sheetID }));
      dispatch(getModsAsync({ race, sheetID }))
        .unwrap()
        .then(setMods)
        .catch((err) => console.error("Error fetching mods:", err));

      // Get and store the token using the async thunk
      dispatch(getSheetDataTokenAsync())
        .unwrap()
        .then((data) => {
          const { token } = data;
          if (token) {
            localStorage.setItem("SDT", token); // Save the token to localStorage
          }
        })
        .catch((err) => console.error("Error fetching sheet data token:", err));
    }
  }, [sheetData, dispatch]);

  const reloadSheetData = () => {
    const storedSheetData = localStorage.getItem("SheetData");
    if (storedSheetData) {
      const parsedData = JSON.parse(storedSheetData);
      setSheetData(parsedData.data); // Update sheetData with the latest from localStorage
    }
  };

  useEffect(() => {
    if (sheetData) {
      const newProficiencyBonus = getProficiencyBonus(sheetData.level);
      setproficiencyBonus(newProficiencyBonus); // Update the state
      // console.log("Proficiency Bonus Updated:", newProficiencyBonus);
    }
  }, [sheetData]);

  const getProficiencyBonus = (level: number): number => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2; // Default for levels 1-4
  };

  const handleLevelUp = async () => {
    try {
      if (sheetData) {
        // Dispatch the level-up action and explicitly cast the result
        const level_up_data = (await dispatch(
          levelUpAsync({
            race: sheetData.race,
            id: sheetData.id,
            charClass: sheetData.char_class,
          })
        )) as PayloadAction<{ NewLevel: number; Newhitpoints: number }>;

        // Access the payload correctly after casting
        const { NewLevel, Newhitpoints } = level_up_data.payload;

        // Update the sheetData state directly
        setSheetData((prevSheetData) => {
          if (!prevSheetData) return prevSheetData;
          return {
            ...prevSheetData,
            level: NewLevel,
            hitpoints: Newhitpoints,
          };
        });

        console.log("new level: ", NewLevel);
        console.log("new hitpoints: ", Newhitpoints);

        // After updating the state, save it to localStorage
        localStorage.setItem(
          "SheetData",
          JSON.stringify({
            data: { ...sheetData, level: NewLevel, hitpoints: Newhitpoints },
          })
        );

        // Reload the sheet data to ensure the front-end updates
        reloadSheetData();
      }
    } catch (error) {
      console.error("Error leveling up:", error);
    }
  };
  // console.log(sheetData?.level)

  const handleAddGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
      try {
        await dispatch(
          updateGold({
            amount,
            action: "add",
            race: sheetData.race,
            id: sheetData.id,
          })
        );
        dispatch(getGoldAsync({ race: sheetData.race, sheetID: sheetData.id }));
        setcurrencyAmount(0);
      } catch (err) {
        console.error("Error adding gold:", err);
      }
    }
  };

  const handleSubtractGold = async (amount: number) => {
    if (sheetData && !isNaN(amount) && amount > 0) {
      if (amount > gold.gold) {
        toast.error("Not enough gold for this action");
        setcurrencyAmount(0);
        return;
      }
      try {
        await dispatch(
          updateGold({
            amount,
            action: "subtract",
            race: sheetData.race,
            id: sheetData.id,
          })
        );
        dispatch(getGoldAsync({ race: sheetData.race, sheetID: sheetData.id }));
        setcurrencyAmount(0);
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
      AnimalHandling: Mods.Mods.stat_Wisdom || 0,
      Deception: Mods.Mods.stat_Charisma || 0,
      Medicine: Mods.Mods.stat_Wisdom || 0,
      Persuasion: Mods.Mods.stat_Charisma || 0,
      Stealth: Mods.Mods.stat_Dexterity || 0,
      History: Mods.Mods.stat_Intelligence || 0,
      Insight: Mods.Mods.stat_Wisdom || 0,
      Intimidation: Mods.Mods.stat_Charisma || 0,
      Investigation: Mods.Mods.stat_Intelligence || 0,
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
      <ToastContainer />
      <LoadingIcon loading={loading} /> {/* Display the loader when loading */}
      <div className={styles.firstColumn}>
        {sheetData ? (
          <>
            <CharacterName name={sheetData.char_name} />
            <CharacterClass charClass={charClassString()} />
            <CharacterRace race={charRaceString()} />
            <CharacterLevel
              level={sheetData.level}
              id={sheetData.id}
              race={sheetData.race}
              charClass={sheetData.char_class}
              handleLevelUp={handleLevelUp}
            />
            <CharacterHP
              hitpoints={sheetData.hitpoints}
              CharClass={sheetData.char_class}
            />
            <CharacterGold gold={gold.gold} />
            <CharacterStats
              stats={Object.entries(sheetData)
                .filter(([key]) => key.startsWith("stat"))
                .map(([key, value]) => ({ name: key, value }))}
            />
          </>
        ) : (
          <LoadingIcon loading={loading} />
        )}
      </div>
      <div className={styles.secondColumn}>
        {sheetData ? (
          !Mods || Object.keys(Mods.Mods).length === 0 ? (
            <LoadingIcon loading={true} />
          ) : (
            <div>
              <label>Proficiency Bonus:</label> {proficiencyBonus}
              <Skills skills={skills} proficiency={proficiencyBonus} />
            </div>
          )
        ) : (
          <p>Loading sheet data...</p>
        )}
      </div>
      <div className={styles.thirdColumn}>
        <CurrencyCalculator
          onAdd={handleAddGold}
          onSubtract={handleSubtractGold}
          setCurrencyAmount={setcurrencyAmount}
        />
        <br/>
        <motion.div>
          <Button 
            variant="contained"
            component={motion.button}
            onClick={() => (modal ? close() : open())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Open Dice Tray
          </Button>
        </motion.div>

        <AnimatePresence>
          {modal && (
            <DiceRollsModal
              handleClose={close}
              modal={modal}
            >
              <DiceRoll />
            </DiceRollsModal>
          )}
        </AnimatePresence>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default GameComponent;
