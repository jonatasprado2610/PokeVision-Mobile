import { IonContent, IonPage } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { FaHeart } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { favoriteService, PokemonBasic } from '../../services/pokemonService';
import { useState, useEffect } from 'react';
import './Favoritos.scss';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<PokemonBasic[]>([]);
  const history = useHistory();

  useEffect(() => {
    setFavorites(favoriteService.getFavorites());
  }, []);

  const handleRemove = (e: React.MouseEvent, pokemon: PokemonBasic) => {
    e.stopPropagation();
    favoriteService.toggleFavorite(pokemon);
    setFavorites(favoriteService.getFavorites());
  };

  return (
    <IonPage>
      <div className="fav-header">
        <h1>❤️ Meus Favoritos</h1>
        <span className="fav-count">{favorites.length} pokémons salvos</span>
      </div>

      <IonContent style={{ '--background': '#f5f5f5' }} className="fav-content">
        {favorites.length === 0 ? (
          <div className="fav-empty">
            <FaHeart className="fav-empty-icon" />
            <h2>Nenhum favorito ainda</h2>
            <p>Toque no coração de um Pokémon para salvá-lo aqui.</p>
          </div>
        ) : (
          <div className="pkdx-grid">
            {favorites.map((p) => (
              <IonCard
                key={p.id}
                className="pokemon-card"
                onClick={() => history.push(`/detalhes/${p.name}`)}
              >
                <div className="card-top">
                  <img src={p.image} alt={p.name} className="pokemon-img" />
                  <button
                    className="fav-btn active"
                    onClick={(e) => handleRemove(e, p)}
                  >
                    <FaHeart />
                  </button>
                </div>
                <IonCardHeader>
                  <IonCardTitle>#{p.id} {p.name}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="pokemon-types">
                    {p.types.map((t) => (
                      <span key={t} className={`type-chip type-${t}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;