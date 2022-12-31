import { Section } from "../models";
import { createDbFactory, DbStoreTable } from "./dbStorage";

const sectionsStoreName = "sections";

const dbPromise = createDbFactory("notesDB", sectionsStoreName);

export const sectionsStorage = new DbStoreTable<Section>(sectionsStoreName, dbPromise);
