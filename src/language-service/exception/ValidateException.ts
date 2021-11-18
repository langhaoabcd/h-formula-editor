export const ArugumentErrorCode = {
  PARAM_COUNT: 'BASIC0001',
  PARAM_TYPE: 'BASIC0002',
  PARAM_NULL: 'BASIC0003',
  RETURN_TYPE: 'BASIC0004',
  FUNCTION_NULL: 'BASIC0005',
} as const;

export const GetArugumentErrorCodeMsg = (code) => {
  const map = new Map([
    ['BASIC0001', '参数数量错误'],
    ['BASIC0002', '参数类型错误'],
    ['BASIC0003', '参数不为空'],
    ['BASIC0004', '返回类型错误'],
    ['BASIC0005', '函数暂未实现'],
    ['BASIC9999', '未知错误']
  ]);
  if (map.has(code)) {
    return map.get(code);
  }
  return '未知错误';
}

export class ArgumentErrorModel {
  public code: string = '';
  public msg: string | undefined = '';
  public detail: string = '';
  public idx: number = 0;
  constructor(code: string, detail: string, index: number) {
    this.code = code;
    this.detail = detail;
    this.idx = index;
    this.msg = GetArugumentErrorCodeMsg(code);
  }
}

export class ValidateException extends Error {
  protected errors: ArgumentErrorModel[] = [];
  constructor(errors: ArgumentErrorModel[]) {
    super();
    this.errors = errors;
  }

  public getErrors() {
    return this.errors;
  }

}