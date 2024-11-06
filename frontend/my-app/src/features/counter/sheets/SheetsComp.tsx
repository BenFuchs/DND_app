import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks'; // Adjust path based on your folder structure
import { getNum_of_sheetsAsync, selectNumSheets, selectSheetStatus, createNewSheet_Aysnc } from '../sheets/sheetsSlice';

const SheetsComp = () => {
  const dispatch = useAppDispatch();
  const numSheets = useAppSelector(selectNumSheets); // This contains the full response object
  const status = useAppSelector(selectSheetStatus);

  useEffect(() => {
    const access = localStorage.getItem('Access');
    if(access) {
      dispatch(getNum_of_sheetsAsync());
    }
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading the number of sheets.</div>;
  }

  if (numSheets && typeof numSheets === 'object') {
    // Destructure the response object if it's an object
    const { username, sheet_count } = numSheets;

    if (sheet_count < 3) {
      return (
        <div>
          <h1>Username: {username}</h1>
          <h2>Number of Sheets: {sheet_count}</h2>
          {/* button should get username save it locally (from token maybe?) and proceed to race selection */}
          <button onClick={()=>{createNewSheet_Aysnc()}}>Create new sheet</button> 
        </div>
      )
    }

    return (
      <div>
        <h1>Username: {username}</h1>
        <h2>Number of Sheets: {sheet_count}</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Number of Sheets: {numSheets}</h1>
    </div>
  );
};

export default SheetsComp;
