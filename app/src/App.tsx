import React, { useState } from 'react'
import axios from 'axios'
import { CodeDiffEditor } from './CodeEditor'
import { DeepLDropDown } from './DeepLDropDown'

export const App: React.FC = () => {
	const [yamlContent, setYamlContent] = useState('')
	const [translatedYaml, setTranslatedYaml] = useState('')
	const [sourceLanguage, setSourceLanguage] = useState<string | null>("EN")
	const [targetLanguage, setTargetLanguage] = useState('DE')
	const [formality, setFormality] = useState('prefer_less')
	const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("apiKey"))

	const handleTranslate = async (code: string) => {
		try {
			const response = await axios.post(
				'/api/translate',
				{ yamlContent: code, sourceLanguage, targetLanguage, formality, apiKey },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			setTranslatedYaml(response.data.translatedData)
		} catch (error) {
			console.error('Error translating YAML:', error)
		}
	}

	return (
		<div style={{
			height: '100vh',
			border: 0,
			display: "grid",
			gridTemplateRows: "auto 1fr",
		}}>
			<div style={{
				padding: "1rem",
				borderBottom: "1px solid #ccc",
			}}>
				<h1 style={{
					textAlign: "center",
					margin: 0,
					padding: ".1rem",
				}}>YAML Translator</h1>
				<label>
					API Key:
					<input
						style={{
							marginLeft: ".5rem",
						}}
						type="password"
						value={apiKey ?? ""}
						onChange={(e) => {
							if (e.target.value !== "") localStorage.setItem("apiKey", e.target.value)
							else localStorage.removeItem("apiKey")
							setApiKey(e.target.value === "" ? null : e.target.value)
						}}
					/>
				</label>
				<br />
				<label>
					Formality:
					<select
						style={{
							marginLeft: ".5rem",
						}}
						value={formality}
						onChange={(e) => setFormality(e.target.value)}
					>
						<option value="default">auto</option>
						<option value="prefer_more">more</option>
						<option value="prefer_less">less</option>
					</select>
				</label>
				<br />
				<DeepLDropDown
					label='Source Language'
					value={sourceLanguage ?? "null"}
					onChange={c => setSourceLanguage(c === "null" ? null : c)}
					type={'source'} />
				<br />
				<DeepLDropDown
					label='Target Language'
					value={targetLanguage}
					onChange={setTargetLanguage}
					type={'target'} />
			</div>
			<CodeDiffEditor original={yamlContent} modified={translatedYaml} onSave={(code) => {
				if (!code.endsWith("\n")) code = code + "\n"
				setYamlContent(code)
				handleTranslate(code)
			}} />
		</div>
	)
}
