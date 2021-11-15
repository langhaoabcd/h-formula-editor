import { ArgumentErrorModel, ArugumentErrorCode, ValidateException } from '../language-service/exception/ValidateException';
import { DataType } from './DataType';
import { TYPE } from './types';

export const CONCATENATE = (...args: DataType[]) => new DataType(TYPE.STRING)

export const EXACT = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length != 2) {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "函数仅有2个参数", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

export const FIND = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 2 || args.length == 3) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (!args[1].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 1));
    }
    if (args.length == 3) {
      if (!args[2].isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 2));
      }
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

export const LEFT = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1 || args.length == 2) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (args.length == 2) {
      if (!args[1].isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 1));
      }
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * 1个参数时，字符串长度  LEN("four")
 * 或
 * 多个数字类型的总数 LEN(1,2,3,4,5)
 */
export const LEN = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 1) {
    if (args.length == 1) {
      if (!args[0].isTextLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "只有1个参数时必须为字符串", 0));
      }
    } else {
      args.forEach((v, i) => {
        if (!v.isDecimalLike) {
          errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", i));
        }
      })
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};
export const LOWER = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * MID 返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定。
 * <p>
 * 语法 MID(text,start_num,num_chars)
 * Text   是包含要提取字符的文本字符串。
 * Start_num   是文本中要提取的第一个字符的位置。文本中第一个字符的 start_num 为 1，以此类推。
 * Num_chars   指定希望 MID 从文本中返回字符的个数。
 */
export const MID = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 3) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 1));
    }
    if (!args[2].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 2));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * 格式化数字
 * NUMBERVALUE("2.500,27",',','.') = 2500.27
 * NUMBERVALUE("250,000",',','.') = 250
 *  NUMBERVALUE("250000",',','.') = 250000
 * NUMBERVALUE("3.5%") = 0.035
 **/
export const NUMBERVALUE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 1 && args.length <= 3) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (args.length >= 2 && !args[1].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 1));
    }
    if (args.length >= 3 && !args[2].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 2));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * 将文本字符串的首字母及任何非字母字符之后的首字母转换成大写。将其余的字母转换成小写。
 */
export const PROPER = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "仅有1个参数", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * 按照给定的次数重复显示文本。可以通过函数 REPT 来不断地重复显示某一文本字符串，对单元格进行填充。
 */
export const REPT = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 2) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (!args[1].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 1));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "仅有2个参数", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};


export const RIGHT = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1 || args.length == 2) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (args.length == 2) {
      if (!args[1].isDecimalLike) {
        errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 1));
      }
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

/**
 * SEARCH 返回从 start_num 开始首次找到特定字符或文本字符串的位置上特定字符的编号。
 * 使用 SEARCH 可确定字符或文本字符串在其他文本字符串中的位置，这样就可使用 MID 或 REPLACE 函数更改文本
 */
export const SEARCH = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 2 && args.length <= 3) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (!args[1].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 1));
    }
    if (args.length >= 3 && !args[2].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 2));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.NUMBER);
};

// SPLIT 暂未实现
// export const SPLIT = (...args: DataType[]) => {
//   if (args.length === 2 && args[0].isTextLike && args[1].isTextLike) {
//     return new DataType(TYPE.STRING);
//   }
//   return new DataType(TYPE.UNKNOW);
// };

export const SUBSTITUTE = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length >= 3 && args.length <= 4) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
    if (!args[1].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 1));
    }
    if (!args[2].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 2));
    }
    if (args.length >= 4 && !args[3].isDecimalLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为数字", 3));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "参数个数错误", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};


export const TRIM = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "仅1个参数", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

export const UPPER = (...args: DataType[]) => {
  let errors: ArgumentErrorModel[] = [];
  if (args.length == 1) {
    if (!args[0].isTextLike) {
      errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "必须为字符串", 0));
    }
  } else {
    errors.push(new ArgumentErrorModel(ArugumentErrorCode.PARAM_COUNT, "仅1个参数", args.length - 1));
  }
  if (errors.length > 0) {
    throw new ValidateException(errors);
  }
  return new DataType(TYPE.STRING);
};

// INCLUDES 暂未实现
// export const INCLUDES = (...args: DataType[]) => {
//   if (
//     args.length === 2 &&
//     args[1].isTextLike &&
//     args[0].checkArrayType(TYPE.STRING)
//   ) {
//     return new DataType(TYPE.STRING);
//   }
//   return new DataType(TYPE.UNKNOW);
// };
