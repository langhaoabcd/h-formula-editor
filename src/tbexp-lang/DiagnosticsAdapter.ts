import * as monaco from "monaco-editor-core";
import { WorkerAccessor } from "./setup";
import { languageID } from "./config";
import { ITbexpLangError } from "../language-service/TbexpLangErrorListener";
import { ContextResource } from "../language-service/schemaMap.data";
import { MetaValueType } from "@toy-box/meta-schema";

export default class DiagnosticsAdapter {
    constructor(private worker: WorkerAccessor, private schemaMapModel: ContextResource, private formulaRtType: MetaValueType,private onChange:any) {
        const onModelAdd = (model: monaco.editor.IModel): void => {
            let handle: any;
            model.onDidChangeContent(() => {
                // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
                // otherwise if the user is still typing, we cancel the
                clearTimeout(handle);
                handle = setTimeout(() => this.validate(model.uri), 1000);
            });
            this.validate(model.uri);
        };
        monaco.editor.onDidCreateModel(onModelAdd);
        monaco.editor.getModels().forEach(onModelAdd);
    }
    private async validate(resource: monaco.Uri): Promise<void> {
        // get the worker proxy
        const worker = await this.worker(resource)
        // call the validate methode proxy from the langaueg service and get errors
        const validationRes = await worker.doValidation(this.schemaMapModel, this.formulaRtType);
        const errorMarkers = validationRes.errors;
        // get the current model(editor or file) which is only one
        const model = monaco.editor.getModel(resource);
        // add the error markers and underline them with severity of Error
        monaco.editor.setModelMarkers(model, languageID, errorMarkers.map(toDiagnostics));
        this.onChange({errors:errorMarkers,formula:validationRes.text})
    }
}
function toDiagnostics(error: ITbexpLangError): monaco.editor.IMarkerData {
    return {
        ...error,
        severity: monaco.MarkerSeverity.Error,
    };
}