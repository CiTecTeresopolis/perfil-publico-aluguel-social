import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet.heat";
// Importe o plugin Leaflet.heat (você precisará instalá-lo e importá-lo no seu projeto)
// Exemplo de instalação: npm install leaflet.heat
// A importação pode variar dependendo de como o seu bundler lida com o plugin.
// Para fins de demonstração, assumimos que o plugin adiciona L.heatLayer.

// O plugin Leaflet.heat não é um componente React, então precisamos de um wrapper
// para integrá-lo ao react-leaflet.

/**
 * Componente Wrapper para o Leaflet.heat
 * @param {Array<Array<number>>} points - Array de pontos no formato [lat, lng, intensity]
 * @param {Object} options - Opções de configuração do Leaflet.heat
 */
const HeatMapLayer = ({ points, options }) => {
  const map = useMap(); // Hook do react-leaflet para acessar a instância do mapa

  useEffect(() => {
    // Verifica se o plugin L.heatLayer está disponível
    if (!L.heatLayer) {
      console.error("Leaflet.heat plugin não encontrado. Certifique-se de que está instalado e importado corretamente.");
      return;
    }

    // 1. Cria a camada de calor
    const heatLayer = L.heatLayer(points, options);

    // 2. Adiciona a camada ao mapa
    heatLayer.addTo(map);

    // 3. Função de limpeza (cleanup)
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]); // Re-executa se o mapa, pontos ou opções mudarem

  return null; // Este componente não renderiza nada diretamente
};

export default HeatMapLayer;