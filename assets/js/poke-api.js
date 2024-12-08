// Define um objeto vazio chamado 'pokeApi', armazenará funções para acessar dados de pokémons de uma API
const pokeApi = {}
// Função que converte os detalhes de um Pokémon (obtidos de uma API) para um objeto do tipo 'Pokemon'
function convertPokeApiDetailToPokemon(pokeDetail) {
    // Cria uma nova instância do objeto 'Pokemon'
    const pokemon = new Pokemon()
     // Atribui o número do Pokémon a partir do ID obtido dos detalhes da API
    pokemon.number = pokeDetail.id
     // Atribui o nome do Pokémon a partir do nome obtido nos detalhes da API
    pokemon.name = pokeDetail.name

    pokemon.experiencia = pokeDetail.base_experience
    
    pokemon.altura = pokeDetail.height
    
    pokemon.peso = pokeDetail.weight

    pokemon.formas = pokeDetail.forms

    pokemon.localidade = pokeDetail.location_area_encounters

    pokemon.movimentos = pokeDetail.moves
   
    // Cria um array 'types' com os tipos do Pokémon, mapeando o array de 'types' da API para extrair o nome de cada tipo
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    // Desestrutura o array 'types' para pegar o primeiro tipo e atribuir à variável 'type'
    const [type] = types

    // Atribui a lista completa de tipos ao objeto 'pokemon'
    pokemon.types = types
     // Atribui o primeiro tipo (para fins de simplificação, ou para uso posterior) ao objeto 'pokemon'
    pokemon.type = type
    // Atribui a foto do Pokémon, pegando a URL da imagem do sprite 'dream_world' da API
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
     // Retorna o objeto 'pokemon' preenchido com as informações extraídas dos detalhes da API
    return pokemon
}
// Define um método 'getPokemonDetail' dentro do objeto 'pokeApi', que recebe um objeto 'pokemon' como parâmetro
pokeApi.getPokemonDetail = (pokemon) => {
    //Faz uma solicitação fetch para a URL do Pokémon (presumivelmente obtida de outra parte do código)
    return fetch(pokemon.url)
        //Converte a resposta da solicitação para formato JSON
        .then((response) => response.json())
        // Converte os dados JSON para o formato desejado, usando a função 'convertPokeApiDetailToPokemon'
        .then(convertPokeApiDetailToPokemon)
}
// Define um método 'getPokemons' dentro do objeto 'pokeApi', que recebe 'offset' e 'limit' como parâmetros
pokeApi.getPokemons = (offset = 0, limit = 5) => {
     // Constrói a URL da API para buscar uma lista de pokémons com base no offset e limite
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    // Faz uma solicitação fetch para a URL gerada
    return fetch(url)
    //Converte a resposta da API para JSON
        .then((response) => response.json())
         // Extrai a lista de pokémons do corpo da resposta
        .then((jsonBody) => jsonBody.results)
        // Para cada pokémon, chama a função 'getPokemonDetail' para obter mais detalhes
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
         // Espera todas as promessas de detalhes serem resolvidas (solicitações para cada pokémon)
        .then((detailRequests) => Promise.all(detailRequests))
        // Retorna os detalhes completos dos pokémons
        .then((pokemonsDetails) => pokemonsDetails)
}

