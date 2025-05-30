import React, { useState, useEffect } from 'react';
import MemoList from './components/MemoList';
import MemoEditor from './components/MemoEditor';
import './App.css'; 

const App = () => {
  const [memos, setMemos] = useState([]);
  const [selectedMemoId, setSelectedMemoId] = useState(null);

  useEffect(() => {
    const loadedMemos = JSON.parse(localStorage.getItem('memos') || '[]');
    setMemos(loadedMemos);
  }, []);

  const saveMemos = (updatedMemos) => {
    setMemos(updatedMemos);
    localStorage.setItem('memos', JSON.stringify(updatedMemos));
  };

  const handleCreateNewMemo = () => {
    const newMemo = {
      id: Date.now().toString(),
      title: '新しいメモ',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedMemos = [newMemo, ...memos];
    saveMemos(updatedMemos);
    setSelectedMemoId(newMemo.id); 
  };

  const handleSelectMemo = (id) => {
    setSelectedMemoId(id);
  };

  const handleSaveMemo = (updatedMemo) => {
    const updatedMemos = memos.map((memo) =>
      memo.id === updatedMemo.id ? updatedMemo : memo
    );
    saveMemos(updatedMemos);
  };

  const handleDeleteMemo = (id) => {
    const confirmDelete = window.confirm("このメモを削除しますか？");
    if (confirmDelete) {
      const updatedMemos = memos.filter((memo) => memo.id !== id);
      saveMemos(updatedMemos);
      if (selectedMemoId === id) {
        setSelectedMemoId(null);
      }
    }
  };


  const selectedMemo = memos.find((memo) => memo.id === selectedMemoId);

  return (
    <div className="app-container">
      <div className="memo-list-sidebar">
        <button onClick={handleCreateNewMemo} className="create-memo-button">
          メモ作成
        </button>
        <MemoList
          memos={memos}
          selectedMemoId={selectedMemoId}
          onSelectMemo={handleSelectMemo}
          onDeleteMemo={handleDeleteMemo}
        />
      </div>
      <div className="memo-editor-area">
        {selectedMemo ? (
          <MemoEditor selectedMemo={selectedMemo} onSaveMemo={handleSaveMemo} />
        ) : (
          <p className="no-memo-selected">メモを選択するか、新しく作成してください。</p>
        )}
      </div>
    </div>
  );
};

export default App;