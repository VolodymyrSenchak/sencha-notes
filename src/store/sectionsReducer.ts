import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { Section } from "../models";
import { sectionsStorage } from "../storage/sectionsStorage";
import { RootState } from "./store";

// Define a type for the slice state
interface SectionsState {
  sections: Section[];
}

// Define the initial state using that type
const initialState: SectionsState = {
  sections: [],
};

export const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    addSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = [...state.sections, action.payload];
    },
    editSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = state.sections.map(s => s.id === action.payload.id ? action.payload : s);
    },
    deleteSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = state.sections.filter(
        (s) => s.id !== action.payload.id
      );
    },
    getSectionsSuccess: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
  },
});

export default sectionsSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectSections = (state: RootState) => state.sections.sections;

const { addSectionSuccess, deleteSectionSuccess, getSectionsSuccess, editSectionSuccess } =
  sectionsSlice.actions;

export const getSections = () => async (dispatch: Dispatch<PayloadAction<Section[]>>) => {
  const data = await sectionsStorage.getAll();
  dispatch(getSectionsSuccess(data));
}

export const addSection = (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
  await sectionsStorage.insert(section);
  dispatch(addSectionSuccess(section));
}

export const editSection = (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
  await sectionsStorage.update(section.id, section);
  dispatch(editSectionSuccess(section));
}

export const deleteSection = (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
  await sectionsStorage.delete(section.id);
  dispatch(deleteSectionSuccess(section));
}
