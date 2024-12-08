// Obtém o elemento HTML com o id 'pokemonList'
const pokemonList = document.getElementById('pokemonList')
// Obtém o botão com o id 'loadMoreButton', 
const loadMoreButton = document.getElementById('loadMoreButton')
// Define o número máximo de registros (pokémons) que serão carregados

const maxRecords = 151
// Define o limite de pokémons a serem carregados por vez (10 no caso)
const limit = 10
// Inicializa o offset (o ponto de partida) como 0,
let offset = 0;

// Função que converte as informações de um Pokémon em um elemento <li> (lista) HTML
function convertPokemonToLi(pokemon) {
    const modalId = `modal-${pokemon.number}`; // Gera um ID único para o modal
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <button type="button" class="btn btn-outline-light" style="--bs-btn-font-size: .75rem;" data-bs-toggle="modal" data-bs-target="#${modalId}">
                Detalhes
            </button>
        </li>
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group">
                            <li class="list-group-item">Nome: ${pokemon.name}</li>
                            <li class="list-group-item">Altura: ${pokemon.height}</li>
                            <li class="list-group-item">Experiência: ${pokemon.base_experience}</li>
                            <li class="list-group-item">Peso: ${pokemon.weight}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

    //Função que carrega os itens de pokémons com base no offset e limit passados como parâmetros
    function loadPokemonItens(offset, limit) {
        // Chama o método 'getPokemons' da 'pokeApi' para buscar os pokémons com o offset e limit especificados
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            // Mapeia o array de pokémons retornado pela API, convertendo cada Pokémon em um item de lista HTML
            // O método 'map' usa a função 'convertPokemonToLi' para converter os pokémons em HTML
            // Em seguida, a função 'join("")' remove qualquer separador entre os itens da lista gerados
            const newHtml = pokemons.map(convertPokemonToLi).join('')
            // Adiciona o HTML gerado à lista de pokémons existente na página, no elemento 'pokemonList'
            pokemonList.innerHTML += newHtml
        })
    }
    // Chama a função 'loadPokemonItens' com o offset e limit iniciais para carregar os primeiros pokémons
    loadPokemonItens(offset, limit)

    // Adiciona um evento de clique ao botão 'loadMoreButton'
    loadMoreButton.addEventListener('click', () => {
        // Incrementa o offset em 'limit' para carregar a próxima página de pokémons
        offset += limit
        // Calcula quantos registros serão carregados incluindo a próxima página
        const qtdRecordsWithNexPage = offset + limit

        // Verifica se a quantidade de registros a ser carregada ultrapassa o número máximo de registros
        if (qtdRecordsWithNexPage >= maxRecords) {
            // Caso ultrapasse, ajusta o limite para carregar apenas o restante dos pokémons
            const newLimit = maxRecords - offset
            // Chama a função para carregar os pokémons restantes com o novo limite
            loadPokemonItens(offset, newLimit)
            // Remove o botão de carregar mais (pois não há mais registros para carregar)
            loadMoreButton.parentElement.removeChild(loadMoreButton)
        } else {
            // Caso não ultrapasse, carrega a próxima página com o limite definido
            loadPokemonItens(offset, limit)
        }
    })