import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('database.db');

export default db;