import type { SQLiteDatabase } from 'expo-sqlite';

export interface Decision {
    id: number;
    title: string;
    content: string;
    created_at: number;
  }

export const getDecisions = async(db:SQLiteDatabase)=> {
  const allRows: Decision[]= await db.getAllAsync('SELECT * FROM decisions');
  return allRows;
}

export const addDecision = async (db:SQLiteDatabase, title: string, content: string) => {
  const result = await db.runAsync('INSERT INTO decisions (title, content) VALUES (?, ?)', title, content);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}

export const editDecisionTitle = async (db:SQLiteDatabase, title: string, id: number) => {
  const result = await db.runAsync('UPDATE decisions SET title = ? WHERE id = ?', title, id);
  console.log(result.lastInsertRowId, result.changes); 
  return result;
}

export const editDecisionContent = async (db:SQLiteDatabase, content: string, id: number) => {
  const result = await db.runAsync('UPDATE decisions SET content = ? WHERE id = ?', content, id);
  console.log(result.lastInsertRowId, result.changes); 
  return result;
}

export const editDecision = async (db:SQLiteDatabase, title: string, content: string, id: number) => {
  const result = await db.runAsync('UPDATE decisions SET title = ?, content = ? WHERE id = ?', title, content, id);
  console.log(result.lastInsertRowId, result.changes); 
  return result;
}

export const deleteDecision = async (db:SQLiteDatabase, id: number) => {
  const result = await db.runAsync('DELETE FROM decisions WHERE id = ?', id);
  console.log(result.lastInsertRowId, result.changes);
  return result;
}
