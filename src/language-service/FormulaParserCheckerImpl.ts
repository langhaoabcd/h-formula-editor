import { ParserRuleContext } from "antlr4ts";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { DecimalLiteralExpressionContext, StringLiteralExpressionContext, BooleanLiteralExpressionContext, VariableExpressionContext, ParenthesizedExpressionContext, MultiplicativeExpressionContext, AdditiveExpressionContext, CompareExpressionContext, FunctionExpressionContext, StatContext, ArgumentsContext, ArgumentListContext, ArgumentContext, VariableContext, FunctionContext, SingleExpressionContext } from "../ANTLR/FormulaParser";
import { ParseType } from "./type";
import { DataType } from "../formulaType/DataType";
import { ArgumentItem, FormulaParserChecker } from "./FormulaParserChecker";
import { TYPE } from "../formulaType/types";
import { formulaType } from "../formulaType";
import { ITbexpLangError } from "./TbexpLangErrorListener";
import { ArgumentErrorModel, ValidateException, ArugumentErrorCode, } from "./exception/ValidateException";
import { getVariableType } from "./schemaMap.data";

export type FieldTypeGet = (pattern: string) => DataType;

export class FormulaParserCheckerImpl implements FormulaParserChecker {
  private parseException?: ParserException;
  private parserMap = new WeakMap();
  private getFieldType: FieldTypeGet;
  private parseType: ParseType;
  private errors: ITbexpLangError[];

  constructor(getFieldType: FieldTypeGet) {
    this.getFieldType = getFieldType;
    this.parseType = {
      success: false,
      result: new DataType(TYPE.UNKNOW),
    };
    this.errors = [];
  }

  enterDecimalLiteralExpression?: (ctx: DecimalLiteralExpressionContext) => void;
  enterStringLiteralExpression?: (ctx: StringLiteralExpressionContext) => void;
  enterBooleanLiteralExpression?: (ctx: BooleanLiteralExpressionContext) => void;
  enterVariableExpression?: (ctx: VariableExpressionContext) => void;
  enterParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;
  enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
  enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
  enterCompareExpression?: (ctx: CompareExpressionContext) => void;
  enterFunctionExpression?: (ctx: FunctionExpressionContext) => void;
  enterStat?: (ctx: StatContext) => void;
  enterArguments?: (ctx: ArgumentsContext) => void;
  enterArgumentList?: (ctx: ArgumentListContext) => void;
  enterArgument?: (ctx: ArgumentContext) => void;
  enterVariable?: (ctx: VariableContext) => void;
  exitVariable?: (ctx: VariableContext) => void;
  enterFunction?: (ctx: FunctionContext) => void;
  enterSingleExpression?: (ctx: SingleExpressionContext) => void;
  visitTerminal?: (node: TerminalNode) => void;
  visitErrorNode?: (node: ErrorNode) => void;
  enterEveryRule?: (ctx: ParserRuleContext) => void;
  exitEveryRule?: (ctx: ParserRuleContext) => void;

  exitBooleanLiteralExpression(ctx: BooleanLiteralExpressionContext) {
    // this.parserMap.set(ctx, new DataType(TYPE.BOOLEAN));
    this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.BOOLEAN), ctx));
  }

  exitDecimalLiteralExpression(ctx: DecimalLiteralExpressionContext) {
    // this.parserMap.set(ctx, new DataType(TYPE.NUMBER));
    this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.NUMBER), ctx));
  }

  exitStringLiteralExpression(ctx: StringLiteralExpressionContext) {
    // this.parserMap.set(ctx, new DataType(TYPE.STRING));
    this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.STRING), ctx));
  }

  exitVariableExpression(ctx: VariableExpressionContext) {
    const text = ctx.variable().FieldLiteral().text;
    // const dtype = this.getFieldType(text);//注入的方式
    const dtype = getVariableType(text, text.indexOf('$') > -1 ? 0 : 1);
    this.parserMap.set(
      ctx,
      new ArgumentItem(dtype, ctx),
    );
  }

  exitFunction(ctx: FunctionContext) {
    const argsItem = this.parserMap.get(ctx.getChild(1)).datatype;
    // if ((argsItem as DataType).isNull) {
    //   this.errors.push({
    //     code: ArugumentErrorCode.PARAM_NULL,
    //     endColumn: ctx.stop.stopIndex + 2,
    //     endLineNumber: ctx.stop.line,
    //     message: `${ctx.text},参数不为空`,
    //     startColumn: ctx.stop.charPositionInLine + 1,
    //     startLineNumber: ctx.stop.line
    //   });
    //   this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));
    //   return;
    // }
    const args = ctx.getChild(1).childCount > 2 ? argsItem.map(x => x.datatype) : [];
    const fn = formulaType[ctx.getChild(0).text.toUpperCase()];
    if (fn == undefined) {
      // this.parseException = new ParserException('function not exists');
      // this.parseType = {
      //   success: false,
      //   result: new DataType(TYPE.UNKNOW),
      // };
      // this.parserMap.set(ctx, new DataType(TYPE.UNKNOW));
      this.errors.push({
        code: ArugumentErrorCode.FUNCTION_NULL,
        endColumn: ctx.stop.stopIndex + 2,
        endLineNumber: ctx.stop.line,
        message: `${ctx.text},该函数暂未实现`,
        startColumn: ctx.stop.charPositionInLine + 1,
        startLineNumber: ctx.stop.line
      });
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));
    } else {
      try {
        const funcVal = fn(...args);
        // this.parserMap.set(ctx, funcVal);
        this.parserMap.set(ctx, new ArgumentItem(funcVal, ctx));
      } catch (err) {
        if (err instanceof ValidateException) {
          this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));
          err.getErrors().forEach((x, i) => {
            //如果函数参数为空的时候
            if (x.code == ArugumentErrorCode.PARAM_NULL) {
              this.errors.push({
                code: x.code,
                endColumn: ctx.stop.stopIndex + 2,
                endLineNumber: ctx.stop.line,
                message: `${ctx.text},参数不为空`,
                startColumn: ctx.stop.charPositionInLine + 1,
                startLineNumber: ctx.stop.line
              });
            } else {
              const param_ctx = argsItem[x.idx].ctx;
              this.errors.push({
                code: x.code,
                endColumn: param_ctx.stop.stopIndex + 2,
                endLineNumber: param_ctx.stop.line,
                message: `${param_ctx.text},${x.msg},${x.detail}`,
                startColumn: param_ctx.stop.charPositionInLine + 1,
                startLineNumber: param_ctx.stop.line
              });
            }
          })
        }
      }
    }
  }

  exitFunctionExpression(ctx: FunctionExpressionContext) {
    // this.parserMap.set(ctx, this.parserMap.get(ctx.getChild(0)));
    this.parserMap.set(ctx, new ArgumentItem(this.parserMap.get(ctx.getChild(0)).getDataType(), ctx));
  }

  exitArguments(ctx: ArgumentsContext) {
    if (ctx.childCount == 2) {
      //函数没有参数
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.NULL), ctx));
      return;
      // throw new ArgumentException([new ArgumentErrorModel(ArugumentErrorCode.PARAM_NULL, "参数非空", 0)]);
    }
    // this.parserMap.set(ctx, this.parserMap.get(ctx.getChild(1)));
    this.parserMap.set(ctx, new ArgumentItem(this.parserMap.get(ctx.getChild(1)).getDataType(), ctx));
  }

  exitArgumentList(ctx: ArgumentListContext) {
    const args: any[] = [];
    for (let i = 0; i < ctx.childCount; i += 1) {
      if (i % 2 === 0) {
        args.push(this.parserMap.get(ctx.getChild(i)));
      }
    }
    // this.parserMap.set(ctx, args);
    this.parserMap.set(ctx, new ArgumentItem(args, ctx));
  }

  exitArgument(ctx: ArgumentContext) {
    console.log('argument:' + ctx.text);
    // this.parserMap.set(ctx, this.parserMap.get(ctx.getChild(0)));
    this.parserMap.set(ctx, new ArgumentItem(this.parserMap.get(ctx.getChild(0)).getDataType(), ctx));
  }

  exitAdditiveExpression(ctx: AdditiveExpressionContext) {
    const left = this.parserMap.get(ctx.getChild(0)).getDataType() as DataType;
    const right = this.parserMap.get(ctx.getChild(2)).getDataType() as DataType;
    if (left.isDecimalLike && right.isDecimalLike) {
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.NUMBER), ctx));
    } else {
      if (!left.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(0)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      if (!right.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(2)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));

      // this.parseException = new ParserException('additive expression error');
      // this.parseType = {
      //   success: false,
      //   result: new DataType(TYPE.UNKNOW),
      // };
    }
  }

  exitMultiplicativeExpression(ctx: MultiplicativeExpressionContext) {
    // const left = this.parserMap.get(ctx.getChild(0)) as DataType;
    // const right = this.parserMap.get(ctx.getChild(2)) as DataType;
    const left = this.parserMap.get(ctx.getChild(0)).getDataType() as DataType;
    const right = this.parserMap.get(ctx.getChild(2)).getDataType() as DataType;
    if (left.isDecimalLike && right.isDecimalLike) {
      // this.parserMap.set(ctx, new DataType(TYPE.NUMBER));
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.NUMBER), ctx));
    } else {
      // this.parseException = new ParserException(
      //   'multiplicative expression error',
      // );
      // this.parseType = {
      //   success: false,
      //   result: new DataType(TYPE.UNKNOW),
      // };
      if (!left.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(0)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      if (!right.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(2)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数非数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));
    }
  }

  exitCompareExpression(ctx: CompareExpressionContext) {
    // this.parserMap.set(ctx, new DataType(TYPE.BOOLEAN));
    // this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.BOOLEAN), ctx));
    const left = this.parserMap.get(ctx.getChild(0)).getDataType() as DataType;
    const right = this.parserMap.get(ctx.getChild(2)).getDataType() as DataType;
    if (left.isDecimalLike && right.isDecimalLike) {
      // this.parserMap.set(ctx, new DataType(TYPE.NUMBER));
    } else {
      if (!left.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(0)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数暂仅支持数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      if (!right.isDecimalLike) {
        const param_ctx = this.parserMap.get(ctx.getChild(2)).getCtx();
        const rightModel = new ArgumentErrorModel(ArugumentErrorCode.PARAM_TYPE, "参数暂仅支持数字", 0)
        this.errors.push({
          code: rightModel.code,
          endColumn: param_ctx.stop.stopIndex + 2,
          endLineNumber: param_ctx.stop.line,
          message: `${param_ctx.text},${rightModel.msg},${rightModel.detail}`,
          startColumn: param_ctx.stop.charPositionInLine + 1,
          startLineNumber: param_ctx.stop.line
        });
      }
      // this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.UNKNOW), ctx));
    }
    this.parserMap.set(ctx, new ArgumentItem(new DataType(TYPE.BOOLEAN), ctx));
  }

  exitParenthesizedExpression(ctx: ParenthesizedExpressionContext) {
    // this.parserMap.set(ctx, this.parserMap.get(ctx.getChild(1)));
    this.parserMap.set(ctx, new ArgumentItem(this.parserMap.get(ctx.getChild(1)).getDataType(), ctx));
  }

  exitStat(ctx: StatContext) {
    if (this.parseException) {
      this.parseType = {
        success: false,
        result: new DataType(TYPE.UNKNOW),
        // errors: [this.parseException.message]
      };
    } else {
      this.parseType = {
        success: true,
        result: this.parserMap.get(ctx.getChild(0)).getDataType(),
        // errors:[]
      };
    }
  }

  exitSingleExpression(ctx: SingleExpressionContext) {
    // this.parserMap.set(ctx, this.parserMap.get(ctx.getChild(0)));
    this.parserMap.set(ctx, new ArgumentItem(this.parserMap.get(ctx.getChild(0)).getDataType(), ctx));
  }

  getResultType() {
    return this.parseType;
  }

  getErrors() {
    return this.errors;
  }
}

export class ParserException extends Error {
  constructor(message: string) {
    super(message);
  }
}