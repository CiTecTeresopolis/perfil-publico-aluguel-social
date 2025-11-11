import React, {useEffect} from 'react';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Estilização Básica (pode ser movida para um arquivo CSS) ---
Modal.setAppElement('#root'); // Substitua #root pelo ID do seu elemento raiz

const modalStyle = {
    overlay: {
    // Fundo preto (rgba) com 80% de opacidade
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000 // Garante que o fundo cubra todo o conteúdo da página
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1000px', // Limita a largura máxima
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.555)',
    borderRadius: '8px',
    backgroundColor: "white"
  },
};

const pdfButtonStyle = {
    background: '#00A6ED',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '16px'
};

const closeButtonStyle = {
    background: '#f1f1f1',
    border: '1px solid #ccc',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '14px'
};

const thStyle = {
    backgroundColor: '#34A853',
    color: 'white',
    padding: '12px 8px',
    textAlign: 'left',
    border: '1px solid #ddd'
};

const tdStyle = {
    padding: '10px 8px',
    border: '1px solid #ddd',
    verticalAlign: 'top',
};
// -----------------------------------------------------------------

const RelatorioModal = ({ isOpen, onRequestClose }) => {

    useEffect(() => {
    if (isOpen) {
      // Desabilita o scroll da página principal
      document.body.style.overflow = 'hidden';
    } else {
      // Restaura o scroll da página principal ao fechar
      document.body.style.overflow = 'unset'; 
    }

    // Função de limpeza: garante que o scroll é restaurado 
    // se o componente for desmontado enquanto o modal estiver aberto
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const exportToPdf = () => {
    const input = document.getElementById('relatorio-content');
    if (!input) return;

    html2canvas(input, { scale: 2, logging: true, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4'); 
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Checa se o conteúdo é maior que uma página A4 e usa um loop se for o caso
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('Relatorio_Aluguel_Social_Teresopolis.pdf');
    });
  };

  // --- Conteúdo do Relatório LIMPO e FORMATADO, incluindo a tabela ---
  const relatorioContent = (
    <div id="relatorio-content" style={{ padding: 30, backgroundColor: '#fff', color: '#333' }}>
      
      <h2 style={{ color: '#128C7E', borderBottom: '2px solid #128C7E', textAlign: "center" }}>
          Principais Resultados dos Indicadores (Aluguel Social)
      </h2>
      <p className='paragrafo-modal'>
        O <span className="highlight2">Aluguel Social em Teresópolis</span> é mais que um subsídio habitacional: é uma política de proteção social que assegura o direito de morar com segurança. 
        O Total é de <span className="highlight2">654 pessoas</span> atendidas, representando uma demanda significativa e contínua por moradia segura.
      </p>

      <h2 style={{ color: '#128C7E', marginTop: 30 }}>Perfil dos Beneficiários</h2>
      <hr style={{ borderColor: '#ccc' }} />

      <section style={{ marginBottom: 20, marginTop: 20 }}>
        <h3 style={{ color: '#3c4043' }}>Foco em Mulheres</h3>
         <p className='paragrafo-modal'>
            <span className="highlight2">72,63%</span> dos beneficiários são <span className="highlight2">mulheres</span>.
            Predomínio de mulheres chefes de família, o que reforça a necessidade de políticas de proteção social voltadas para mulheres em situação de vulnerabilidade.
         </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#3c4043' }}>Escolaridade e Inserção Laboral</h3>
        <p className='paragrafo-modal'>
            <ul>
                <li>
                    <span className="highlight2">79% não possuem ensino médio completo.</span>
                </li>
                <li>
                    Implicação: A baixa escolaridade limita o acesso ao mercado de trabalho formal, aumentando a dependência de políticas sociais e exigindo integração com programas de qualificação profissional.
                </li>
                <li>
                    A <span className="highlight2">idade média é de 49,38 anos</span>, indicando um <span className="highlight2">público adulto</span> em idade produtiva, mas com desafios de inserção laboral. Há também a presença de idosos (faixa 66+), que demandam políticas de saúde e cuidados.
                </li>
            </ul>
        </p>
      </section>

      <h2 style={{ color: '#128C7E', marginTop: '30px' }}>Territórios Prioritários e Rede de Apoio</h2>
      <hr style={{ borderColor: '#ccc' }} />

      <section style={{ marginBottom: 20, marginTop: 20 }}>
        <h3 style={{ color: '#3c4043' }}>Distribuição Geográfica</h3>
         <p className='paragrafo-modal'>
            <ul>
                <li>
                    A maior concentração de beneficiários está no bairro <span className="highlight2">Rosário (106 beneficiários)</span>, seguido por <span className="highlight2">Santa Cecília e Meudon</span>.
                </li>
                <li>
                    Implicação: Mostra que há territórios prioritários para intervenção, onde a vulnerabilidade habitacional é mais intensa.
                </li>
            </ul>
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#3c4043' }}>Equipamentos de Referência (CRAS/CREAS)</h3>
         <p className='paragrafo-modal'>
            
                Os <span className="highlight2">CRAS Barroso, Alto e São Pedro</span> concentram o maior atendimento. Indicando que a rede socioassistencial já atua fortemente nesses territórios, mas precisa de reforço (ampliação de equipes e serviços) para dar conta da demanda.
           
        </p>
      </section>

      <h2 style={{ color: '#128C7E', marginTop: '30px' }}>Quadro Estratégico - Programa Aluguel Social (Teresópolis, outubro/2025)</h2>
      <hr style={{ borderColor: '#ccc' }} />

      {/* Tabela de Indicadores (Quadro Estratégico) */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Indicador</th>
            <th style={thStyle}>Achado Principal</th>
            <th style={thStyle}>Implicações Sociais</th>
            <th style={thStyle}>Ações Prioritárias (SUAS/Políticas Municipais)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Sexo</td>
            <td style={tdStyle}>72,6% mulheres</td>
            <td style={tdStyle}>Predomínio de mulheres chefes de família, muitas vezes em situação de vulnerabilidade.</td>
            <td style={tdStyle}>- Fortalecer programas de apoio a mulheres e mães solo<br/>- Ampliar acesso a creches e serviços de proteção contra violência doméstica.</td>
          </tr>
          <tr>
            <td style={tdStyle}>Escolaridade</td>
            <td style={tdStyle}>79% sem ensino médio completo</td>
            <td style={tdStyle}>Baixa escolaridade limita inserção no mercado formal e aumenta dependência de benefícios.</td>
            <td style={tdStyle}>- Parcerias com EJA e cursos profissionalizantes<br/>- Programas de capacitação vinculados ao mercado local (turismo, serviços, construção civil).</td>
          </tr>
          <tr>
            <td style={tdStyle}>Idade</td>
            <td style={tdStyle}>Média 49 anos</td>
            <td style={tdStyle}>Adultos em idade produtiva, mas com barreiras de empregabilidade; presença de idosos que demandam cuidados.</td>
            <td style={tdStyle}>- Polícias de geração de renda e inclusão produtiva<br/>- Serviços de convivência e saúde para idosos.</td>
          </tr>
          <tr>
            <td style={tdStyle}>Territórios</td>
            <td style={tdStyle}>Rosário, Santa Cecília e Meudon</td>
            <td style={tdStyle}>Vulnerabilidade habitacional concentrada em áreas específicas.</td>
            <td style={tdStyle}>- Territorialização das ações do SUAS<br/>- Reforço dos CRAS nesses bairros<br/>- Priorização de investimentos habitacionais e sociais.</td>
          </tr>
          <tr>
            <td style={tdStyle}>Equipamentos (CRAS/CREAS)</td>
            <td style={tdStyle}>CRAS Barroso, Alto e São Pedro concentram atendimentos</td>
            <td style={tdStyle}>Rede socioassistencial já sobrecarregada em áreas críticas.</td>
            <td style={tdStyle}>- Ampliar equipes técnicas<br/>- Integrar serviços de saúde, educação e habitação nos territórios.</td>
          </tr>
          <tr>
            <td style={tdStyle}>Total de beneficiários</td>
            <td style={tdStyle}>654 pessoas</td>
            <td style={tdStyle}>Demanda significativa e contínua por moradia segura.</td>
            <td style={tdStyle}>- Garantir continuidade do Aluguel Social como política estruturante<br/>- Monitorar impacto e promover transição para soluções habitacionais permanentes.</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ color: '#128C7E', marginTop: 30 }}>Síntese Estratégica e Implicações Finais</h2>
      <hr style={{ borderColor: '#ccc' }} />
      <p className='paragrafo-modal'>
        Os dados apontam para a necessidade de <span className="highlight2">políticas públicas integradas</span>, que articulem moradia segura com educação, trabalho, saúde e proteção social, fortalecendo o <span className="highlight2">SUAS</span> (Sistema Único de Assistência Social) como sistema de garantia de direitos e inclusão social.
      </p>
      <ul>
        <li>O Aluguel Social deve ser a <span className="highlight2">porta de entrada</span> para políticas integradas, não apenas subsídio financeiro.</li>
        <li>A <span className="highlight2">territorialização</span> é chave: bairros mais vulneráveis (Rosário, Santa Cecília, Meudon) precisam de prioridade na alocação de recursos.</li>
        <li>O perfil majoritário exige políticas de <span className="highlight2">empoderamento feminino</span>, <span className="highlight2">qualificação profissional</span> e <span className="highlight2">inclusão produtiva</span>.</li>
      </ul>
      
    </div>
  );
  // --- Fim do Conteúdo do Relatório ---

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyle}
      contentLabel="Relatório de Indicadores - Aluguel Social"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onRequestClose} style={closeButtonStyle}>
          &times; Fechar
        </button>
        <button onClick={exportToPdf} style={pdfButtonStyle}>
          ⬇️ Exportar para PDF
        </button>
      </div>

      {relatorioContent}
      
      <div style={{ padding: '10px 0', fontSize: '0.75em', color: '#666', borderTop: '1px solid #ccc', marginTop: '20px' }}>
          * Este relatório foi gerado em Outubro/2025.
      </div>

    </Modal>
  );
};

export default RelatorioModal;

/*
  Para usar, certifique-se de que a div raiz do seu aplicativo tem o ID '#root':
  
  // Exemplo de uso no App.js:
  import React, { useState } from 'react';
  import RelatorioModal from './RelatorioModal';
  
  function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div id="root"> 
        <button onClick={() => setIsModalOpen(true)}>Abrir Relatório</button>
        <RelatorioModal 
          isOpen={isModalOpen} 
          onRequestClose={() => setIsModalOpen(false)} 
        />
      </div>
    );
  }
  
  export default App;
*/