import { ParserException } from '@toy-box/formula';
import { ArgumentErrorModel, ArugumentErrorCode, ValidateException } from '../language-service/exception/ValidateException';
import { argsNumWrongOrNull } from './common';
import { DataType } from './DataType';
import { TYPE } from './types';

/**
 * 多个数字参数
 */
const numbersToNumber = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length > 0) {
    args.forEach((v, i) => {
      if (!v.isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", i));
      }
    })
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

/**
 * 仅有1个数字参数
*/
const oneNumberToNumber = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1) {
    if (!args[0].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 0));
    }
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

/**
 * 有1个或两个数字参数
*/
const oneOrTwoNumberToNumber = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length === 1) {
    if (!args[0].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 0));
    }
  } else if (args.length === 2) {
    if (!args[0].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 1));
    }
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

/**
 * 仅有两个数字参数
*/
const twoNumberToNumber = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length === 2) {
    if (!args[0].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型非数字", 1));
    }
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
}

export const ABS = oneNumberToNumber;

export const CEILING = oneOrTwoNumberToNumber;

//暂未实现
// export const CEILINGMATH = threeNumberOpt2ToNumber;

export const EXP = oneNumberToNumber;

export const FLOOR = oneOrTwoNumberToNumber;//twoNumberOpt1ToNumber;
//暂未实现
//export const FLOORMATH = threeNumberOpt2ToNumber;

export const LN = oneNumberToNumber;

export const LOG = oneOrTwoNumberToNumber;

export const LOG10 = oneNumberToNumber;

export const MAX = numbersToNumber;

export const MIN = numbersToNumber;

export const MOD = twoNumberToNumber;

export const ROUND = oneOrTwoNumberToNumber;

export const ROUNDDOWN = oneOrTwoNumberToNumber;

export const ROUNDUP = oneOrTwoNumberToNumber;

export const SQRT = oneNumberToNumber;

export const AVERAGE = numbersToNumber;

export const SUM = numbersToNumber;

export const COUNT = numbersToNumber;

/**
 * 统计指定区域中非空单元格的个数
 * 这里仅计算count总数
*/
export const COUNTA = (...args: DataType[]) => {
  return new DataType(TYPE.NUMBER);
};

export const POWER = twoNumberToNumber;





