import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define a type for the slice state
interface SectionsState {
  sections: Section[];
}

interface Section {
  name: string;
}

// Define the initial state using that type
const initialState: SectionsState = {
  sections: [],
};

export const sectionsSlice = createSlice({
  name: "sections",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<Section>) => {
      state.sections = [...state.sections, action.payload];
    },
    deleteSection: (state, action: PayloadAction<Section>) => {
      state.sections = state.sections.filter(
        (s) => s.name !== action.payload.name
      );
    },
    getSectionsSuccess: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
  },
});

export const { addSection, deleteSection, getSectionsSuccess } =
  sectionsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSections = (state: RootState) => state.sections.sections;

export default sectionsSlice.reducer;

export const fetchSections =
  () => async (dispatch: Dispatch<PayloadAction<Section[]>>) => {
    try {
      setTimeout(() => {
        dispatch(getSectionsSuccess([{ name: "volo" }]));
      });
    } catch (e) {}
  };
