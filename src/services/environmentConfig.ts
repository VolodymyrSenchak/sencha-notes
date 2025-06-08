import { AppMode } from "../models";

export const ENVIRONMENT_CONFIG = {
  appMode: process.env.REACT_APP_MODE as AppMode,
}
