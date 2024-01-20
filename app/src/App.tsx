import React, { useState } from 'react';
import axios from 'axios';
import { CodeDiffEditor } from './CodeEditor';

const App: React.FC = () => {
  const [yamlContent, setYamlContent] = useState('');
  const [translatedYaml, setTranslatedYaml] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<string | null>("EN");
  const [targetLanguage, setTargetLanguage] = useState('DE');
  const [formality, setFormality] = useState('prefer_less');
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("apiKey"));

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
      );

      setTranslatedYaml(response.data.translatedData);
    } catch (error) {
      console.error('Error translating YAML:', error);
    }
  };

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
            type="text"
            value={apiKey ?? ""}
            onChange={(e) => {
              if (e.target.value !== "") localStorage.setItem("apiKey",  e.target.value);
              else localStorage.removeItem("apiKey");
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
        <label>
          Source Language:
          <select
            style={{
              marginLeft: ".5rem",
            }}
            value={sourceLanguage ?? "null"}
            onChange={(e) => setSourceLanguage(e.target.value === "null" ? null : e.target.value)}
          >
            <option value="null">auto</option>
            <option value="BG">BG - Bulgarian</option>
            <option value="CS">CS - Czech</option>
            <option value="DA">DA - Danish</option>
            <option value="DE">DE - German</option>
            <option value="EL">EL - Greek</option>
            <option value="EN">EN - English</option>
            <option value="ES">ES - Spanish</option>
            <option value="ET">ET - Estonian</option>
            <option value="FI">FI - Finnish</option>
            <option value="FR">FR - French</option>
            <option value="HU">HU - Hungarian</option>
            <option value="ID">ID - Indonesian</option>
            <option value="IT">IT - Italian</option>
            <option value="JA">JA - Japanese</option>
            <option value="KO">KO - Korean</option>
            <option value="LT">LT - Lithuanian</option>
            <option value="LV">LV - Latvian</option>
            <option value="NB">NB - Norwegian (Bokmål)</option>
            <option value="NL">NL - Dutch</option>
            <option value="PL">PL - Polish</option>
            <option value="PT">PT - Portuguese (all Portuguese varieties mixed)</option>
            <option value="RO">RO - Romanian</option>
            <option value="RU">RU - Russian</option>
            <option value="SK">SK - Slovak</option>
            <option value="SL">SL - Slovenian</option>
            <option value="SV">SV - Swedish</option>
            <option value="TR">TR - Turkish</option>
            <option value="UK">UK - Ukrainian</option>
            <option value="ZH">ZH - Chinese</option>
          </select>
        </label>
        <br />
        <label>
          Target Language:
          <select
            style={{
              marginLeft: ".5rem",
            }}
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
              <option value="BG">BG - Bulgarian</option>
              <option value="CS">CS - Czech</option>
              <option value="DA">DA - Danish</option>
              <option value="DE">DE - German</option>
              <option value="EL">EL - Greek</option>
              {/* <option value="EN">EN - English (unspecified variant for backward compatibility; please select EN-GB or EN-US instead)</option> */}
              <option value="EN-GB">EN-GB - English (British)</option>
              <option value="EN-US">EN-US - English (American)</option>
              <option value="ES">ES - Spanish</option>
              <option value="ET">ET - Estonian</option>
              <option value="FI">FI - Finnish</option>
              <option value="FR">FR - French</option>
              <option value="HU">HU - Hungarian</option>
              <option value="ID">ID - Indonesian</option>
              <option value="IT">IT - Italian</option>
              <option value="JA">JA - Japanese</option>
              <option value="KO">KO - Korean</option>
              <option value="LT">LT - Lithuanian</option>
              <option value="LV">LV - Latvian</option>
              <option value="NB">NB - Norwegian (Bokmål)</option>
              <option value="NL">NL - Dutch</option>
              <option value="PL">PL - Polish</option>
              {/* <option value="PT">PT - Portuguese (unspecified variant for backward compatibility; please select PT-BR or PT-PT instead)</option> */}
              <option value="PT-BR">PT-BR - Portuguese (Brazilian)</option>
              <option value="PT-PT">PT-PT - Portuguese (all Portuguese varieties excluding Brazilian Portuguese)</option>
              <option value="RO">RO - Romanian</option>
              <option value="RU">RU - Russian</option>
              <option value="SK">SK - Slovak</option>
              <option value="SL">SL - Slovenian</option>
              <option value="SV">SV - Swedish</option>
              <option value="TR">TR - Turkish</option>
              <option value="UK">UK - Ukrainian</option>
              <option value="ZH">ZH - Chinese (simplified)</option>
          </select>
        </label>
      </div>
      <CodeDiffEditor original={yamlContent} modified={translatedYaml} onSave={(code) => {
        if (!code.endsWith("\n")) code = code + "\n";
        setYamlContent(code);
        handleTranslate(code);
      }} />
    </div>
  );
};

export default App;
