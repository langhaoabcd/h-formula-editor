import { IObjectMeta } from "@toy-box/meta-schema";
import { DataType } from "../formulaType";
import { ITbexpLangError } from "./TbexpLangErrorListener";

export interface ParseType {
  success: boolean;
  result: DataType;
}

export type GetRemoteSchema = (key: string) => Promise<IObjectMeta>;