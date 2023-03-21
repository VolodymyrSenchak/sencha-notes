export interface Theme {
  name: string;
  class: string;
  primaryColor: string;
  mode: "dark" | "light";
}

export const DEFAULT_THEME = "Light Blue";

export const APP_THEMES: Theme[] = [
  {
    name: "Light Blue",
    class: "light-blue",
    primaryColor: "#6096B4",
    mode: "light",
  },
  {
    name: "Light Green",
    class: "light-green",
    primaryColor: "#609966",
    mode: "light",
  },
  {
    name: "Light Brown",
    class: "light-brown",
    primaryColor: "#576F72",
    mode: "light",
  },
  {
    name: "Dark Brown",
    class: "dark-brown",
    primaryColor: "#A27B5C",
    mode: "dark",
  },
  {
    name: "Dark Green",
    class: "dark-green",
    primaryColor: "#7DB9B6",
    mode: "dark"
  }
];
