import { openDB } from "idb";
import { Section } from "../models";

const sectionsStore = "sections";

const dbPromise = openDB("notesDB", 1, {
  upgrade(db) {
    db.createObjectStore(sectionsStore, { keyPath: "id" });
  },
});

export const sectionsStorage = {
  get: get<Section>(sectionsStore),
  getAll: getAll<Section>(sectionsStore),
  insert: insert<Section>(sectionsStore),
  update: update<Section>(sectionsStore),
  delete: del(sectionsStore)
};

function get<T>(storage: string): (key: string) => Promise<T> {
  return async (key: string) => (await dbPromise).get(storage, key);
}

function getAll<T>(storage: string): () => Promise<T[]> {
  return async () => (await dbPromise).getAll(storage);
}

function insert<T>(storage: string): (val: T) => Promise<string> {
  return async (val: T) => {
    const key = await (await dbPromise).add(storage, val);
    return key as string;
  };
}

function update<T>(storage: string): (key: string, val: T) => Promise<string> {
  return async (key: string, val: T) => {
    await (await dbPromise).put(storage, val);
    return key;
  }
}

function del(storage: string): (key: string) => Promise<void> {
  return async (key: string) => (await dbPromise).delete(storage, key);
}

