import apiClient from '../../axiosInstance';
const SERVER = "https://dnd-backend-f57d.onrender.com/";



export function currencyCalc(
  amount: number,
  action: "add" | "subtract",
  race: number,
  id: number
) {
  const access = localStorage.getItem("Access"); // Get the access token from localStorage

  if (!access) {
    return Promise.reject("No access token found");
  }

  return apiClient.post(
    SERVER + "currencyCalc/",
    {
      amount, // The amount to add or subtract
      action, // The action (either "add" or "subtract")
      race, // race of the character to know what table to address
      id
    },
    {
      headers: {
        Authorization: `Bearer ${access}`, // Send the access token in the header
      },
    }
  );
}

export function getGold(race: number, id:number) {
  const access = localStorage.getItem("Access"); // Get the access token from localStorage

  if (!access) {
    return Promise.reject("No access token found");
  }

  return apiClient.get(SERVER + "getGold/", {
    params: { race, id },
    headers: {
      Authorization: `Bearer ${access}`, // Send the access token in the header
    },
  });
}


export function getMods(race: number, id:number) {
  const access = localStorage.getItem("Access"); // Get the access token from localStorage

  if (!access) {
    return Promise.reject("No access token found");
  }

  return apiClient.get(SERVER + "getMods/", {
    params: { race, id },
    headers: {
      Authorization: `Bearer ${access}`, // Send the access token in the header
    },
  });
}

export function rollDice(diceType: number, amount: number) {
  return apiClient.get(SERVER + 'diceRoll/', {
    params: {
      diceType: diceType,
      amount: amount
    }
  });
}

export function getSheetDataToken() {
  const SD = localStorage.getItem('SheetData');
  // console.log(SD)
  const access = localStorage.getItem('Access'); // Example auth access
  return apiClient.post(SERVER + 'SDT/', {
    sheet_data: SD
  }, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  });
}

export function updateSheetDataToken() {
  const oldSDT = localStorage.getItem('SDT')
  const SD = localStorage.getItem('SheetData');
  const access = localStorage.getItem('Access'); // Example auth access
  if (oldSDT) {
    return apiClient.post(SERVER + 'updateSDT/', {
      current_sheet_data: SD
    }, {
      headers: {
        Authorization: `Bearer ${access}`
      }
    }
  )
  }
}

export function LevelUp(race: number, id:number, charClass: number) {
  const access = localStorage.getItem("Access"); // Get the access token from localStorage

  if (!access) {
    return Promise.reject("No access token found");
  }
  return apiClient.post(SERVER + 'levelUp/', {
    id: id,
    race: race,
    charClass: charClass
  }, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  })
}