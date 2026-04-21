import { IonSearchbar } from '@ionic/react';
import {
  FaFire, FaTint, FaLeaf, FaBolt, FaSnowflake,
  FaFistRaised, FaSkull, FaMountain, FaFeatherAlt,
  FaBrain, FaDragon, FaCircle, FaHeart
} from 'react-icons/fa';
import { GiSpartanHelmet } from 'react-icons/gi';
import './PokemonHeader.scss';
import { useHistory } from "react-router-dom";

const GENS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

const TYPES = [
  { name: 'Normal', color: '#A8A878', text: '#3a3a1a', icon: <FaCircle /> },
  { name: 'Fire', color: '#FF603F', text: '#5a0e00', icon: <FaFire /> },
  { name: 'Water', color: '#76BDFE', text: '#002f5a', icon: <FaTint /> },
  { name: 'Grass', color: '#78C850', text: '#1a4a00', icon: <FaLeaf /> },
  { name: 'Electric', color: '#F8D030', text: '#4a3a00', icon: <FaBolt /> },
  { name: 'Ice', color: '#98D8D8', text: '#003a3a', icon: <FaSnowflake /> },
  { name: 'Fighting', color: '#C03028', text: '#ffe0df', icon: <FaFistRaised /> },
  { name: 'Poison', color: '#A890F0', text: '#1a0066', icon: <FaSkull /> },
  { name: 'Ground', color: '#E0C068', text: '#3a2800', icon: <FaMountain /> },
  { name: 'Flying', color: '#90C0F8', text: '#00225a', icon: <FaFeatherAlt /> },
  { name: 'Psychic', color: '#F85888', text: '#5a0020', icon: <FaBrain /> },
  { name: 'Dragon', color: '#7038F8', text: '#f0e0ff', icon: <FaDragon /> },
];

interface Props {
  onSearch: (q: string) => void;
  onGenChange: (gen: string) => void;
  onTypeToggle: (type: string) => void;
  selectedGen: string;
  selectedTypes: string[];
}



const PokemonHeader: React.FC<Props> = ({
  onSearch, onGenChange, onTypeToggle, selectedGen, selectedTypes,
}) => {
  const history = useHistory();
  return (
    <div className="pkdx-header-wrap">

      {/* ── Topo vermelho ── */}
      <div className="pkdx-top">
        <div className="pkdx-top-row">
          <div className="pkdx-brand">
            <img src="../../public/pokebola.png" className="pkdx-ball" />
            <span className="pkdx-brand-name">Pokédex Global</span>
          </div>
          <button className="fav-page-btn" onClick={() => history.push('/favoritos')}>
            <FaHeart className="fav-icon" />
            Favoritos
          </button>
        </div>
        {/* Geração — scroll horizontal */}
        <div className="pkdx-gen-strip">
          {GENS.map((g) => (
            <button
              key={g}
              className={`gen-chip ${selectedGen === g ? 'active' : ''}`}
              onClick={() => onGenChange(g)}
            >
              <GiSpartanHelmet style={{ marginRight: '6px' }} />
              Gen {g}
            </button>
          ))}
        </div>

        {/* Barra de busca */}
        <div className="pkdx-search-row">
          <IonSearchbar
            debounce={400}
            placeholder="Nome ou número do Pokémon..."
            onIonInput={(e) => onSearch(e.detail.value ?? '')}
            style={{
              '--border-radius': '12px',
              '--background': '#fff',
              '--box-shadow': 'none',
              '--padding-start': '12px',
              '--color': 'black'
            }}
          />
        </div>
      </div>

      {/* ── Faixa branca de tipos ── */}
      <div className="pkdx-type-strip">
        {TYPES.map((t) => {
          const active = selectedTypes.includes(t.name);
          return (
            <button
              key={t.name}
              className="type-chip"
              onClick={() => onTypeToggle(t.name)}
              style={{
                background: active ? t.color : '#F0F0F0',
                color: active ? t.text : '#555',
              }}
            >
              {t.icon}
              {t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonHeader;
