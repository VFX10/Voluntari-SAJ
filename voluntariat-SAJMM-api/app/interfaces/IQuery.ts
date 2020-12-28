export interface IQuery {
    query: (db: any, callback: (data: any) => void) => void
}