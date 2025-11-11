import React from 'react';

const KPICards = ({ metrics }) => {
  if (!metrics || !metrics.dimensoes) {
    return null;
  }

  const dimensionNames = Object.keys(metrics.dimensoes);
  const dimensionsWithMaxPerformance = dimensionNames.filter(name => 
    metrics.dimensoes[name].pontuacao_atingida === metrics.dimensoes[name].pontuacao_max
  ).length;

  const minPerformance = Math.min(...dimensionNames.map(name => 
    (metrics.dimensoes[name].pontuacao_atingida / metrics.dimensoes[name].pontuacao_max) * 100
  ));
  const maxPerformance = Math.max(...dimensionNames.map(name => 
    (metrics.dimensoes[name].pontuacao_atingida / metrics.dimensoes[name].pontuacao_max) * 100
  ));

  // Estimate total indicators (rough calculation)
  const totalPossibleIndicators = 23; // Based on the original data
  const implementedIndicators = Math.round((metrics.total_pontuacao_atingida / metrics.total_pontuacao_max) * totalPossibleIndicators);

  return (
    <div className="kpi-section">
      <div className="subtitle">KPIs Principais</div>
      <ul className="kpi-list">
        <li className="kpi-item">
          <i className="fas fa-chart-pie kpi-icon blue"></i>
          <span><span className="highlight">Índice Geral de Maturidade Digital:</span> {metrics.indice_geral_maturidade.toFixed(2)}% ({metrics.total_pontuacao_atingida}/{metrics.total_pontuacao_max} pontos)</span>
        </li>
        <li className="kpi-item">
          <i className="fas fa-chart-bar kpi-icon green"></i>
          <span><span className="highlight">Taxa de Implementação por Dimensão:</span> Variação de {minPerformance.toFixed(2)}% a {maxPerformance.toFixed(2)}%</span>
        </li>
        <li className="kpi-item">
          <i className="fas fa-exclamation-triangle kpi-icon yellow"></i>
          <span><span className="highlight">Pontos de Melhoria Identificados:</span> {metrics.total_pontuacao_max - metrics.total_pontuacao_atingida} pontos ({((metrics.total_pontuacao_max - metrics.total_pontuacao_atingida) / metrics.total_pontuacao_max * 100).toFixed(2)}% do total)</span>
        </li>
        <li className="kpi-item">
          <i className="fas fa-trophy kpi-icon red"></i>
          <span><span className="highlight">Dimensões com Performance Máxima:</span> {dimensionsWithMaxPerformance} de {dimensionNames.length} ({((dimensionsWithMaxPerformance / dimensionNames.length) * 100).toFixed(0)}%)</span>
        </li>
        <li className="kpi-item">
          <i className="fas fa-tasks kpi-icon purple"></i>
          <span><span className="highlight">Indicadores Implementados:</span> {implementedIndicators} de {totalPossibleIndicators} ({((implementedIndicators / totalPossibleIndicators) * 100).toFixed(1)}%)</span>
        </li>
      </ul>
    </div>
  );
};

export default KPICards;

