
import { IFieldMeta, MetaValueType } from "@toy-box/meta-schema";
import { DataType, fromMetaType, TYPE } from "../formulaType";
import { DataValueType } from "./FormulaParserChecker";

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
  // private _localVariables: Record<string, IFieldMeta>;
  // private _globalVariables: Record<string, IFieldMeta>;

  // get getLocalVariables(): Record<string, IFieldMeta>{
  //   return this._localVariables;
  // }
  // set setLocalVariables(map: Record<string, IFieldMeta>) {
  //   this._localVariables = map;
  // }

  // get getGlobalVariables(): Record<string, IFieldMeta> {
  //   return this._globalVariables;
  // }
  // set setGlobalVariables(map: Record<string, IFieldMeta>) {
  //   this._globalVariables = map;
  // }

  // getGlobalSchema =()=>{
  //   return this.getGlobalVariables;
  // }
}

export const getVariableType = (
  contextResource: ContextResource,
  text: string,
  type: number = 0,
) => {
  let arr = text.replace('!', '').replace('$', '').split('.');
  // text.replace(/^\{!/gi, '').replace(/\}$/gi, '').replace('$', '').split('.');
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
  // getRemoteSchema: GetRemoteSchema,
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
  // getRemoteSchema: GetRemoteSchema,
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
  return await getPathMetaAsync(currentMeta, path);//, getRemoteSchema);
};

// export const schemaMap: Record<string, IFieldMeta> = {
//   currentUser: {
//     key: '123',
//     name: 'currentUser',
//     type: 'object',
//     properties: {
//       id: {
//         key: 'id',
//         name: 'ID',
//         type: 'number',
//       },
//       name: {
//         key: 'name',
//         name: 'Name',
//         type: 'string',
//       },
//       project: {
//         key: 'project',
//         name: 'Project',
//         type: 'object',
//         properties: {
//           id2: {
//             key: 'id2',
//             name: 'ID2',
//             type: 'number',
//           },
//           name2: {
//             key: 'name2',
//             name: 'Name2',
//             type: 'string',
//           },
//           project2: {
//             key: 'project2',
//             name: 'Project2',
//             type: 'object',
//             properties: {
//               id3: {
//                 key: 'id3',
//                 name: 'ID3',
//                 type: 'number',
//               },
//               name3: {
//                 key: 'name3',
//                 name: 'Name3',
//                 type: 'string',
//               },
//             },
//           },
//         },
//       },
//       books: {
//         key: '444',
//         name: 'books',
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             price: {
//               key: 'price',
//               type: 'number',
//               name: 'price',
//             },
//             authors: {
//               key: 'authors',
//               type: 'array',
//               name: 'authors',
//               items: {
//                 type: 'object',
//                 properties: {
//                   name: {
//                     key: 'name',
//                     type: 'string',
//                     name: 'name',
//                   },
//                   age: {
//                     key: 'age',
//                     type: 'integer',
//                     name: 'age',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   tags: {
//     key: '333',
//     name: 'tags',
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//     required: true,
//   },
//   books: {
//     key: '444',
//     name: 'books',
//     type: 'array',
//     items: {
//       type: 'object',
//       properties: {
//         price: {
//           key: 'price',
//           type: 'number',
//           name: 'price',
//         },
//         title: {
//           key: 'title',
//           type: 'string',
//           name: 'title',
//         },
//         authors: {
//           key: 'authors',
//           type: 'array',
//           name: 'authors',
//           items: {
//             type: 'object',
//             properties: {
//               name: {
//                 key: 'name',
//                 type: 'string',
//                 name: 'name',
//               },
//               country: {
//                 key: 'country',
//                 type: 'string',
//                 name: 'country',
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   //外键关联
//   // ObjectRefId:{
//   // },
//   //多维数组，meta-schema lib不支持
//   // ManyDiemension: {
//   //   key: '333',
//   //   name: 'ManyDiemension',
//   //   type: 'array',
//   //   items: {
//   //     type: 'array',
//   //     items: {
//   //       type: 'string'
//   //     }
//   //   },
//   //   required: true
//   // },
// };

// export const localSchemaMap: Record<string, IFieldMeta> = {
//   address: {
//     key: 'address',
//     name: 'Address',
//     type: 'object',
//     properties: {
//       aid: {
//         key: 'aid',
//         name: 'ID',
//         type: 'number',
//       },
//       aname: {
//         key: 'aname',
//         name: 'Name',
//         type: 'string',
//       },
//       aproject: {
//         key: 'aproject',
//         name: 'Project',
//         type: 'object',
//         properties: {
//           aid2: {
//             key: 'aid2',
//             name: 'ID2',
//             type: 'number',
//           },
//           aname2: {
//             key: 'aname2',
//             name: 'Name2',
//             type: 'string',
//           },
//           aproject2: {
//             key: 'aproject2',
//             name: 'Project2',
//             type: 'object',
//             properties: {
//               aid3: {
//                 key: 'aid3',
//                 name: 'ID3',
//                 type: 'number',
//               },
//               aname3: {
//                 key: 'aname3',
//                 name: 'Name3',
//                 type: 'string',
//               },
//             },
//           },
//         },
//       },
//       abooks: {
//         key: '444',
//         name: 'abooks',
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             aprice: {
//               key: 'aprice',
//               type: 'number',
//               name: 'price',
//             },
//             aauthors: {
//               key: 'aauthors',
//               type: 'array',
//               name: 'authors',
//               items: {
//                 type: 'object',
//                 properties: {
//                   aname: {
//                     key: 'aname',
//                     type: 'string',
//                     name: 'name',
//                   },
//                   age: {
//                     key: 'age',
//                     type: 'integer',
//                     name: 'age',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   }
// };

/**
 * type =0 全局变量 1局部变量
*/

