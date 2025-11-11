import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import AllCharts from './AllCharts';
import HeatmapLayer from './HeatmapLayer';
import RelatorioModal from './RelatorioModal';
import coordenadas from '../../coordenadas.json';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Bar, Doughnut, Radar, Line } from 'react-chartjs-2';

const SlideContainer = ({ metrics }) => {
  if (!metrics) {
    return null;
  }

  const charts = AllCharts({ metrics });

  // Coordenadas centrais aproximadas de Teresópolis
  const position = [-22.425, -42.966]; 

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra coordenadas.bairros para pegar só os que aparecem em metrics.top_bairros_atingidos
  // e atribui intensidade baseada na contagem de atendimentos
  // const bairrosAtingidos = metrics.top_bairros_atingidos.map(b => b.bairro);
  const totalBairrosAtingidos = metrics.total_bairros_atingidos.map(b => b.bairro);
  const contagemPorBairro = metrics.total_bairros_atingidos.reduce((acc, b) => {
    acc[b.bairro] = b.contagem;
    return acc;
  }, {});
  

  const heatData = coordenadas.bairros
    .filter(b => totalBairrosAtingidos.includes(b.nome))
    .map(b => [b.latitude_aproximada, b.longitude_aproximada, contagemPorBairro[b.nome] || 1]);



  const heatmapOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 14,
      // Gradiente de cores: 0.4 (início do calor) até 1.0 (máximo)
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
  };

  return (
    <div className="slides-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Slide 1 - Métricas de Maturidade Digital */}
      <div className="slide-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="title">Público Atendido - Aluguel Social</div>
        <div className="content">
          <div className="card">
            <p className="mb-4">O Painel do Público Atendido pelo Programa de Aluguel Social tem por objetivo:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Auxiliar na tomada de decisões estratégicas</li>
              <li>Melhorar a transparência das informações sobre o programa</li>
              {/* <li>Infraestrutura e Segurança</li> */}
              {/* <li>Capacitação e Inclusão Digital</li> */}
            </ul>
          </div>
        
          <div className="card">
            <p className="mb-4">As principais métricas geradas são:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>1. Contagem e percentual por faixa etária.</li>
              <li>2. Contagem e percentual por nível de escolaridade.</li>
              <li>3. Total de Beneficiários, Média e Mediana de Idade.</li>
              <li>4. Contagem e percentual de Feminino, Masculino e Não Informado.</li>
              <li>5. Lista com os 3 (três) bairros com maior número de atendimentos.</li>
              <li>6. Contagem e percentual por Centro de Referência de Assistência Social.</li>
            </ul>
          </div>
        </div>
        <div className="footer" style={{color: "#34a853a9", fontWeight:'bold'}}>
          <p>Baseado no Perfil do Público Atendido Pelo Aluguel Social 2025 - Disponível no Portal de Dados Abertos</p>
        </div>
      </div>

      {/* Slide 2 - Métricas Principais */}
      <div className="slide-container">
        <div className="title">Métricas Principais</div>
        <div className="content-row" style={{ display: 'flex', flex: 1 }}>
          
          <div className="w-1-2" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="subtitle">KPIs Principais</div>
            <ul className="kpi-list">
              <li className="kpi-item">
                <i className="fas fa-chart-pie kpi-icon blue"></i>
                <span><span className="highlight">Quantidades de Beneficiários Atendidos:</span> {metrics.total_beneficiarios} Pessoas</span>
              </li>
              <li className="kpi-item">
                <i className="fas fa-tasks kpi-icon purple"></i>
                <span><span className="highlight">{((metrics.distribuicao_por_sexo.Feminino * 100)/metrics.total_beneficiarios).toFixed(2)}% do público</span> atendido é do sexo <span className="highlight">Feminino</span></span>
              </li>
              <li className="kpi-item">
                <i className="fas fa-chart-bar kpi-icon green"></i>
                <span><span className="highlight">{(((metrics.total_beneficiarios - metrics.distribuicao_por_escolaridade['Técnico Completo'] - metrics.distribuicao_por_escolaridade['Superior Incompleto'] - metrics.distribuicao_por_escolaridade['Superior Completo'] - metrics.distribuicao_por_escolaridade['Protegido'] - metrics.distribuicao_por_escolaridade['Médio Completo'])*100) / 654).toFixed(0)}% dos Beneficiários </span> não possuem ensino médio completo</span>
              </li>
              <li className="kpi-item">
                <i className="fas fa-exclamation-triangle kpi-icon red"></i>
                <span><span className="highlight">{metrics.top_bairros_atingidos[0].bairro}</span> é o bairro com maior número de beneficiários, tendo <span className="highlight">{metrics.top_bairros_atingidos[0].contagem} beneficiários</span></span>
              </li>
            </ul>
          </div>
        </div>
        <button onClick={()=>{setIsModalOpen(true)}} className='button-result'>Resultado das Métricas</button>
      </div>
      <RelatorioModal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
      />

      {/* Slide 3 - Dashboard Categórico (Sexo, Escolaridade, CRAS) */}
      <div className="slide-container">
        <div className="title">Distribuição Categórica</div>
        <div className="content-row">
          <div className="w-1-2">
            <div className="subtitle">Distribuição por Sexo</div>
            <div className="chart-container gauge-container" style={{ flex: 1, maxHeight: 500 }}>
              <Doughnut data={charts.donutChart.data} options={charts.donutChart.options} />
            </div>
            <div className="mt-4">
              <p><span className="highlight">Informação:</span> 72,63% dos beneficiários são mulheres</p>
              <p className="mt-2"><span className="highlight">Implicação:</span> Predomínio de mulheres chefes de família, o que reforça a necessidade de políticas de proteção social voltadas para mulheres em situação de vulnerabilidade.</p>
            </div>
          </div>
          <div className="w-1-2">
            <div className="subtitle">Porcentagem por Escolaridade</div>
            <div className="chart-container" style={{ flex: 1, maxHeight: 500 }}>
              <Bar data={charts.horizontalBarChart.data} options={charts.horizontalBarChart.options} />
            </div>
            <div className="mt-4">
              <p><span className="highlight">Informação:</span> 79% não possuem ensino médio completo</p>
              <p className="mt-2"><span className="highlight">Implicação:</span> A baixa escolaridade limita o acesso ao mercado de trabalho formal, aumentando a dependência de políticas sociais e exigindo integração com programas de qualificação profissional.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 4 - Dashboard Operacional */}
      <div className="slide-container">
        <div className="title">Distribuição Numérica (Idade)</div>
        <div className="content-row">
          <div className="w-1-2">
            <div className="subtitle">Distribuição por Faixa Etária</div>
            <div className="chart-container" style={{ flex: 1, maxHeight: 500 }}>
              <Bar data={charts.faixaEtariaChart.data} options={charts.faixaEtariaChart.options} />
            </div>
            <div className="mt-4">
              <p className="mt-2"><span className="highlight">Implicação:</span> A idade média é de 49,38 anos, indicando um público adulto em idade produtiva, mas com desafios de inserção laboral. Há também a presença de idosos (faixa 66+), que demandam políticas de saúde e cuidados.</p>
            </div>
          </div>
          <div className="w-1-2">
            <div className="subtitle"></div>
            <div className="step-item">
            </div>
            <div className="step-item">
              <div className="step-number">1</div>
              <p style={{marginTop: 5}}>Média de Idade <span className="highlight">{metrics.media_idade}</span></p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <p style={{marginTop: 5}}>Mediana de Idade <span className="highlight">{metrics.mediana_idade}</span></p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Slide 5 - Dashboard Estratégico */}
      <div className="slide-container">
        <div className="title">Distribuição Geográfica</div>
        <div className="content-row">
          <div className="w-1-2">
            <div className="subtitle">Bairros com mais Beneficiários</div>
            <div className="chart-container" style={{ flex: 1, maxHeight: 500 }}>
              <Bar data={charts.bairrosChart.data} options={charts.bairrosChart.options} />
            </div>
            <div className="mt-4">
              <p><span className="highlight">Informação:</span> A maior concentração de beneficiários está no bairro Rosário (106 beneficiários), seguido por Santa Cecília e Meudon.</p>
            </div>
          </div>
          <div className="w-1-2">
            <div className="subtitle">Distribuição por Bairro</div>
            <div className="chart-container" style={{ flex: 1, maxHeight: 500}}>
              <MapContainer center={position} zoom={12} style={{ height: 260, width: '100%'}}>
                {/* Camada base do mapa (OpenStreetMap) */}
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Camada de Heatmap usando o componente wrapper */}
                <HeatmapLayer
                  points={heatData}
                  options={heatmapOptions}
                />
              </MapContainer>
              
            </div>
            <div className="mt-4">
              <p className="mt-2"><span className="highlight">Implicação:</span> Mostra que há territórios prioritários para intervenção, onde a vulnerabilidade habitacional é mais intensa.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="slide-container">
        <div className="title">Distribuição por Equipamento</div>
        <div className="content-row">
           <div className="chart-container" style={{ flex: 1, maxHeight: 1000 }}>
              <Bar data={charts.CrasChart.data} options={charts.CrasChart.options} />
            </div>
        </div>
        <div className="mt-4">
          <p><span className="highlight">Informação:</span> Os CRAS Barroso, Alto e São Pedro concentram o maior atendimento. 
          Indicando que a rede socioassistencial já atua fortemente nesses territórios, mas precisa de reforço (ampliação de equipes e serviços) para dar conta da demanda.</p>
        </div>
      </div>

      {/* Slide 6 - Tomada de Decisão */}
      <div className="slide-container">
        <div className="title">Tomada de Decisão</div>
        <div className="content-row">
          <div className="w-1-2">
            <div className="subtitle">Aplicações Práticas</div>
            <div className="decision-item blue-bg">
              <div className="icon-container blue-icon">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold">Decisões Estratégicas</p>
                <p>Definição de prioridades de investimento em políticas públicas</p>
              </div>
            </div>
            <div className="decision-item green-bg">
              <div className="icon-container green-icon">
                <i className="fas fa-tasks text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold">Decisões Táticas</p>
                <p>Alocação de recursos e planejamento de implementações</p>
              </div>
            </div>
            <div className="decision-item yellow-bg">
              <div className="icon-container yellow-icon">
                <i className="fas fa-cogs text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold">Decisões Operacionais</p>
                <p>Monitoramento para acompanhamento diário e resolução de problemas</p>
              </div>
            </div>
            <div className="decision-item red-bg">
              <div className="icon-container red-icon">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold">Comunicação com Cidadãos</p>
                <p>Informações públicas para transparência e engajamento da comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SlideContainer;

