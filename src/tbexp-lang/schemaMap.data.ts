
import { IFieldMeta, MetaValueType } from "@toy-box/meta-schema";
import { DataType, fromMetaType, TYPE } from "../formulaType";
import { DataValueType } from "../language-service/FormulaParserChecker";

export const getTypeHook = (variable: string) => {
  if (variable === "id") {
    return new DataType(TYPE.STRING);
  }
  return new DataType(TYPE.NUMBER);
}

export class ContextResource {
  constructor() {}
  public localVariable: Record<string, IFieldMeta>;
  public globalVariables: Record<string, IFieldMeta>;
}

export const getVariableType = (
  contextResource: ContextResource,
  text: string,
  type: number = 0,
) => {
  let arr = text.replace('!', '').replace('$', '').split('.');
  arr.forEach((v, i, arr) => {
    if (v.indexOf('[') > -1) {
      arr[i] = v.substring(0, v.indexOf('['));
    }
  })
  let nextPath = arr[0];
  let fieldMeta = contextResource.globalVariables[nextPath];
  if (type == 1) {
    fieldMeta = contextResource.localVariable[nextPath];
  }
  if (fieldMeta == undefined) {
    return new DataType(TYPE.NULL);//变量不存在
  }
  let result = getPathMeta(fieldMeta, arr);
  if (result != undefined) {
    return fromMetaType(result.type == 'array' ? result.items.type : result.type);
  }
  return new DataType(TYPE.UNKNOW);
}

export const getPathMeta = (
  fieldMeta: IFieldMeta,
  path: string[],
): IFieldMeta | any | undefined => {
  if (path.length === 1) {
    if (fieldMeta.type === MetaValueType.ARRAY) {
      if (fieldMeta.items.type === MetaValueType.OBJECT) {
        return fieldMeta.items;
      }
    }
    return fieldMeta;
  }
  path.splice(0, 1);
  let nextPath = path[0];
  let currentMeta: any;

  if (fieldMeta.type === MetaValueType.OBJECT) {
    currentMeta = fieldMeta.properties[nextPath];
  }
  if (fieldMeta.type === MetaValueType.ARRAY) {
    if (fieldMeta.items.type === MetaValueType.OBJECT) {
      currentMeta = fieldMeta.items.properties[nextPath].items;
    }
  }
  // if (fieldMeta.type === MetaValueType.ARRAY && /[a-zA-Z]\w*(\[[1-9][0-9]*\])*/.test(nextPath)) {//} && /\[[0-9]]*/.test(nextPath)) {
  //     currentMeta = fieldMeta.properties[nextPath].items.properties;
  // }
  // else if (fieldMeta.type === MetaValueType.OBJECT_ID) {
  //     // currentMeta = await getRemoteSchema(fieldMeta.key);
  // }
  // else {
  //     currentMeta = fieldMeta.properties[nextPath];
  // }
  if (currentMeta == null) {
    return undefined;
  }
  return getPathMeta(currentMeta, path);//, getRemoteSchema);
};

export const getPathMetaAsync = async (
  fieldMeta: IFieldMeta,
  path: string[],
): Promise<IFieldMeta | any | undefined> => {
  if (path.length === 1) {
    if (fieldMeta.type === MetaValueType.ARRAY) {
      if (fieldMeta.items.type === MetaValueType.OBJECT) {
        return fieldMeta.items;
      }
    }
    return fieldMeta;
  }
  path.splice(0, 1);
  let nextPath = path[0];
  let currentMeta: any;

  if (fieldMeta.type === MetaValueType.OBJECT) {
    currentMeta = fieldMeta.properties[nextPath];
  }
  if (fieldMeta.type === MetaValueType.ARRAY) {
    if (fieldMeta.items.type === MetaValueType.OBJECT) {
      currentMeta = fieldMeta.items.properties[nextPath].items;
    }
  }
  // if (fieldMeta.type === MetaValueType.ARRAY && /[a-zA-Z]\w*(\[[1-9][0-9]*\])*/.test(nextPath)) {//} && /\[[0-9]]*/.test(nextPath)) {
  //     currentMeta = fieldMeta.properties[nextPath].items.properties;
  // }
  // else if (fieldMeta.type === MetaValueType.OBJECT_ID) {
  //     // currentMeta = await getRemoteSchema(fieldMeta.key);
  // }
  // else {
  //     currentMeta = fieldMeta.properties[nextPath];
  // }
  if (currentMeta == null) {
    return undefined;
  }
  return await getPathMetaAsync(currentMeta, path);
};