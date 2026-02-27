import { useContext } from "react";
import { ThemeContext } from "./theme.store";

export function useTheme() {
  return useContext(ThemeContext);
}
