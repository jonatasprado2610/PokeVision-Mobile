import { useEffect, useState } from 'react';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { pokemonService, favoriteService } from '../../services/pokemonService';
import { FaHeart } from "react-icons/fa";
import './Detalhes.scss';

interface PokemonDetailData {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
}

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await pokemonService.getPokemonDetails(name);

      const formatted: PokemonDetailData = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      };

      setPokemon(formatted);
      setLoading(false);
    };

    fetchData();
  }, [name]);

  if (loading || !pokemon) {
    return (
      <IonPage>
        <IonContent className="detail-content">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="detail-content">
        <IonCard className="detail-card">
          <div className="detail-top">
            <img src={pokemon.image} alt={pokemon.name} className="detail-img" />
            <button
              className={`fav-btn ${favoriteService.isFavorite(pokemon.id) ? "active" : ""}`}
              onClick={() => {
                favoriteService.toggleFavorite(pokemon);
                setPokemon({ ...pokemon });
              }}
            >
              <FaHeart />
            </button>
          </div>

          <IonCardHeader>
            <IonCardTitle>#{pokemon.id} {pokemon.name}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div className="pokemon-types">
              {pokemon.types.map((t) => (
                <span key={t} className={`type-chip type-${t}`}>
                  {t}
                </span>
              ))}
            </div>

            <div className="pokemon-abilities">
              <h3>Abilities</h3>
              <ul>
                {pokemon.abilities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="pokemon-stats">
              <h3>Stats</h3>
              {pokemon.stats.map((s) => (
                <div key={s.name} className="stat-row">
                  <span className="stat-name">{s.name}</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${s.value}%` }}></div>
                  </div>
                  <span className="stat-value">{s.value}</span>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PokemonDetail;
