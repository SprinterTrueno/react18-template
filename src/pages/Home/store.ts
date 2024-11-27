import { createContext } from "react";

export const Context = createContext(null);

export const reducer = (state, action) => {
  switch (action.type) {
    case "moduleTree":
      console.log("moduleTree", action.payload);
      return { ...state, moduleTree: action.payload };
    case "currentModule":
      return { ...state, currentModule: action.payload };
    case "setState":
      return action.payload;
    default:
      return state;
  }
};
