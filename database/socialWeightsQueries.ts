import db from './index';

export interface Weight {
    id: number;
    name: string;
    weight: number;
  }

export const getSocialWeights = async () => {
  const allRows: Weight[] = await db.getAllAsync('SELECT * FROM socialweights');
  return allRows;
};

export const addSocialWeight = async (name: string, weight: number) => {
  const result = await db.runAsync('INSERT INTO socialweights (name, weight) VALUES (?, ?)', name, weight);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editSocialWeight = async (name: string, weight: number) => {
  const result = await db.runAsync('UPDATE socialweights SET weight = ? WHERE name = ?', weight, name);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteSocialWeightById = async (id: number) => {
  const result = await db.runAsync('DELETE FROM socialweights WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteSocialWeightByName = async (name: string) => {
    const result = await db.runAsync('DELETE FROM socialweights WHERE name = ?', name);
    console.log(result.lastInsertRowId, result.changes);
    return result;
}
