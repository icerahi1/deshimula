import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1";
const sourcePath = path.join(process.cwd(), "data", "deshimula.db");
const dbPath = isVercel
  ? path.join("/tmp", "deshimula.db")
  : sourcePath;

if (isVercel && !fs.existsSync(dbPath)) {
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, dbPath);
  }
} else if (!isVercel) {
  const dirPath = path.dirname(dbPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
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
