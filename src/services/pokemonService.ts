import axios from "axios";


const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/'
});



export interface PokemonBasic {
    id: number;
    name: string;
    image: string;
    types: string[];
}

export const pokemonService = {

    // busca lista de  pokemons

    async getPokemonList(limit: number , offset: number ) {
        try {
            const response = await api.get(`pokemon?limit=${limit}&offset=${offset}`)
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar lista de pokémons:", error);
            throw error;
        }

    },

    //  Busca os detalhes (Nome, Peso, Tipo, Ataques, Imagem)
    async getPokemonDetails(nameOrId: string | number) {
        try {
            const response = await api.get(`pokemon/${nameOrId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do pokémon "${nameOrId}":`, error);
            throw error;
        }

    },

    //  Busca detalhes de uma geração específica (IMPORTANTE para o seu menu)
    // Quando o usuário escolher "Geração 1", a API retorna quais Pokémons são dela
    async getGenerationDetails(id: number | string) {
        try {
            const response = await api.get(`generation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar geração "${id}":`, error);
            throw error;
        }

    },

    //// Busca as gerações disponíveis para o seu menu superior
    async getGenerations() {
        try {
            const response = await api.get('generation');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar gerações:", error);
            throw error;
        }

    },

    // busca por tipo
    async getTypes() {
        try {
            
            const response = await api.get('type');

            return response.data.results.filter((t: any) =>
              t.name !== 'unknown' && t.name !== 'shadow'
            )
        
        } catch (error) {
            console.error("Erro ao buscar tipos:", error);
            throw error;
        }

    },

    async getPokemonsByType(typeId: string | number) {
        try {
            const response = await api.get(`type/${typeId}`);
            return response.data; // response.data.pokemon[] contém a lista
        } catch (error) {
            console.error(`Erro ao buscar pokémons do tipo "${typeId}":`, error);
            throw error;
        }
    },



};


//Favorite Service

export const favoriteService = {

    getFavorites(): PokemonBasic[] {
        const favs = localStorage.getItem("pokedex_favorites");
        return favs ? JSON.parse(favs) : [];
    },

    isFavorite(id: number): boolean {
        return this.getFavorites().some((p) => p.id === id);
    },

    saveFavorite(pokemon: PokemonBasic) {
        const favs = this.getFavorites();
        if (!this.isFavorite(pokemon.id)) {
            favs.push(pokemon);
            localStorage.setItem("pokedex_favorites", JSON.stringify(favs));
        }
    },

    removeFavorite(id: number) {
        const favs = this.getFavorites().filter((p) => p.id !== id);
        localStorage.setItem("pokedex_favorites", JSON.stringify(favs));
    },

    toggleFavorite(pokemon: PokemonBasic) {
        if (this.isFavorite(pokemon.id)) {
            this.removeFavorite(pokemon.id);
        } else {
            this.saveFavorite(pokemon);
        }
    },
};

// Pokebola

export const getRecommendedBall = (weight: number, isLegendary: boolean): string => {
    if (isLegendary) return "Master Ball";
    if (weight > 2000) return "Ultra Ball";
    return "Poke Ball";
};