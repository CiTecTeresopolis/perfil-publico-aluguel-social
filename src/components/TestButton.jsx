import React from 'react';

const TestButton = ({ onLoadSampleData }) => {
  const sampleMetrics = {
    total_pontuacao_max: 130.0,
    total_pontuacao_atingida: 123.0,
    dimensoes: {
      "Dimensão 1": {
        pontuacao_max: 41.0,
        pontuacao_atingida: 41.0
      },
      "Dimensão 2": {
        pontuacao_max: 50.0,
        pontuacao_atingida: 50.0
      },
      "Dimensão 3": {
        pontuacao_max: 22.0,
        pontuacao_atingida: 17.0
      },
      "Dimensão 4": {
        pontuacao_max: 17.0,
        pontuacao_atingida: 15.0
      }
    },
    indice_geral_maturidade: 94.61538461538461
  };

  const handleClick = () => {
    onLoadSampleData(sampleMetrics);
  };

  return (
    <button
      onClick={handleClick}
      className="test-button"
      style={{
        marginLeft: '1rem',
        background: '#34A853',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)'
      }}
    >
      Carregar Dados de Exemplo
    </button>
  );
};

export default TestButton;

