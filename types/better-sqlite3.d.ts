declare module "better-sqlite3" {
  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get<T = any>(...params: any[]): T | undefined;
    all<T = any>(...params: any[]): T[];
    iterate<T = any>(...params: any[]): IterableIterator<T>;
  }

  interface Database {
    prepare(sql: string): Statement;
    pragma(sql: string): any;
    exec(sql: string): void;
    transaction<T>(fn: (...args: any[]) => T): () => T;
    close(): void;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: any): Database;
    (filename: string, options?: any): Database;
    prototype: Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
