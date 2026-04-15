import axios from "axios";

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/'
});




export const pokemonService = {

    // busca lista de  pokemons

    async getPokemonList(limit: number = 30, offset: number = 0) {
        const response = await api.get(`pokemon?limit=${limit}&offset=${offset}`)
        return response.data;
    },

    //  Busca os detalhes (Nome, Peso, Tipo, Ataques, Imagem)
    async getPokemonDetails(nameOrId: string | number) {
        const response = await api.get(`pokemon/${nameOrId}`);
        return response.data;
    },

    //  Busca detalhes de uma geração específica (IMPORTANTE para o seu menu)
    // Quando o usuário escolher "Geração 1", a API retorna quais Pokémons são dela
    async getGenerationDetails(id: number | string) {
        const response = await api.get(`generation/${id}`);
        return response.data;
    },

    //// Busca as gerações disponíveis para o seu menu superior
    async getGenerations() {
        const response = await api.get('generation');
        return response.data;
    },

    // busca por tipo
    async getTypes() {
        const response = await api.get('type');
        return response.data;
    }

};


//fAVORITAR OS POKEMONS 

export const favoriteService = {
    getFavorites(): any[] {
        const favs = localStorage.getItem('pokedex_favorites');
        return favs ? JSON.parse(favs) : [];
    },

    saveFavorites(pokemon: any) {
        const favs = this.getFavorites();
        const isAlreadyFav = favs.find(p => p.id === pokemon.id);

        if (!isAlreadyFav) {
            favs.push(pokemon);
            localStorage.setItem('pokedex_favorites', JSON.stringify(favs));
        }
    },

    removeFavorite(id: number) {
        const favs = this.getFavorites();
        const filtered = favs.filter(p => p.id !== id);
        localStorage.setItem('pokedex_favorites', JSON.stringify(filtered));

    }
};

//recomendacao de pokebolaa

export const getRecommendeBall = (weight: number, isLegendary : boolean) =>{
    if (isLegendary) return "Master Ball";
    if (weight > 2000) return "Ultra Ball"; // Pokemons gordo
    return "Poke Ball";
}