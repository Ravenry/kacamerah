export interface MongooseDocument {
  _id: unknown;
  __v?: number;
}

export type WithMongooseFields<T> = T & MongooseDocument;

export function removeMongooseFields<T>(doc: WithMongooseFields<T>): T {
  const { _id, __v, ...rest } = doc;
  return rest as T;
} 