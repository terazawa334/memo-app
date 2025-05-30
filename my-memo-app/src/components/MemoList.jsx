import React from 'react';

const MemoList = ({ memos, selectedMemoId, onSelectMemo, onDeleteMemo }) => {
  return (
    <div className="memo-list">
      {memos.length === 0 ? (
        <p className="no-memos">まだメモがありません。</p>
      ) : (
        <ul>
          {memos.map((memo) => (
            <li
              key={memo.id}
              className={`memo-list-item ${memo.id === selectedMemoId ? 'selected' : ''}`}
              onClick={() => onSelectMemo(memo.id)}
            >
              <div className="memo-item-content">
                <span className="memo-title">{memo.title || '無題のメモ'}</span>
                <span className="memo-date">{new Date(memo.updatedAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 親要素のクリックイベントが発火しないようにする
                  onDeleteMemo(memo.id);
                }}
                className="delete-memo-button"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemoList;