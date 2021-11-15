import { DataType } from './DataType';
import { argsNumWrongOrNull, uniDataTypes } from './common';
import { TYPE } from './types';
import { ArgumentErrorModel, ArugumentErrorCode, ValidateException } from '../language-service/exception/ValidateException';

const boolsToBool = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 1) {
    args.forEach((v, i) => {
      if (!v.isBoolean) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数必须为布尔值", i));
      }
    })
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.BOOLEAN);
}

export const AND = boolsToBool;

/**
 * IF 函数根据提供的条件参数，条件计算结果为 TRUE 时，返回一个值；
 * 条件计算结果为 FALSE 时，返回另一个值。函数名由 IF（如果）单词组成。
 * <p>
 * IF(条件, [条件为 TRUE 时的返回值], [条件为 FALSE 时的返回值])
 * 
 * 返回类型：未知类型，按值计算所得
 * 
 */
export const IF = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !==3) {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (!args[0].isBoolean) {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "第一个参数必须为布尔值", 0));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.UNKNOW);
};

export const NOT = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length != 1) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isBoolean) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数必须为布尔值", 0));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.BOOLEAN);
};

export const OR = boolsToBool;

/**
 * SWITCH 函数将第一个表达式的计算结果与后续一组值比较，返回第一个匹配值所对应的结果。
 * 
 * 返回类型：未知类型，按值计算所得
 * 
 * */
export const SWITCH = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length < 3) {
    errors.push(argsNumWrongOrNull(...args));
  }

  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.UNKNOW);
};

//后端暂未实现
// export const ISBLANK = (...args: DataType[]) => {
//   if (args.length !== 1) {
//     return new DataType(TYPE.UNKNOW);
//   }
//   return new DataType(TYPE.BOOLEAN);
// };
