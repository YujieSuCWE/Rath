import type { SQLiteDatabase } from 'expo-sqlite';

export interface groupWeight {
    id: number;
    name: string;
    weight: number;
  }

export const getGroupWeights = async (db: SQLiteDatabase) => {
  const allRows: groupWeight[] = await db.getAllAsync('SELECT * FROM groupweights');
  return allRows;
};

export const addGroupWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('INSERT INTO groupweights (name, weight) VALUES (?, ?)', name, weight);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editGroupWeight = async (db: SQLiteDatabase, name: string, weight: number) => {
  const result = await db.runAsync('UPDATE groupweights SET weight = ? WHERE name = ?', weight, name);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteGroupWeightById = async (db: SQLiteDatabase, id: number) => {
  const result = await db.runAsync('DELETE FROM groupweights WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteGroupWeightByName = async (db: SQLiteDatabase, name: string) => {
    const result = await db.runAsync('DELETE FROM groupweights WHERE name = ?', name);
    console.log(result.lastInsertRowId, result.changes);
    return result;
}
