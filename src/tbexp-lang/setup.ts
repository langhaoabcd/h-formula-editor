import * as monaco from "monaco-editor-core";
import { languageExtensionPoint, languageID } from "./config";
import { richLanguageConfiguration, monarchLanguage } from "./tbexpLang";
import { TbexpLangWorker } from "./tbexpLangWorker";
import { WorkerManager } from "./WorkerManager";
import DiagnosticsAdapter from "./DiagnosticsAdapter";
import TodoLangFormattingProvider from "./tbexpLangFormattingProvider";
import { IFieldMeta, MetaValueType } from "@toy-box/meta-schema";
import { functionNames } from "./tbexp.function";
import { IRange } from "monaco-editor-core";
import { getPathMeta, ContextResource } from "./schemaMap.data";
import { theme } from "./tbexp.theme";

const VariablePrefix = '$';
const PathRegExp = /[a-zA-Z]\w*(\.\w*|\[[1-9][0-9]*\])*/;///\$[a-zA-Z]\w*(\.\w*|\[[1-9][0-9]*\])*/
const PathRegExpStr = '[a-zA-Z]\\w*(\\.\\w+|\\[[1-9][0-9]*\\])*';//'\\$[a-zA-Z]\\w*(\\.\\w+\\.|\\[[1-9][0-9]*\\]\\.)*'

const parsePath = (pathStr: string) => {
    if (PathRegExp.test(pathStr)) {
        return pathStr.split(/[.[\]]/);
    }
    return [];
};

const createFunctionDependencyProposals = (
    schemaMap: Record<string, IFieldMeta>,
    functionNames: string[],
    range: IRange,
) => {
    const fns = functionNames.map((name) => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: `${name}()`,
        range,
    }));
    const vars = Object.keys(schemaMap || {}).map((key) => ({
        label: `${key}`,
        kind: getFieldKind(schemaMap[key].type),
        detail: schemaMap[key].type,
        insertText: schemaMap[key].type === MetaValueType.ARRAY ? `${key}[]` : `${key}`,
        range,
    }));
    return fns.concat(vars);
};

const createVariableDependencyProposals = (
    schemaMap: Record<string, IFieldMeta>,
    range: IRange,
    cate: string
) => {
    return Object.keys(schemaMap || {}).map((key) => ({
        label: `${cate}${key}`,
        kind: getFieldKind(schemaMap[key].type),
        detail: schemaMap[key].type,
        insertText: schemaMap[key].type === MetaValueType.ARRAY ? `${cate}${key}[]` : `${cate}${key}`,
        range,
    }));
};

const createAttributeDependencyProposals = async (
    // schemaMap: Record<string, IFieldMeta>,
    path: string[],
    range: IRange,
    schemaMapModel: ContextResource
    // getRemoteSchema: GetRemoteSchema,
) => {
    const schemaMap= Object.assign(schemaMapModel.globalVariables, schemaMapModel.localVariable);
    path.forEach((v, i, arr) => {
        if (v.indexOf('[') > -1) {
            arr[i] = v.substring(0, v.indexOf('['));
        }
    })
    let nextPath = path[0];
    let fieldMeta = schemaMap[nextPath];
    let result = await getPathMeta(fieldMeta, path);
    if (result != undefined) {
        return Object.keys(result.properties || {}).map((key) => (
            {
                label: key,
                kind: getFieldKind(result.properties[key].type),
                detail: result.properties[key].type,
                insertText: result.properties[key].type === MetaValueType.ARRAY ? `${key}[]` : key,
                range,
            }));
    } else {
        return [];
    }
};

const getFieldKind = (type: string) => {
    switch (type) {
        case MetaValueType.OBJECT: {
            return monaco.languages.CompletionItemKind.Folder;
        }
        case MetaValueType.ARRAY: {
            return monaco.languages.CompletionItemKind.Enum;
        }
        case MetaValueType.OBJECT_ID: {
            //暂未实现
        }
        default: {
            return monaco.languages.CompletionItemKind.Variable;
        }
    }
}

export function setupLanguage(schemaMapModel: ContextResource, formulaRtType: MetaValueType, onChange:any) {
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            if (label === languageID)
                return "./tbexpLangWorker.js";
            return './editor.worker.js';
        }
    }
    monaco.languages.register(languageExtensionPoint);
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
    monaco.languages.setLanguageConfiguration(languageID, richLanguageConfiguration);
    monaco.editor.defineTheme('tbexpTheme', theme);
    monaco.languages.registerCompletionItemProvider(languageID, {
        triggerCharacters: ['.', '!', '$'],
        provideCompletionItems: async (model, position) => {
            const wordAtPositon = model.getWordUntilPosition(position);
            console.log(
                'wordAtPositon',
                wordAtPositon,
                model.findMatches(PathRegExpStr, true, true, true, null, true),
            );
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordAtPositon.startColumn,
                endColumn: wordAtPositon.endColumn,
            };
            const content = model.getLineContent(position.lineNumber)
            const input = content[position.column - 2]
            //提示可用全局变量
            if (wordAtPositon.word[0] === VariablePrefix) {
                return {
                    suggestions: createVariableDependencyProposals(schemaMapModel.globalVariables, range, '$'),
                };
            }
            //提示‘点出来的’可用属性
            if (input === '.') {
                const match = model
                    .findMatches(PathRegExpStr, true, true, true, null, true)
                    .find(
                        (match) =>
                            match.range.endLineNumber === position.lineNumber &&
                            match.range.endColumn === wordAtPositon.endColumn - 1,
                    );
                if (match && match.matches) {
                    const content = match.matches[0];
                    console.log('当前内容', content);
                    let arr = content.replace(VariablePrefix, '').replace('!', '').split('.');
                    return {
                        suggestions: await createAttributeDependencyProposals(
                            // Object.assign(schemaMapModel.getGlobalVariables, schemaMapModel.getLocalVariables),
                            arr,
                            range,
                            schemaMapModel
                            // getRemoteSchema,
                        ),
                    };
                    // }
                }
            }
            //提示可用函数或变量
            return {
                suggestions: createFunctionDependencyProposals(schemaMapModel.localVariable, functionNames, range),
            };
        }
    })

    // 语法错误校验
    monaco.languages.onLanguage(languageID, () => {
        const client = new WorkerManager();
        const worker: WorkerAccessor = (...uris: monaco.Uri[]): Promise<TbexpLangWorker> => {
            return client.getLanguageServiceWorker(...uris);
        };
        //Call the errors provider
        new DiagnosticsAdapter(worker, schemaMapModel, formulaRtType, onChange);
        // monaco.languages.registerDocumentFormattingEditProvider(languageID, new TodoLangFormattingProvider(worker));
    });
}

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<TbexpLangWorker>;
