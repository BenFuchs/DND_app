import React from "react";
import { useParams } from "react-router-dom";
import TraitsComponent from "./features/traits/TraitsComponent";

const TraitsWrapper = () => {
  const { sheetID } = useParams<{ sheetID: string }>();

  if (!sheetID || isNaN(Number(sheetID))) {
    return <p>Error: Invalid sheet ID provided!</p>;
  }

  return <TraitsComponent sheetID={parseInt(sheetID, 10)} />;
};

export default TraitsWrapper;