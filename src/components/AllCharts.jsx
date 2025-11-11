import React from 'react';
import {
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
  RadialLinearScale,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const AllCharts = ({ metrics }) => {
  // Guarda a última barra clicada (datasetIndex + index) para filtrar tooltip
  const lastActiveRef = React.useRef(null);

  if (!metrics) {
    return <div>Carregue uma planilha para visualizar as métricas</div>;
  }

  // const dimensionNames = Object.keys(metrics.dimensoes);
  // const dimensionScores = dimensionNames.map(name => 
  //   metrics.dimensoes[name].pontuacao_atingida
  // );
  // const dimensionMaxScores = dimensionNames.map(name => 
  //   metrics.dimensoes[name].pontuacao_max
  // );

  const faixasEtarias = Object.keys(metrics.faixa_etaria);
  const cras = Object.keys(metrics.distribuicao_por_cras);
  // (substituído abaixo por união entre atingidos e atuais)

  
const chavesParaRemover = [
    "Protegido", 
    "Alfabetizado sem escolaridade formal", 
    "EJA - Fundamental", 
    "EJA - Médio", 
    "Médio Incompleto", 
    "Não Alfabetizado",
    "Superior Completo",
    "Superior Incompleto",
    "Técnico Completo"
];

const dadosOriginais = metrics.distribuicao_por_escolaridade || {}; 

const filtroEscolaridade = Object.keys(dadosOriginais).reduce((acc, key) => {
    if (!chavesParaRemover.includes(key)) {
        acc[key] = dadosOriginais[key];
    }
    return acc;
}, {});

const escolaridades = Object.keys(filtroEscolaridade);

  // Reduzir somente para  as categorias relevantes
  // const calcularPorcentagensEscolaridadeArray = () => {
  //  const escolaridadeValores = Object.values(metrics.distribuicao_por_escolaridade);
  // const porcentagensArray = escolaridadeValores.map(contagem => {
  //   const porcentagem = (contagem / (metrics.total_beneficiarios - metrics.distribuicao_por_escolaridade.Protegido)) * 100;
  //   return porcentagem.toFixed(2);
  // });

  //   return porcentagensArray;
  // }

  const calcularPorcentagensEscolaridadeArray = () => {
    const filtroEscolaridade = Object.keys(dadosOriginais).reduce((acc, key) => {
        if (!chavesParaRemover.includes(key)) {
            acc[key] = dadosOriginais[key];
        }
        return acc;
    }, {});
    
    const escolaridadeValores = Object.values(filtroEscolaridade);
    const novoTotal = escolaridadeValores.reduce((soma, contagem) => soma + contagem, 0);

    const porcentagensArray = escolaridadeValores.map(contagem => {
        if (novoTotal === 0) return "0.00"; 
        const porcentagem = (contagem / novoTotal) * 100;
        return porcentagem.toFixed(2);
    });

    return porcentagensArray;
  }


    //  CRAS Chart (Slide 2)
  const CrasChartData = {
    labels: cras,
    datasets: [
      {
        label: '',
        data: Object.values(metrics.distribuicao_por_cras),
        backgroundColor: '#FBBC04',
        borderColor: '#FBBC04',
        borderWidth: 1
      }
    ]
  };

  const CrasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2ecc71',
        borderWidth: 1,
        // Filtra os itens do tooltip para exibir apenas o item clicado
        filter: function(tooltipItem) {
          if (!lastActiveRef.current) return true;
          const active = lastActiveRef.current;
          const tDataset = tooltipItem.datasetIndex;
          const tIndex = tooltipItem.dataIndex ?? tooltipItem.index;
          return tDataset === active.datasetIndex && tIndex === active.index;
        },
        callbacks: {
          label: function(context) {
            return `Atendimentos: ${context.parsed.y.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // max: maxValue + 21,
        grid: {
          color: 'rgba(0,0,0,0.08)'
        },
        ticks: {
          color: '#555',
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#555',
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
    // Use 'nearest' + intersect to ensure tooltip shows only the single
    // bar that was clicked/hovered instead of all datasets at the same index.
    interaction: {
      intersect: true,
      mode: 'nearest'
    }
  };


  // Faixa Etária Chart (Slide 2)
  const faixaEtariaChartData = {
    labels: faixasEtarias,
    datasets: [
      {
        label: '',
        data: Object.values(metrics.faixa_etaria),
        backgroundColor: '#34A853',
        borderColor: '#34A853',
        borderWidth: 1
      }
    ]
  };

  const faixaEtariaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2ecc71',
        borderWidth: 1,
        // Filtra os itens do tooltip para exibir apenas o item clicado
        filter: function(tooltipItem) {
          if (!lastActiveRef.current) return true;
          const active = lastActiveRef.current;
          const tDataset = tooltipItem.datasetIndex;
          const tIndex = tooltipItem.dataIndex ?? tooltipItem.index;
          return tDataset === active.datasetIndex && tIndex === active.index;
        },
        callbacks: {
          label: function(context) {
            return `Atendimentos: ${context.parsed.y.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // max: maxValue + 21,
        grid: {
          color: 'rgba(0,0,0,0.08)'
        },
        ticks: {
          color: '#555',
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#555',
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
    // Use 'nearest' + intersect to ensure tooltip shows only the single
    // bar that was clicked/hovered instead of all datasets at the same index.
    interaction: {
      intersect: true,
      mode: 'nearest'
    }
  };

    
  const bairrosAtingidosArr = metrics.top_bairros_atingidos.map(b => b.bairro);
  const bairrosAtuaisArr = metrics.top_bairros_atuais.map(b => b.bairro);

    const mapAtingidos = metrics.top_bairros_atingidos.reduce((acc, curr) => {
      acc[curr.bairro] = curr.contagem;
      return acc;
    }, {});

    const mapAtuais = metrics.top_bairros_atuais.reduce((acc, curr) => {
      acc[curr.bairro] = curr.contagem;
      return acc;
    }, {});

    // Labels com prefixo para deixar a origem explícita
    const labelsAtingidosPref = bairrosAtingidosArr.map(b => `Atingidos: ${b}`);
    const labelsAtuaisPref = bairrosAtuaisArr.map(b => `Atuais: ${b}`);

    // Inserimos um separador vazio entre os dois grupos para criar uma divisão visual
    const separator = [''];
    const labelsCombined = [...labelsAtingidosPref, ...separator, ...labelsAtuaisPref];

    // Dados alinhados: Atingidos preenchem a primeira parte, Atuais a segunda
    const dataAtingidosAligned = [
      ...bairrosAtingidosArr.map(b => mapAtingidos[b] || 0),
      0, // separador
      ...bairrosAtuaisArr.map(() => 0)
    ];

    const dataAtuaisAligned = [
      ...bairrosAtingidosArr.map(() => 0),
      0, // separador
      ...bairrosAtuaisArr.map(b => mapAtuais[b] || 0)
    ];

    const bairrosChartData = {
      labels: labelsCombined,
      datasets: [
        {
          label: 'Atingidos',
          data: dataAtingidosAligned,
          backgroundColor: '#FBBC04',
          borderColor: '#FBBC04',
          borderWidth: 1
        },
        {
          label: 'Atuais',
          data: dataAtuaisAligned,
          backgroundColor: '#1A73E8',
          borderColor: '#1A73E8',
          borderWidth: 1
        }
      ]
  };

  const bairrosOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2ecc71',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Atendimentos: ${context.parsed.y.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // max: maxValue + 21,
        grid: {
          color: 'rgba(0,0,0,0.08)'
        },
        ticks: {
          color: '#555',
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#555',
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
    interaction: {
      intersect: true,
      mode: 'nearest'
    }
  };

  // Ao clicar em uma barra, não ocultamos outras barras — em vez disso
  // ativamos apenas o elemento clicado para que o tooltip mostre somente
  // os dados daquele grupo. Clicar no separador ou fora limpa a seleção.
  bairrosOptions.onClick = (evt, elements, chart) => {
    try {
      // Sem elemento ativo => limpar seleção/tooltip
      if (!elements || elements.length === 0) {
        chart.setActiveElements([]);
        lastActiveRef.current = null;
        chart.update();
        return;
      }

      const el = elements[0];
      const idx = el.index;
      const label = chart.data.labels[idx] || '';

      // separador vazio => limpar seleção
      if (label === '') {
        chart.setActiveElements([]);
        lastActiveRef.current = null;
        chart.update();
        return;
      }

      // Ativar apenas o elemento clicado (datasetIndex e index)
      const active = [{ datasetIndex: el.datasetIndex, index: el.index }];
      if (chart.setActiveElements) {
        chart.setActiveElements(active);
      }
      // gravar referência ao item clicado para filtrar tooltip
      lastActiveRef.current = active[0];

      // Também setamos os elementos do tooltip (API disponível em Chart.js mais recentes)
      if (chart.tooltip && chart.tooltip.setActiveElements) {
        chart.tooltip.setActiveElements(active, { x: evt.x, y: evt.y });
      }

      chart.update();
    } catch {
      // Silenciar erros e não quebrar o app
    }
  };

  // Gauge Chart (Slide 3)
  // const gaugeChartData = {
  //   labels: ['Atingido', 'Restante'],
  //   datasets: [{
  //     data: [metrics.indice_geral_maturidade, 100 - metrics.indice_geral_maturidade],
  //     backgroundColor: ['#34A853', '#F8F9FA'],
  //     borderWidth: 0,
  //     circumference: 180,
  //     rotation: 270
  //   }]
  // };

  // const gaugeOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   cutout: '75%',
  //   plugins: {
  //     legend: { display: false },
  //     tooltip: { enabled: false }
  //   }
  // };


  const horizontalBarData = {
    labels: escolaridades,
    datasets: [{
      label: '%',
      data: calcularPorcentagensEscolaridadeArray(),
      backgroundColor: calcularPorcentagensEscolaridadeArray().map(p => 
        p === 100 ? '#34A853' : p >= 90 ? '#1A73E8' : '#FBBC04'
      ),
      borderColor: calcularPorcentagensEscolaridadeArray().map(p => 
        p === 100 ? '#34A853' : p >= 90 ? '#1A73E8' : '#FBBC04'
      ),
      borderWidth: 1
    }]
  };

  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Porcentagem por Escolaridade' }
    },
    scales: {
      x: { beginAtZero: true, max: 100, title: { display: true, text: 'Porcentagem (%)' } },
      y: { title: { display: false, text: '' } }
    }
  };

  // // Radar Chart (Slide 4)
  // const radarData = {
  //   labels: ['Serviços Públicos', 'Governança', 'Infraestrutura', 'Capacitação'],
  //   datasets: [
  //     {
  //       label: 'Performance Atual',
  //       data: dimensionPercentages,
  //       fill: true,
  //       backgroundColor: 'rgba(26, 115, 232, 0.2)',
  //       borderColor: '#1A73E8',
  //       pointBackgroundColor: '#1A73E8',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: '#1A73E8'
  //     },
  //     {
  //       label: 'Meta',
  //       data: [100, 100, 100, 100],
  //       fill: true,
  //       backgroundColor: 'rgba(52, 168, 83, 0.2)',
  //       borderColor: '#34A853',
  //       pointBackgroundColor: '#34A853',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: '#34A853'
  //     }
  //   ]
  // };

  // const radarOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   elements: { line: { borderWidth: 3 } },
  //   scales: {
  //     r: {
  //       angleLines: { display: true },
  //       suggestedMin: 0,
  //       suggestedMax: 100
  //     }
  //   }
  // };

 
  // Donut Chart (Slide 4)
  const donutData = {
    labels: ['Masculino', 'Feminino'],
    datasets: [{
      data: [metrics.distribuicao_por_sexo.Masculino, metrics.distribuicao_por_sexo.Feminino],
      backgroundColor: ['#1A73E8', '#9935ea'],
      hoverOffset: 4
    }]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom' },
      title: {display: true, text: `Total: ${metrics.distribuicao_por_sexo.Masculino + metrics.distribuicao_por_sexo.Feminino}`}
    }
  };

  // // Waterfall Chart (Slide 5)
  // const waterfallData = {
  //   labels: ['Total Possível', 'Dimensão 3 Gap', 'Dimensão 4 Gap', 'Total Atingido'],
  //   datasets: [
  //     {
  //       label: 'Pontuação Base',
  //       data: [metrics.total_pontuacao_max, 0, 0, metrics.total_pontuacao_atingida],
  //       backgroundColor: '#1A73E8',
  //       stack: 'Stack 0'
  //     },
  //     {
  //       label: 'Gap Dimensão 3',
  //       data: [0, metrics.dimensoes['Dimensão 3'].pontuacao_max - metrics.dimensoes['Dimensão 3'].pontuacao_atingida, 0, 0],
  //       backgroundColor: '#EA4335',
  //       stack: 'Stack 0'
  //     },
  //     {
  //       label: 'Gap Dimensão 4',
  //       data: [0, 0, metrics.dimensoes['Dimensão 4'].pontuacao_max - metrics.dimensoes['Dimensão 4'].pontuacao_atingida, 0],
  //       backgroundColor: '#FBBC04',
  //       stack: 'Stack 0'
  //     }
  //   ]
  // };

  // const waterfallOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: { display: true, text: 'Análise de Gaps por Dimensão' },
  //     legend: { position: 'top' }
  //   },
  //   scales: {
  //     y: { beginAtZero: true, title: { display: true, text: 'Pontuação' } }
  //   }
  // };

  // // Heatmap Chart (Slide 5) - Simplified as stacked bar
  // const heatmapData = {
  //   labels: dimensionNames,
  //   datasets: [
  //     {
  //       label: 'Implementados',
  //       data: indicadoresImplementados, // Estimate indicators
  //       backgroundColor: '#34A853',
  //       borderColor: '#34A853',
  //       borderWidth: 1
  //     },
  //     {
  //       label: 'Pendentes',
  //       data: indicadoresPendentes,
  //       backgroundColor: '#EA4335',
  //       borderColor: '#EA4335',
  //       borderWidth: 1
  //     }
  //   ]
  // };

  // const heatmapOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: { display: true, text: 'Matriz de Indicadores por Dimensão' },
  //     legend: { position: 'top' }
  //   },
  //   scales: {
  //     x: { stacked: true, title: { display: true, text: 'Dimensões' } },
  //     y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Número de Indicadores' } }
  //   }
  // };

  // // Line Chart (Slide 6)
  // const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  // const lineData = {
  //   labels: meses,
  //   datasets: [
  //     {
  //       label: 'Índice Geral',
  //       data: [85, 87, 90, 92, 93, metrics.indice_geral_maturidade],
  //       borderColor: '#1A73E8',
  //       backgroundColor: 'rgba(26, 115, 232, 0.1)',
  //       tension: 0.3,
  //       fill: true
  //     },
  //     {
  //       label: 'Meta',
  //       data: [85, 88, 91, 94, 97, 100],
  //       borderColor: '#34A853',
  //       borderDash: [5, 5],
  //       fill: false
  //     }
  //   ]
  // };

  // const lineOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: { display: true, text: 'Evolução do Índice de Maturidade Digital' }
  //   },
  //   scales: {
  //     y: { beginAtZero: false, min: 80, max: 100, title: { display: true, text: 'Índice (%)' } },
  //     x: { title: { display: true, text: 'Meses' } }
  //   }
  // };

  // // Stacked Area Chart (Slide 6)
  // const stackedAreaData = {
  //   labels: meses,
  //   datasets: [
  //     {
  //       label: 'Dimensão 1',
  //       data: [38, 39, 40, 40, 41, metrics.dimensoes['Dimensão 1'].pontuacao_atingida],
  //       backgroundColor: '#1A73E8',
  //       borderColor: '#1A73E8',
  //       fill: true
  //     },
  //     {
  //       label: 'Dimensão 2',
  //       data: [45, 46, 47, 48, 49, metrics.dimensoes['Dimensão 2'].pontuacao_atingida],
  //       backgroundColor: '#34A853',
  //       borderColor: '#34A853',
  //       fill: true
  //     },
  //     {
  //       label: 'Dimensão 3',
  //       data: [12, 13, 14, 15, 16, metrics.dimensoes['Dimensão 3'].pontuacao_atingida],
  //       backgroundColor: '#FBBC04',
  //       borderColor: '#FBBC04',
  //       fill: true
  //     },
  //     {
  //       label: 'Dimensão 4',
  //       data: [10, 11, 12, 13, 14, metrics.dimensoes['Dimensão 4'].pontuacao_atingida],
  //       backgroundColor: '#EA4335',
  //       borderColor: '#EA4335',
  //       fill: true
  //     }
  //   ]
  // };

  // const stackedAreaOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: { display: true, text: 'Contribuição de Cada Dimensão ao Longo do Tempo' }
  //   },
  //   scales: {
  //     y: { stacked: true, title: { display: true, text: 'Pontuação' } },
  //     x: { title: { display: true, text: 'Meses' } }
  //   }
  // };

  // // Decision Pyramid (Slide 7)
  // const decisionPyramidData = {
  //   labels: ['Estratégico', 'Tático', 'Operacional'],
  //   datasets: [
  //     {
  //       label: 'Níveis de Decisão',
  //       data: [3, 2, 1],
  //       backgroundColor: [
  //         '#1A73E8',
  //         '#34A853',
  //         '#FBBC04'
  //       ],
  //       borderColor: [
  //         '#1A73E8',
  //         '#34A853',
  //         '#FBBC04'
  //       ],
  //       borderWidth: 1
  //     }
  //   ]
  // };

  // const decisionPyramidOptions = {
  //   indexAxis: 'y',
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { display: false },
  //     title: { display: true, text: 'Pirâmide de Decisão' }
  //   },
  //   scales: {
  //     x: {
  //       beginAtZero: true,
  //       max: 3,
  //       ticks: {
  //         callback: function(value) {
  //           if (value === 1) return 'Curto Prazo';
  //           if (value === 2) return 'Médio Prazo';
  //           if (value === 3) return 'Longo Prazo';
  //           return '';
  //         }
  //       }
  //     },
  //     y: { title: { display: true, text: 'Níveis' } }
  //   }
  // };

  return {
    faixaEtariaChart: { data: faixaEtariaChartData, options: faixaEtariaOptions },
    bairrosChart: { data: bairrosChartData, options: bairrosOptions },
    // gaugeChart: { data: gaugeChartData, options: gaugeOptions },
    horizontalBarChart: { data: horizontalBarData, options: horizontalBarOptions },
    CrasChart: { data: CrasChartData, options: CrasOptions },
    // radarChart: { data: radarData, options: radarOptions },
    donutChart: { data: donutData, options: donutOptions },
    // waterfallChart: { data: waterfallData, options: waterfallOptions },
    // heatmapChart: { data: heatmapData, options: heatmapOptions },
    // lineChart: { data: lineData, options: lineOptions },
    // stackedAreaChart: { data: stackedAreaData, options: stackedAreaOptions },
    // decisionPyramid: { data: decisionPyramidData, options: decisionPyramidOptions }
  };
};

export default AllCharts;

