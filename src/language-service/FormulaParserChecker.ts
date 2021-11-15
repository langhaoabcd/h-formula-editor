import { FormulaParserListener } from "../ANTLR/FormulaParserListener";
import { DataType } from "../formulaType";
import { ITbexpLangError } from "./TbexpLangErrorListener";
import { ParseType } from "./type";

export interface FormulaParserChecker extends FormulaParserListener {
  getResultType: () => ParseType,
  getErrors: () => ITbexpLangError[]
}

export type DataValueType = DataType | DataType[];

export class ArgumentItem {
  private datatype: DataValueType;
  private ctx: any;
  constructor(datatype: DataValueType, ctx: any = undefined) {
    this.datatype = datatype;
    this.ctx = ctx;
  }

  public getDataType() {
    return this.datatype;
  }

  public getCtx() {
    return this.ctx;
  }
}