import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import jsyaml from 'js-yaml';

const app = express();
const PORT = 3000;
const API_KEY = Bun.env.DEEPL_API_KEY;

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  try {
    const { yamlContent } = req.body;

    // Parse YAML content
    const data = jsyaml.load(yamlContent);
    const targetLanguage: string = req.headers.targetLanguage as string;

    // Translate values using Deepl API
    const translatedData = await translateDeepL(data, targetLanguage);

    res.json({ translatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function translateDeepL(data: any, targetLanguage: string): Promise<any> {
  const apiKey = API_KEY;
  const apiUrl = 'https://api-free.deepl.com/v2/translate';

  // Extract all values from the data object
  const values = extractValues(data);

  // Translate values using Deepl API
  const translations = await axios.post(apiUrl, {
    auth_key: apiKey,
    text: values,
    target_lang: targetLanguage,
  });

  // Map translated values back to the data object
  const translatedData = mapTranslatedValues(data, translations.data.translations);

  return translatedData;
}

function extractValues(data: any): string[] {
  const values: string[] = [];

  const traverse = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        traverse(obj[key]);
      } else if (typeof obj[key] === 'string') {
        values.push(obj[key]);
      }
    }
  };

  traverse(data);
  return values;
}

function mapTranslatedValues(data: any, translations: any[]): any {
  let index = 0;

  const traverse = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        traverse(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = translations[index].text;
        index++;
      }
    }
  };

  traverse(data);
  return data;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
