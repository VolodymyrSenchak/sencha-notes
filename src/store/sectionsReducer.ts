import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { Section } from "../models";
import { sectionsStorage } from "../storage/sectionsStorage";
import { RootState } from "./store";

// Define a type for the slice state
interface SectionsState {
  sections: Section[];
  isSectionsLoading: boolean;
}

// Define the initial state using that type
const initialState: SectionsState = {
  sections: [],
  isSectionsLoading: false,
};

export const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    addSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = [...state.sections, action.payload];
    },
    editSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = state.sections.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
    },
    deleteSectionSuccess: (state, action: PayloadAction<Section>) => {
      state.sections = state.sections.filter((s) => s.id !== action.payload.id);
    },
    getSectionsSuccess: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
    changeSectionsLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSectionsLoading = action.payload;
    },
  },
});

export default sectionsSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectSections = (state: RootState) => state.sections.sections;
export const selectIsSectionsLoading = (state: RootState) => state.sections.isSectionsLoading;

const {
  addSectionSuccess,
  deleteSectionSuccess,
  getSectionsSuccess,
  editSectionSuccess,
  changeSectionsLoadingStatus,
} = sectionsSlice.actions;

export const initSections =
  () => async (dispatch: Dispatch<PayloadAction<Section[]>>) => {
    dispatch(changeSectionsLoadingStatus(true) as any);
    const data = await sectionsStorage.getAll();
    dispatch(getSectionsSuccess(data));
    dispatch(changeSectionsLoadingStatus(false) as any);
  };

export const addSection =
  (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
    await sectionsStorage.insert(section);
    dispatch(addSectionSuccess(section));
  };

export const editSection =
  (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
    await sectionsStorage.update(section.id, section);
    dispatch(editSectionSuccess(section));
  };

export const deleteSection =
  (section: Section) => async (dispatch: Dispatch<PayloadAction<Section>>) => {
    await sectionsStorage.delete(section.id);
    dispatch(deleteSectionSuccess(section));
  };
