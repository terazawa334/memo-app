import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MemoEditor = ({ selectedMemo, onSaveMemo }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const contentTextAreaRef = useRef(null);

  useEffect(() => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      setContent(selectedMemo.content);
    } else {
      setTitle('');
      setContent('');
    }
    setSearchTerm('');
    setAiResult('');
  }, [selectedMemo]);

  const handleSave = () => {
    if (selectedMemo) {
      onSaveMemo({ ...selectedMemo, title, content, updatedAt: new Date().toISOString() });
    } else {
      onSaveMemo({
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleTextSelect = () => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);

    if (selectedText.trim()) {
      setSearchTerm(selectedText.trim());
      handleSearchWord(selectedText.trim());
    }
  };

  const handleSearchWord = async (wordToSearch = searchTerm) => {
    if (!wordToSearch.trim()) {
      setAiResult('検索する単語を入力してください。');
      return;
    }

    setIsLoadingAi(true);
    setAiResult('AIが検索中です...');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `「python3エンジニア認定基礎試験出題範囲の${wordToSearch}」について、重要な部分を簡潔に説明してください。`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setAiResult(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiResult('AI検索中にエラーが発生しました。');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="memo-editor">
      <div className="memo-editor-content">
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="memo-title-input"
        />
        <textarea
          placeholder="メモの内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onMouseUp={handleTextSelect}
          ref={contentTextAreaRef}
          className="memo-content-textarea"
        ></textarea>
        <button onClick={handleSave} className="save-button">保存</button>
      </div>

      <div className="ai-search-panel"> 
        <h3>AI単語検索</h3>
        <input
          type="text"
          placeholder="検索する単語"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-term-input"
        />
        <button onClick={() => handleSearchWord()} disabled={isLoadingAi} className="ai-search-button">
          {isLoadingAi ? '検索中...' : 'AIで検索'}
        </button>
        {aiResult && (
          <div className="ai-result-box">
            <h4>検索結果:</h4>
            <p>{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoEditor;