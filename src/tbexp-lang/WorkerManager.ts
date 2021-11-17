import * as monaco from "monaco-editor-core";

// import Uri = monaco.Uri;
import { TbexpLangWorker } from './tbexpLangWorker';
import { languageID } from './config';

export class WorkerManager {

	private worker: monaco.editor.MonacoWebWorker<TbexpLangWorker>;
	private workerClientProxy: Promise<TbexpLangWorker> | undefined;

	constructor() {
		this.worker = null as any;
	}

	private getClientproxy(): Promise<TbexpLangWorker> {

		if (!this.workerClientProxy) {
			this.worker = monaco.editor.createWebWorker<TbexpLangWorker>({
				// module that exports the create() method and returns a `JSONWorker` instance
				moduleId: 'TbexpLangWorker',
				label: languageID,
				// passed in to the create() method
				createData: {
					languageId: languageID,
				}
			});

			this.workerClientProxy = <Promise<TbexpLangWorker>><any>this.worker.getProxy();
		}

		return this.workerClientProxy;
	}

	async getLanguageServiceWorker(...resources: monaco.Uri[]): Promise<TbexpLangWorker> {
		const _client: TbexpLangWorker = await this.getClientproxy();
		await this.worker.withSyncedResources(resources)
		return _client;
	}
}
