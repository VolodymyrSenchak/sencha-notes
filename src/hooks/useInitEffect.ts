import { useEffect } from "react";

export const useInitEffect = (callback: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
};