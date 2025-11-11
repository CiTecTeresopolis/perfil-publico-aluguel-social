import React, { useRef } from 'react';

const FileUpload = ({ onFileUpload, isLoading }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      onFileUpload(file);
    } else {
      alert('Por favor, selecione um arquivo Excel (.xlsx)');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx"
        style={{ display: 'none' }}
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="upload-button"
      >
        {isLoading ? 'Processando...' : 'Carregar Planilha Excel'}
      </button>
    </div>
  );
};

export default FileUpload;

