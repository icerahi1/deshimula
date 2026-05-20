import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "deshimula.db");
const dirPath = path.dirname(dbPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const db = new Database(dbPath, { verbose: undefined });
db.pragma("foreign_keys = ON");

export function run(sql: string, params: any[] = []) {
  return db.prepare(sql).run(...params);
}

export function get<T = any>(sql: string, params: any[] = []) {
  return db.prepare(sql).get<T>(...params);
}

export function all<T = any>(sql: string, params: any[] = []) {
  return db.prepare(sql).all<T>(...params);
}

export function transaction<T>(fn: (...args: any[]) => T) {
  return db.transaction(fn);
}

export default db;
