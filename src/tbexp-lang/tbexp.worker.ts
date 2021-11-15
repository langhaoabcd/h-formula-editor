import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { TbexpLangWorker } from './tbexpLangWorker';

self.onmessage = () => {
	worker.initialize((ctx) => {
		return new TbexpLangWorker(ctx)
	});
};
