import type { SQLiteDatabase } from 'expo-sqlite';

export interface personWeight {
    id: number;
    name: string;
    weight: number;
  }

export const getPersonWeights = async (db: SQLiteDatabase) => {
  const allRows: personWeight[] = await db.getAllAsync('SELECT * FROM personweights');
  return allRows; 
};

export const addPersonWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('INSERT INTO personweights (name, weight) VALUES (?, ?)', name, weight);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editPersonWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('UPDATE personweights SET weight = ? WHERE name = ?', weight, name);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deletePersonWeightById = async (db: SQLiteDatabase, id: number) => {
  const result = await db.runAsync('DELETE FROM personweights WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deletePersonWeightByName = async (db: SQLiteDatabase, name: string) => {
    const result = await db.runAsync('DELETE FROM personweights WHERE name = ?', name);
    console.log(result.lastInsertRowId, result.changes);
    return result;
}
