import { override } from 'core-decorators';

interface StorageClient {
    open(database: string, version: number | undefined): Promise<boolean>;
    /**
     * insert
     */
    insert(table: string, key: string, record: object): Promise<boolean>;

    fetch(table: string, key: string): Promise<Result>;

    update(table: string, key: string, newRecord: any): Promise<Result>;

    delete(table: string, key: string): Promise<boolean>;
}

interface Result {
    success: boolean;
    reason?: string;
    data: any;
}

const failure: Result = {
    success: false,
    reason: "failed",
    data: undefined
}

class LocalStorageUtil {

    private database: IDBDatabase;
    private tables: Map<string, any>;
    private isOpen: boolean = false;

    constructor() {
        this.tables = new Map();
    }
    
    public async open(database: string, version: number | undefined): Promise<boolean> {
        const connect = window.indexedDB.open(database, version); 
        const result = await this.requestSession(connect);
        if (result && result.success) {
            this.database = result.data;
            this.isOpen = true;
        }
        return result.success;
    }

    private requestSession(session: IDBOpenDBRequest | IDBRequest): Promise<Result> {
        return new Promise((resolve, reject) => {
            session.onerror = (event) => {
                const error = "failed to request connect";
                reject({success: false, reason: error});
            }
            session.onsuccess = (event) => {
                resolve({success: true, data: session.result});
            }
            if (session instanceof IDBOpenDBRequest) {
                session.onupgradeneeded = (event) => {
                    this.database = (event.target as any).result;
                }
            }
        });
    }

    private transaction(table: string, key: string): IDBObjectStore | undefined {
        if (!this.isOpen) {
            throw new Error("please open connect before use");
        }
        if (!this.database) {
            return undefined;
        }
        let savedTable = this.tables.get(table);
        if (!savedTable) {
            savedTable = this.database.createObjectStore(table, {keyPath: key});
            this.tables.set(table, savedTable);
        }
        const transaction = this.database.transaction([table], "readwrite");
        return transaction.objectStore(table);
    }

    public async insert(table: string, key: string, record: any): Promise<boolean> {
        const transaction = this.transaction(table, key);
        if (!transaction) {
            return false;
        }
        const session = transaction.add(record);
        const res = await this.requestSession(session);
        return res.success;
    }

    public async fetch(table: string, key: string): Promise<Result> {
        const transaction = this.transaction(table, key);
        if (!transaction) return failure;
        const session = transaction.get(key);
        return await this.requestSession(session);
    }

    public async update(table: string, key: string, newRecord: any): Promise<Result> {
        const transaction = this.transaction(table, key);
        if (!transaction) return failure;
        const session = transaction.put(newRecord);
        return await this.requestSession(session);
    }

    public async delete(table: string, key: string): Promise<boolean> {
        const transaction = this.transaction(table, key);
        if (!transaction) return false;
        const session = transaction.delete(key);
        return (await this.requestSession(session)).success;
    }
}

export default LocalStorageUtil;
