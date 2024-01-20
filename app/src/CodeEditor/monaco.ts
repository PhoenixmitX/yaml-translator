import MonacoEditor, { DiffEditor, MonacoDiffEditor, OnMount, loader,  } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import monacoEditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import yamlEditorWorker from "monaco-yaml/yaml.worker?worker"

self.MonacoEnvironment = {
	getWorker: function (_, label) {
		switch (label) {
			case 'yaml':
        		return new yamlEditorWorker()
			default:
				return new monacoEditorWorker()
		}
	},
}

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: true,
})

loader.config({ monaco })

export { DiffEditor, MonacoEditor, monaco }
export type { MonacoDiffEditor, OnMount }
