import db from './index';

export interface Decision {
    id: number;
    content: string;
    created_at: number;
  }

export const getDecisions = async () => {
  const allRows: Decision[] = await db.getAllAsync('SELECT * FROM decisions');
  return allRows;
};

export const addDecision = async (content: string) => {
  const result = await db.runAsync('INSERT INTO decisions (content) VALUES (?)', content);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editDecision = async (content: string, id: number) => {
  const result = await db.runAsync('UPDATE rules SET decisions = ? WHERE id = ?', content, id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteDecision = async (id: number) => {
  const result = await db.runAsync('DELETE FROM decisions WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}
