import { IDBPDatabase, openDB } from "idb";

export function createDbFactory(
  dbName: string,
  ...storesNames: string[]
): Promise<IDBPDatabase<any>> {
  return openDB(dbName, 1, {
    upgrade(db) {
      for (const storeName of storesNames) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    },
  });
}

export class DbStoreTable<T> {
  constructor(
    private readonly tableName: string,
    private readonly dbPromise: Promise<IDBPDatabase<any>>
  ) {}

  async get(key: string): Promise<T> {
    return (await this.dbPromise).get(this.tableName, key);
  }

  async getAll(): Promise<T[]> {
    return (await this.dbPromise).getAll(this.tableName);
  }

  async insert(val: T): Promise<string> {
    const key = await (await this.dbPromise).add(this.tableName, val);
    return key as string;
  }

  async update(key: string, val: T): Promise<string> {
    await (await this.dbPromise).put(this.tableName, val);
    return key;
  }

  async delete(key: string): Promise<void> {
    return (await this.dbPromise).delete(this.tableName, key);
  }
}
