import db from './index';

export interface Rule {
    id: number;
    content: string;
    created_at: number;
    updated_at: number;
  }

export const getRules = async () => {
  const allRows: Rule[] = await db.getAllAsync('SELECT * FROM rules');
  return allRows;
};

export const addRule = async (content: string) => {
  const result = await db.runAsync('INSERT INTO rules (content) VALUES (?)', content);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editRule = async (content: string, id: number) => {
  const result = await db.runAsync('UPDATE rules SET content = ? WHERE id = ?', content, id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteRule = async (id: number) => {
  const result = await db.runAsync('DELETE FROM rules WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}
