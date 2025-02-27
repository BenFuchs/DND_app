// actions/inventoryActions.ts

import apiClient from "../../axiosInstance";

const SERVER = "http://127.0.0.1:8000/"

export const getInventory = (id: number) => {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject("No access token found");
  } // Get the access token from localStorage

  return apiClient.get(SERVER + "getInventory/", {
    params: { id },
    headers: {
      Authorization: `Bearer ${access}`, // Send the access token in the header
    },
  });
};

export const searchItems = (query: string) => {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject("No access token found");
  } // Get the access token from localStorage

  return apiClient(SERVER + "searchItems/", {
    params: { query },
    headers: {
      Authorization: `Bearer ${access}`, // Send the access token in the header
    },
  });
};

export const addItemToInventory = (itemID: number, id: number) => {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject("No access token found");
  }

  return apiClient.post(
    SERVER + "addToInventory/",
    {
      itemID,
      id,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};

export const removeItemFromInventory = (itemID: number, id: number) => {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject("No access token found");
  }

  return apiClient.post(
    SERVER + "removeItem/",
    {
      itemID,
      id,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};

export const getItemData = (itemID: number) => {
    const access = localStorage.getItem("Access");
    if (!access) {
      return Promise.reject("No access token found");
    }

    return apiClient.post(
        SERVER + "itemData/" ,
        { itemID },
        {
            headers: {
              Authorization: `Bearer ${access}`,
            },
        }
    );
};