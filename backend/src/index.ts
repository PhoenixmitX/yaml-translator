import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { Document, YAMLMap, parseDocument } from 'yaml';
import { Formality, SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';

const app = express();
const PORT = 3000;
const API_KEY = Bun.env.DEEPL_API_KEY!;

app.use(bodyParser.json());

// bun workaround: https://github.com/oven-sh/bun/issues/267
axios.defaults.headers.common["Accept-Encoding"] = "gzip, compress, deflate";


app.post('/translate', async (req, res) => {
	try {
		console.log('Request received');
		const { yamlContent, sourceLanguage, targetLanguage, apiKey, formality } = req.body;

		// Parse YAML content
		const data: Document.Parsed = parseDocument(yamlContent);

		// Translate values using Deepl API
		await translateDeepL(data, sourceLanguage, targetLanguage, formality, apiKey || API_KEY);

		res.json({
			translatedData: data.toString({
				lineWidth: 0,
				minContentWidth: 0,
			})
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

async function translateDeepL(data: Document.Parsed, sourceLanguage: SourceLanguageCode | null, targetLanguage: TargetLanguageCode, formality: Formality, apiKey: string) {
	const deepl = new Translator(apiKey, { headers: { "Accept-Encoding": "gzip, compress, deflate" } });

	// Extract all values from the data object
	const values = extractValues(data);

	// Translate values using Deepl API
	const translations = await deepl.translateText(values, sourceLanguage ?? null, targetLanguage, {
		context: 'text with placeholders',
		preserveFormatting: true,
		formality: formality,
	});

	// Map translated values back to the data object
	mapTranslatedValues(data, translations.map((t) => t.text));
}

function extractValues(data: Document.Parsed): string[] {
	const values: string[] = [];

	const yaml: YAMLMap = data.contents as YAMLMap;

	const traverse = (obj: any) => {
		for (const key in obj) {
			switch (typeof obj[key]) {
				case 'object':
					traverse(obj[key]);
					break;
				case 'string':
					values.push(obj[key]);
					break;
			}
		}
	};

	traverse(data.toJSON());
	return values;
}

function mapTranslatedValues(data: Document.Parsed, translations: string[]): any {
	let index = 0;

	const traverse = (obj: any, path: (string | number)[]) => {
		for (const key in obj) {
			switch (typeof obj[key]) {
				case 'object':
					traverse(obj[key], [...path, key]);
					break;
				case 'string':
					data.setIn([...path, key], translations[index]);
					index++;
					break;
			}
		}
	};

	traverse(data.toJSON(), []);
	return data;
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
