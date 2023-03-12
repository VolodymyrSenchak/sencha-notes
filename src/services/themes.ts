export interface Theme {
  name: string;
  class: string;
  primaryColor: string;
}

export const DEFAULT_THEME = "Light Blue";

export const APP_THEMES: Theme[] = [
  {
    name: "Light Blue",
    class: "light-blue",
    primaryColor: "#6096B4"
  },
  {
    name: "Light Green",
    class: "light-green",
    primaryColor: "#609966"
  },
];
