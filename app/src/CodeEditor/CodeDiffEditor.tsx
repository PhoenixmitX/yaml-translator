import { editor } from "monaco-editor"

import { DiffEditor, monaco } from "./monaco"

import styles from "./CodeEditor.module.scss"

export interface CodeDiffEditorProps {
	original: string
	modified: string
	onSave?: (code: string) => void
	options?: editor.IStandaloneEditorConstructionOptions
}

export function CodeDiffEditor({ onSave, original, modified, options }: CodeDiffEditorProps) {
	const onMount = (editor: editor.IStandaloneDiffEditor) => {
		editor.getOriginalEditor().addAction({
			id: "save",
			label: "Save",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
			run: () => {
				onSave?.(editor.getOriginalEditor().getValue())
			}
		})
	}

	return (
		<div className={styles.CodeEditor}>
			<DiffEditor
				options={{
					inDiffEditor: false,
					readOnly: modified.length === 0,
					wordWrap: "off",
					originalEditable: true,
					...options,
				}}
				onMount={onMount}
				language="yaml"
				theme="vs-dark"
				original={original}
				modified={modified}
			/>
		</div>
	)
}
