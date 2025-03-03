import db from './index';

export interface Weight {
    id: number;
    name: string;
    weight: number;
  }

export const getPersonWeights = async () => {
  const allRows: Weight[] = await db.getAllAsync('SELECT * FROM personweights');
  return allRows;
};

export const addPersonWeight = async (name: string, weight: number) => {
  const result = await db.runAsync('INSERT INTO personweights (name, weight) VALUES (?, ?)', name, weight);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editPersonWeight = async (name: string, weight: number) => {
  const result = await db.runAsync('UPDATE personweights SET weight = ? WHERE name = ?', weight, name);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deletePersonWeightById = async (id: number) => {
  const result = await db.runAsync('DELETE FROM personweights WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deletePersonWeightByName = async (name: string) => {
    const result = await db.runAsync('DELETE FROM personweights WHERE name = ?', name);
    console.log(result.lastInsertRowId, result.changes);
    return result;
}
