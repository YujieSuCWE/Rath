import type { SQLiteDatabase } from 'expo-sqlite';

export interface Weight {
    id: number;
    name: string;
    weight: number;
  }

export const getSocialWeights = async (db: SQLiteDatabase) => {
  const allRows: Weight[] = await db.getAllAsync('SELECT * FROM socialweights');
  return allRows;
};

export const addSocialWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('INSERT INTO socialweights (name, weight) VALUES (?, ?)', name, weight);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editSocialWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('UPDATE socialweights SET weight = ? WHERE name = ?', weight, name);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteSocialWeightById = async (db: SQLiteDatabase, id: number) => {
  const result = await db.runAsync('DELETE FROM socialweights WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteSocialWeightByName = async (db: SQLiteDatabase, name: string) => {
    const result = await db.runAsync('DELETE FROM socialweights WHERE name = ?', name);
    console.log(result.lastInsertRowId, result.changes);
    return result;
}
