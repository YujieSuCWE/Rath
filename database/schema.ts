import db from './index';

export const initDB = async (): Promise<void> => {
    await db.withTransactionAsync(async () => {
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS rules (
                id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS decisions (
                id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS personweights (
                id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name TEXT NOT NULL,
                weight INTEGER NOT NULL,
            );`);

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS groupweights (
                id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name TEXT NOT NULL,
                weight INTEGER NOT NULL
            );`);

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS socialweights (
                id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name TEXT NOT NULL,
                weight INTEGER NOT NULL
            );`);
    });
};
