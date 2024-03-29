import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [code, setCode] = useState('// type your code here');
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(19);
  const [enableBasicAutocomplete, setEnableBasicAutocomplete] = useState(true);
  const [enableLiveAutocomplete, setEnableLiveAutocomplete] = useState(true);
  const [showGutter, setShowGutter] = useState(true);
  const [showPrintMargin, setShowPrintMargin] = useState(true);
  const [highlightActiveLine, setHighlightActiveLine] = useState(true);
  const [enableSnippets, setEnableSnippets] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  function handleEditorChange(value, event) {
    setCode(value);
  }

  function runCode() {
    const originalLog = console.log;
    try {
      // Clear previous logs
      setLogs([]);

      // Override console.log function
      console.log = (...args) => {
        setLogs((prevLogs) => [...prevLogs, ...args]);
        originalLog(...args);
      };

      // Execute the code
      const userFunction = new Function(code);
      userFunction();

      // Restore original console.log after execution
      console.log = originalLog;
    } catch (error) {
      // Handle errors and restore original console.log
      console.log = originalLog;
      setLogs((prevLogs) => [...prevLogs, 'Error: ' + error.message]);
    }
  }

  useEffect(() => {
    const handleError = (e) => {
      e.stopImmediatePropagation();

    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);


  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={code}
        theme={theme}
        options={{
          fontSize: fontSize,
          lineHeight: lineHeight,
          quickSuggestions: enableBasicAutocomplete,
          suggestOnTriggerCharacters: enableLiveAutocomplete,
          lineNumbers: showLineNumbers ? 'on' : 'off',
          folding: showGutter,
          printMargin: showPrintMargin,
          highlightActiveLine: highlightActiveLine,
          snippetSuggestions: enableSnippets,
        }}
        onChange={handleEditorChange}
      />
      <button onClick={runCode}>Run</button>
      <button onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}>Toggle Theme</button>
      <button onClick={() => setFontSize(fontSize + 1)}>Increase Font Size</button>
      <button onClick={() => setFontSize(fontSize - 1)}>Decrease Font Size</button>
      <button onClick={() => setLineHeight(lineHeight + 1)}>Increase Line Height</button>
      <button onClick={() => setLineHeight(lineHeight - 1)}>Decrease Line Height</button>
      <button onClick={() => setEnableBasicAutocomplete(!enableBasicAutocomplete)}>Toggle Basic Autocomplete</button>
      <button onClick={() => setEnableLiveAutocomplete(!enableLiveAutocomplete)}>Toggle Live Autocomplete</button>
      <button onClick={() => setShowGutter(!showGutter)}>Toggle Gutter</button>
      <button onClick={() => setShowPrintMargin(!showPrintMargin)}>Toggle Print Margin</button>
      <button onClick={() => setHighlightActiveLine(!highlightActiveLine)}>Toggle Highlight Active Line</button>
      <button onClick={() => setEnableSnippets(!enableSnippets)}>Toggle Snippets</button>
      <button onClick={() => setShowLineNumbers(!showLineNumbers)}>Toggle Line Numbers</button>
      <div className="console">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default CodeEditor;