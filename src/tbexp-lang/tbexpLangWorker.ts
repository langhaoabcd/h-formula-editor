import * as monaco from "monaco-editor-core";

import IWorkerContext = monaco.worker.IWorkerContext;
import TodoLangLanguageService from "../language-service/LanguageService";
import { ITbexpLangError, ITbexpLangErrorAndCode } from "../language-service/TbexpLangErrorListener";
import { ContextResource } from "./schemaMap.data";
import { MetaValueType } from "@toy-box/meta-schema";


export class TbexpLangWorker {

    private _ctx: IWorkerContext;
    private languageService: TodoLangLanguageService;
    constructor(ctx: IWorkerContext) {
        this._ctx = ctx;
        this.languageService = new TodoLangLanguageService();
    }

    doValidation(schemaMapModel: ContextResource, formulaRtType: MetaValueType): Promise<ITbexpLangErrorAndCode> {
        const code = this.getTextDocument();
        return Promise.resolve(
            {errors:this.languageService.validate(code, schemaMapModel, formulaRtType),text:code});
    }
    format(code: string): Promise<string>{
        return Promise.resolve(this.languageService.format(code,null,null));
    }
    private getTextDocument(): string {
        const model = this._ctx.getMirrorModels()[0];// When there are multiple files open, this will be an array
        return model.getValue();
    }

    // private getContextResource():SchemaMapWraper{
    //    debugger;
    //    const model = this._ctx.getMirrorModels()[0]; 
    //    return null;// , schemaMapModel: SchemaMapWraper
    // }

}
