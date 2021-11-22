import { MetaValueType } from "@toy-box/meta-schema";
import { StatContext, VariableContext } from "../ANTLR/FormulaParser";
import { DataType, fromMetaType, TYPE } from "../formulaType";
import { parseAndGetSyntaxErrors } from "./Parser";
import { ContextResource, getVariableType } from "../tbexp-lang/schemaMap.data";
import { ITbexpLangError } from "./TbexpLangErrorListener";

export default class TbexpLangLanguageService {
    private _schemaMapModel: ContextResource;
    validate(code: string, schemaMapModel: ContextResource, formulaRtType: MetaValueType): ITbexpLangError[] {
        this._schemaMapModel = schemaMapModel;
        let syntaxErrors: ITbexpLangError[] = [];
        if (code) {
            //验证语法格式，参数类型，返回类型
            const rtType = fromMetaType(formulaRtType);
            syntaxErrors = parseAndGetSyntaxErrors(code, this.varialeTextTypeFromContext, rtType);
            console.log('syntaxErrors', syntaxErrors);
        }
        return syntaxErrors;
    }
    format(code: string, schemaMapModel: ContextResource, formulaRtType: MetaValueType): string {
        // if the code contains errors, no need to format, because this way of formating the code, will remove some of the code
        // to make things simple, we only allow formatting a valide code
        if (this.validate(code, schemaMapModel, formulaRtType).length > 0)
            return code;
        let formattedCode = "";
        const ast: StatContext = parseAndGetASTRoot(code);
        ast.children.forEach(node => {
            // if (node instanceof AddExpressionContext) {
            //     // if a Add expression : ADD TODO "STRING"
            //     const todo = node.STRING().text;
            //     formattedCode += `ADD TODO ${todo}\n`;
            // }else if(node instanceof CompleteExpressionContext) {
            //     // If a Complete expression: COMPLETE TODO "STRING"
            //     const todoToComplete = node.STRING().text;
            //     formattedCode += `COMPLETE TODO ${todoToComplete}\n`;
            // }
        });
        return formattedCode;
    }
    varialeTextTypeFromContext = (text:string) => {
        const vtype = text.indexOf('$') > -1 ? 0 : 1;
        return getVariableType(this._schemaMapModel, text, vtype);
    }
}

function parseAndGetASTRoot(code: string): StatContext {
    throw new Error("Function not implemented.");
}

function checkSemanticRules(ast: StatContext): ITbexpLangError[] {
    const errors: ITbexpLangError[] = [];
    const definedTodos: string[] = [];
    ast.children.forEach(node => {
        if (node instanceof VariableContext) {
            // if a Add expression : ADD TODO "STRING"
            const todo = node.text;
            // If a TODO is defined using ADD TODO instruction, we can re-add it.
            if (definedTodos.some(todo_ => todo_ === todo)) {
                // node has everything to know the position of this expression is in the code
                errors.push({
                    code: "2",
                    endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
                    endLineNumber: node.stop.line,
                    message: `Todo ${todo} already defined`,
                    startColumn: node.stop.charPositionInLine,
                    startLineNumber: node.stop.line
                });
            } else {
                definedTodos.push(todo);
            }
        }
        // else if(node instanceof CompleteExpressionContext) {
        //     const todoToComplete = node.STRING().text;
        //     if(definedTodos.every(todo_ => todo_ !== todoToComplete)){
        //         // if the the todo is not yet defined, here we are only checking the predefined todo until this expression
        //         // which means the order is important
        //         errors.push({
        //             code: "2",
        //             endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
        //             endLineNumber: node.stop.line,
        //             message: `Todo ${todoToComplete} is not defined`,
        //             startColumn: node.stop.charPositionInLine,
        //             startLineNumber: node.stop.line
        //         });
        //     }
        // }
    })
    return errors;
}