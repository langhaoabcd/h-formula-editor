import { ArgumentErrorModel, ArugumentErrorCode, ValidateException } from '../language-service/exception/ValidateException';
import { argsNumWrongOrNull } from './common';
import { DataType } from './DataType';
import { TYPE } from './types';

/**
 * 将提供的年、月和日参数转换为日期。
 */
export const DATE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 3) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    args.forEach((arg, i) => {
      if (!arg.isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型为数字", i));
      }
    })
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.DATE);
};

export const DATEVALUE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 1) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型为字符串", 0));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.DATE);
};

export const DAY = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 1) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型日期类型", 0));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

const twoDateToDays = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 2) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型日期类型", 0));
    }
    if (!args[1].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型日期类型", 1));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
}

export const DAYS = twoDateToDays

export const DAYS360 = twoDateToDays

export const EDATE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 2) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型日期类型", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型为数字", 1));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.DATE);
};

export const EOMONTH = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 2) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型日期类型", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型为数字", 1));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.DATE);
};

const oneArgReturnInt = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 1) {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  // return args[0].isDateLike
  //   ? new DataType(TYPE.NUMBER)
  //   : new DataType(TYPE.UNKNOW);
  return new DataType(TYPE.NUMBER)
};

export const HOUR = oneArgReturnInt;

export const MINUTE = oneArgReturnInt;

const oneDateToNumber = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 1) {
    errors.push(argsNumWrongOrNull(...args));
  } else {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数类型为日期", 0));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER)
};

export const ISOWEEKNUM = oneDateToNumber;

export const MONTH = oneDateToNumber;

const noArgsReturnDate = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 0) {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.DATE);
};

/**
 * 返回当前日期和时间
 *
*/
export const NOW = noArgsReturnDate;

export const SECOND = oneArgReturnInt;

/**
 * 将文本格式的时间转换为十进制表示的时间
 */
export const TIMEVALUE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length !== 1) {
    errors.push(argsNumWrongOrNull(...args));
  }else{
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数为时间格式的文本", 0));
    }
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);

};

/**
 * 返回当前日期
 * 
*/
export const TODAY = noArgsReturnDate;

export const YEAR = oneDateToNumber;

const dateReturnWeeek = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 1 && args.length <= 2) {
    if (!args[0].isDateLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数为日期类型", 0));
    }
    if (args.length === 2) {
      if (!args[1].isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "类型为数字", 1));
      }
    }
  } else {
    errors.push(argsNumWrongOrNull(...args));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

export const WEEKDAY = dateReturnWeeek //从周一开始请选2

export const WEEKNUM = dateReturnWeeek //采用星期一为一周的开始，1月1日为该年第一周的标准,请选2
