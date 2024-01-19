import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [yamlContent, setYamlContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedYaml, setTranslatedYaml] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await axios.post(
        '/api/translate',
        { yamlContent },
        {
          headers: {
            'Content-Type': 'application/json',
            'targetLanguage': targetLanguage,
          },
        }
      );

      setTranslatedYaml(response.data.translatedData);
    } catch (error) {
      console.error('Error translating YAML:', error);
    }
  };

  return (
    <div>
      <h1>YAML Translator</h1>
      <label>
        Target Language:
        <input
          type="text"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        />
      </label>
      <br />
      <label>
        YAML Content:
        <textarea
          value={yamlContent}
          onChange={(e) => setYamlContent(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleTranslate}>Translate</button>
      <br />
      <h2>Translated YAML:</h2>
      <pre>{translatedYaml}</pre>
    </div>
  );
};

export default App;
