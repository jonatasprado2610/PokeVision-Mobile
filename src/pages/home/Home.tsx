import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner } from '@ionic/react';
import PokemonHeader from '../../components/PokemonHeader/PokemonHeader';
import { pokemonService, PokemonBasic, favoriteService } from '../../services/pokemonService';
import { FaHeart } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [gen, setGen] = useState('I');
  const [types, setTypes] = useState<string[]>([]);
  const [pokemons, setPokemons] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const toggleType = (t: string) => {
    setTypes((prev) =>
      prev.includes(t)
        ? prev.filter((x) => x !== t)
        : [...prev, t]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [start, end] = genRanges[gen];
      const limit = end + start + 1;
      const offset = start - 1;
      const list = await pokemonService.getPokemonList(limit, offset); // pega mais pokémons para suportar várias gerações

      const detailsPromises = list.results.map(async (p: any) => {
        const data = await pokemonService.getPokemonDetails(p.name);
        return {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((t: any) => t.type.name),
        };
      });

      const fullData = await Promise.all(detailsPromises);
      setPokemons(fullData);
      setLoading(false);
    };

    fetchData();
  }, [gen]);

  // Função auxiliar para mapear geração -> intervalo de IDs
  const genRanges: Record<string, [number, number]> = {
    I: [1, 151],
    II: [152, 251],
    III: [252, 386],
    IV: [387, 493],
    V: [494, 649],
    VI: [650, 721],
    VII: [722, 809],
    VIII: [810, 905],
    IX: [906, 1025]
  };

  const filteredPokemons = pokemons.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toString().includes(query);

    const [start, end] = genRanges[gen];
    const matchesGen = p.id >= start && p.id <= end;

    const matchesTypes =
      types.length === 0 ||
      types.every((selectedType) =>
        p.types.some((pokemonType) => pokemonType.toLowerCase() === selectedType.toLowerCase())
      );  

    return matchesQuery && matchesGen && matchesTypes;
  });

  return (
    <IonPage>
      <PokemonHeader
        onSearch={setQuery}
        onGenChange={setGen}
        onTypeToggle={toggleType}
        selectedGen={gen}
        selectedTypes={types}
      />

      <IonContent style={{ '--background': '#f5f5f5' }} className="pkdx-content">
        {loading && <IonSpinner name="crescent" />}

        <div className="pkdx-grid">
          {filteredPokemons.map((p) => (
            <IonCard
              key={p.id}
              className="pokemon-card"
              onClick={() => history.push(`/detalhes/${p.name}`)}
            >
              <div className="card-top">
                <img src={p.image} alt={p.name} className="pokemon-img" />
                <button
                  className={`fav-btn ${favoriteService.isFavorite(p.id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation(); // evita abrir detalhes ao clicar no coração
                    favoriteService.toggleFavorite(p);
                    setPokemons((prev) =>
                      prev.map((pk) =>
                        pk.id === p.id ? { ...pk } : pk
                      )
                    );
                  }}
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
