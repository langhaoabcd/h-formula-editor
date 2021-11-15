
export enum TYPE {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  UNKNOW = 'unknow',
  NULL = 'null',
}

export type TYPES = TYPE | TYPE[];

export interface IDataType {
  type: TYPE;
  itemType?: TYPE;
}
