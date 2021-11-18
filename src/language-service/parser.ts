import { FormulaParser, StatContext } from "../ANTLR/FormulaParser";
import { FormulaLexer } from "../ANTLR/FormulaLexer";
import { CharStreams, CommonTokenStream } from "antlr4ts";
import { FieldTypeGet, FormulaParserCheckerImpl } from "./FormulaParserCheckerImpl";
import { FormulaParserChecker } from "./FormulaParserChecker";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import TbexpLangErrorListener, { ITbexpLangError } from "./TbexpLangErrorListener";
import { ContextResource } from "./schemaMap.data";
import { MetaValueType } from "@toy-box/meta-schema";

function parse(code: string = '', getFieldType: FieldTypeGet, schemaMapModel: ContextResource, formulaRtType: MetaValueType): { ast: StatContext, errors: ITbexpLangError[] } {
    const inputStream = CharStreams.fromString(code);
    const lexer = new FormulaLexer(inputStream);
    lexer.removeErrorListeners()
    const tbexpLangErrorsListner = new TbexpLangErrorListener();
    lexer.addErrorListener(tbexpLangErrorsListner);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new FormulaParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(tbexpLangErrorsListner);
    const ast = parser.stat();
    let errors: ITbexpLangError[] = tbexpLangErrorsListner.getErrors();
    if (errors.length > 0) {
        return { ast, errors };
    }
    const listener: FormulaParserChecker = new FormulaParserCheckerImpl(
        getFieldType, schemaMapModel, formulaRtType
    );
    ParseTreeWalker.DEFAULT.walk(listener, ast);
    const typeErrors = listener.getErrors();
    console.log(typeErrors);
    if (typeErrors.length > 0) {
        errors = errors.concat(typeErrors);
    }
    return { ast, errors };
}

export function parseAndGetASTRoot(code: string, getFieldType: FieldTypeGet, schemaMapModel: ContextResource, formulaRtType: MetaValueType): StatContext {
    const { ast } = parse(code, getFieldType, schemaMapModel, formulaRtType);
    return ast;
}

export function parseAndGetSyntaxErrors(code: string, getFieldType: FieldTypeGet, schemaMapModel: ContextResource, formulaRtType: MetaValueType): ITbexpLangError[] {
    const { errors } = parse(code, getFieldType, schemaMapModel,formulaRtType);
    return errors;
}