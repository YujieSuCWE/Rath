import type { SQLiteDatabase } from 'expo-sqlite';

export interface Rule {
    id: number;
    category: string;
    content: string;
    created_at: number;
    updated_at: number;
  }


export const getRules = async(db:SQLiteDatabase)=> {
  const allRows: Rule[]= await db.getAllAsync('SELECT * FROM rules');
  return allRows;
}

export const addRule = async (db:SQLiteDatabase, category: string, content: string) => {
  const result = await db.runAsync('INSERT INTO rules (category, content) VALUES (?, ?)', category, content);
  return result;
}

export const editRuleContent = async (db:SQLiteDatabase, content: string, id: number) => {
  const result = await db.runAsync('UPDATE rules SET content = ? WHERE id = ?', content, id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editRuleCategory = async (db:SQLiteDatabase, category: string, id: number) => {
  const result = await db.runAsync('UPDATE rules SET category = ? WHERE id = ?', category, id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editRule = async (db:SQLiteDatabase, category: string, content: string, id: number) => {
  const result = await db.runAsync('UPDATE rules SET category = ?, content = ? WHERE id = ?', category, content, id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteRule = async (db:SQLiteDatabase, id: number) => {
  const result = await db.runAsync('DELETE FROM rules WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const deleteRuleCategory = async (db:SQLiteDatabase, category: string) => {
  const result = await db.runAsync('DELETE FROM rules WHERE category = ?', category);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}
