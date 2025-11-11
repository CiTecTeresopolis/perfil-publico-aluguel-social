import * as XLSX from 'xlsx';

export const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                // XLSX é globalmente disponível via CDN
                const workbook = XLSX.read(data, { type: 'array' });
                
                const result = {};
                
                // O arquivo sample.xlsx tem apenas uma aba, mas mantemos a lógica de processar abas
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    // Usamos { header: 1 } para obter um array de arrays, onde a primeira linha é o cabeçalho
                    // Mas para a análise de perfil, é mais fácil usar { header: 0 } para obter um array de objetos
                    // Onde as chaves são os nomes das colunas.
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    result[sheetName] = jsonData;
                });
                
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Função para calcular métricas de perfil com base nos dados da planilha.
 * @param {Object} data - Objeto contendo os dados da planilha, onde a chave é o nome da aba.
 * @returns {Object} - Objeto contendo as métricas calculadas.
 */
export const calculateMetrics = (data) => {
    const metrics = {
        total_beneficiarios: 0,
        distribuicao_por_sexo: {},
        distribuicao_por_escolaridade: {},
        distribuicao_por_cras: {},
        faixa_etaria: {
            "19-30": 0,
            "31-50": 0,
            "51-65": 0,
            "66+": 0
        },
        media_idade: 0,
        mediana_idade: 0,
        total_bairros_atingidos: [],
        top_bairros_atingidos: [],
        top_bairros_atuais: []

    };

    // Assumindo que a aba de interesse é a primeira ou a única
    const sheetName = Object.keys(data)[0];
    const beneficiarios = data[sheetName] || [];

    metrics.total_beneficiarios = beneficiarios.length;

    if (beneficiarios.length === 0) {
        return metrics;
    }

    let somaIdades = 0;
    const idades = [];
    const contagemBairrosAtingidos = {};
    const contagemBairrosAtuais = {};


    beneficiarios.forEach(beneficiario => {
        // 1. Idade e Faixa Etária
        const idade = parseInt(beneficiario['Idade']);
        if (!isNaN(idade)) {
            somaIdades += idade;
            idades.push(idade);
            if (idade <= 18) metrics.faixa_etaria["0-18"]++;
            else if (idade <= 30) metrics.faixa_etaria["19-30"]++;
            else if (idade <= 50) metrics.faixa_etaria["31-50"]++;
            else if (idade <= 65) metrics.faixa_etaria["51-65"]++;
            else metrics.faixa_etaria["66+"]++;
        }

        // 2. Distribuição por Sexo
        const sexo = beneficiario['Sexo'] ? beneficiario['Sexo'].trim() : 'Não Informado';
        metrics.distribuicao_por_sexo[sexo] = (metrics.distribuicao_por_sexo[sexo] || 0) + 1;

        // 3. Distribuição por Escolaridade
        const escolaridade = beneficiario['Escolaridade'] ? beneficiario['Escolaridade'].trim() : 'Não Informado';
        metrics.distribuicao_por_escolaridade[escolaridade] = (metrics.distribuicao_por_escolaridade[escolaridade] || 0) + 1;

        // 4. Distribuição por CRAS
        const cras = beneficiario['CRAS de refêrencia (atual)'] ? beneficiario['CRAS de refêrencia (atual)'].trim() : 'Não Informado';
        metrics.distribuicao_por_cras[cras] = (metrics.distribuicao_por_cras[cras] || 0) + 1;

        // 5. Bairros mais atingidos
        const bairroAtingido = beneficiario['Bairro domiciliar (atingido)'] ? beneficiario['Bairro domiciliar (atingido)'].trim() : 'Não Informado';
        contagemBairrosAtingidos[bairroAtingido] = (contagemBairrosAtingidos[bairroAtingido] || 0) + 1;

         // 5. Bairros domiciliares atuais
        const bairroAtual = beneficiario['Bairro domiciliar (atual)'] ? beneficiario['Bairro domiciliar (atual)'].trim() : 'Não Informado';
        contagemBairrosAtuais[bairroAtual] = (contagemBairrosAtuais[bairroAtual] || 0) + 1;
    });

    // Cálculo da Média de Idade
    metrics.media_idade = idades.length > 0 ? (somaIdades / idades.length).toFixed(2) : 0;

    // Cálculo da Mediana de Idade
    idades.sort((a, b) => a - b);
    const meio = Math.floor(idades.length / 2);
    if (idades.length % 2 === 0) {
        metrics.mediana_idade = ((idades[meio - 1] + idades[meio]) / 2).toFixed(2);
    } else {
        metrics.mediana_idade = idades[meio];
    }

    // Todos  Bairros Atingidos
    metrics.total_bairros_atingidos = Object.entries(contagemBairrosAtingidos)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([bairro, contagem]) => ({ bairro, contagem }));

    // Top 3 Bairros Atingidos
    metrics.top_bairros_atingidos = Object.entries(contagemBairrosAtingidos)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([bairro, contagem]) => ({ bairro, contagem }));

    // Top 3 Bairros Atuais
    metrics.top_bairros_atuais = Object.entries(contagemBairrosAtuais)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([bairro, contagem]) => ({ bairro, contagem }));

    return metrics;
};


