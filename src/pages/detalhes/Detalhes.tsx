import { useEffect, useState } from 'react';
import { IonPage, IonContent, IonSpinner, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { pokemonService, favoriteService } from '../../services/pokemonService';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import './Detalhes.scss';

interface PokemonDetailData {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
  weight: number;
  height: number;
}

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await pokemonService.getPokemonDetails(name);
      setPokemon({
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        weight: data.weight / 10,
        height: data.height / 10,
      });
      setLoading(false);
    };
    fetchData();
  }, [name]);

  if (loading || !pokemon) {
    return (
      <IonPage>
        <IonContent className="detail-content">
          <div className="loading-wrapper"><IonSpinner name="crescent" /></div>
        </IonContent>
      </IonPage>
    );
  }

  const statColors: Record<string, string> = {
    hp: 'linear-gradient(90deg, #66bb6a, #2e7d32)',
    attack: 'linear-gradient(90deg, #ef5350, #b71c1c)',
    defense: 'linear-gradient(90deg, #42a5f5, #0d47a1)',
    'special-attack': 'linear-gradient(90deg, #ab47bc, #6a1b9a)',
    'special-defense': 'linear-gradient(90deg, #26c6da, #00838f)',
    speed: 'linear-gradient(90deg, #ffa726, #e65100)',
  };

  return (
    <IonPage>
      <IonContent className="detail-content" style={{ '--background': '#f0f4f8' }}>

        {/* Header */}
        <div className="detail-header">
          <button className="back-btn" onClick={() => history.goBack()}>
            <FaArrowLeft />
          </button>
          <span className="header-title">{pokemon.name}</span>
          <span className="header-id">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>

        
        <div className="detail-hero">
          <button
            className={`fav-btn ${favoriteService.isFavorite(pokemon.id) ? 'active' : ''}`}
            onClick={() => { favoriteService.toggleFavorite(pokemon); setPokemon({ ...pokemon }); }}
          >
            <FaHeart />
          </button>
          <img src={pokemon.image} alt={pokemon.name} className="hero-img" />
          <h1 className="pokemon-name">{pokemon.name}</h1>
          <div className="types-row">
            {pokemon.types.map((t) => (
              <span key={t} className={`type-chip type-${t}`}>{t}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="detail-body">

          {/* Peso e Altura */}
          <div className="mini-stat-grid">
            <div className="mini-stat-card">
              <span className="mini-label">Peso</span>
              <span className="mini-value">{pokemon.weight} <small>kg</small></span>
            </div>
            <div className="mini-stat-card">
              <span className="mini-label">Altura</span>
              <span className="mini-value">{pokemon.height} <small>m</small></span>
            </div>
          </div>

          {/* Habilidades */}
          <div className="detail-card">
            <h3 className="section-title">Habilidades</h3>
            <div className="abilities-list">
              {pokemon.abilities.map((a) => (
                <span key={a} className="ability-pill">
                  <span className="ability-dot" />
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="detail-card">
            <h3 className="section-title">Base Stats</h3>
            {pokemon.stats.map((s) => (
              <div key={s.name} className="stat-row">
                <span className="stat-name">{s.name.replace('special-', 'sp. ')}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{
                      width: `${Math.min(s.value, 150) / 150 * 100}%`,
                      background: statColors[s.name] || 'linear-gradient(90deg, #4caf50, #2e7d32)',
                    }}
                  />
                </div>
                <span className="stat-value">{s.value}</span>
              </div>
            ))}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default PokemonDetail;