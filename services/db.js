import * as SQLite from "expo-sqlite";

export const initializeDatabase = async () => {
  const dbInstance = await SQLite.openDatabaseAsync("fraldasDB.db");
  
  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS estoqueFraldas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      quantidade INTEGER
    );
  `);
  
  return dbInstance;
};

export const inserirFraldas = async (db, novaQuantidade) => {
  await db.runAsync(
    "INSERT INTO estoqueFraldas (quantidade) VALUES (?);",
    [novaQuantidade]
  );

  console.log("Fraldas inseridas com sucesso!");
  console.log(novaQuantidade);
};


export const reduzirFraldas = async (db, novaQuantidade) => {
  const result = await db.getFirstAsync("SELECT quantidade FROM estoqueFraldas");
  
  if (result) {
    await db.runAsync("UPDATE estoqueFraldas SET quantidade = ?;", [
      novaQuantidade,
    ]);
  } else {
    await db.runAsync("INSERT INTO estoqueFraldas (quantidade) VALUES (?);", [
      novaQuantidade,
    ]);
  }
};


export const buscarEstoque = async (db) => {
  const result = await db.getFirstAsync(
    "SELECT * FROM estoqueFraldas ORDER BY id DESC LIMIT 1;"
  );

  //@ts-ignore
  const quantidadeFraldas = result?.quantidade || 0;
  return { quantidadeFraldas };
};


export const atualizarEstoqueTotalUsuarioLocal = async (db, userId, novaQuantidade) => {
  await db.runAsync(
    "UPDATE estoqueFraldas SET quantidade = quantidade + ? WHERE id = ?;",
    [novaQuantidade, userId]
  );
};


