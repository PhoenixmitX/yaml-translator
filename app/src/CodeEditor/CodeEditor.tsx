import { editor } from "monaco-editor"

import { MonacoEditor, monaco } from "./monaco"

import styles from "./CodeEditor.module.scss"

export interface CodeEditorProps {
	code: string
	language?: "json" | "typescript"
	onSave?: (code: string) => void
	readOnly?: boolean
	options?: editor.IStandaloneEditorConstructionOptions
}

export function CodeEditor({ onSave, code, readOnly = false, options, language = "json" }: CodeEditorProps) {

	const onMount = (editor: editor.IStandaloneCodeEditor) => {
		editor.addAction({
			id: "save",
			label: "Save",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
			run: () => onSave?.(editor.getValue()),
		})
	}

	return (
		<div className={styles.CodeEditor}>
			<MonacoEditor
				options={{
					readOnly,
					wordWrap: "off",
					minimap: {
						enabled: false,
					},
					...options,
				}}
				onMount={onMount}
				language={language}
				theme={"vs-dark"}
				value={code}
			/>
		</div>
	)
}
