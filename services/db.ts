import * as SQLite from "expo-sqlite";

export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const dbInstance = await SQLite.openDatabaseAsync("fraldasDB.db");

  await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS estoqueFraldas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        quantidade INTEGER
    );`);

  await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS compradasMes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        quantidade INTEGER
    );`);

  return dbInstance;
};

export const inserirFraldas = async (
  db: SQLite.SQLiteDatabase,
  novaQuantidade: number
) => {
  await db.runAsync("INSERT INTO estoqueFraldas (quantidade) VALUES (?);", [
    novaQuantidade,
  ]);
};

export const inserirFraldasMes = async (
  db: SQLite.SQLiteDatabase,
  novaQuantidade: number
) => {
  await db.runAsync("INSERT INTO compradasMes (quantidade) VALUES (?);", [
    novaQuantidade,
  ]);
};

export const reduzirFraldas = async (
  db: SQLite.SQLiteDatabase,
  novaQuantidade: number
) => {
  const result = await db.getFirstAsync(
    "SELECT quantidade FROM estoqueFraldas LIMIT 1"
  );
  if (result) {
    await db.runAsync("UPDATE estoqueFraldas SET quantidade = ? ", [
      novaQuantidade,
    ]);
  } else {
    await db.runAsync("INSERT INTO estoqueFraldas (quantidade) VALUES (?);", [
      novaQuantidade,
    ]);
  }
};

export const reduzirFraldasMes = async (
  db: SQLite.SQLiteDatabase,
  novaQuantidade: number
) => {
  const result = await db.getFirstAsync(
    "SELECT quantidade FROM compradasMes LIMIT 1"
  );
  if (result) {
    await db.runAsync("UPDATE compradasMes SET quantidade = ? ", [
      novaQuantidade,
    ]);
  } else {
    await db.runAsync("INSERT INTO compradasMes (quantidade) VALUES (?);", [
      novaQuantidade,
    ]);
  }
};

export const buscarEstoque = async (db: SQLite.SQLiteDatabase) => {
  const result = await db.getFirstAsync(
    "SELECT * FROM estoqueFraldas ORDER BY id DESC LIMIT 1;"
  );
  const result2 = await db.getFirstAsync(
    "SELECT * FROM compradasMes ORDER BY id DESC LIMIT 1;"
  );
  //@ts-ignore
  const quantidadeFraldas = result?.quantidade || 0;
  //@ts-ignore
  const compradasMes = result2?.quantidade || 0;

  return { quantidadeFraldas, compradasMes };
};
