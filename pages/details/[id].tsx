import { FC } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { pokeAPI } from "../../client/pokeAPI"
import styles from '../../styles/Home.module.css'

interface DetailsProps {
  pokemon: {
    name: string;
    image: string;
  }
}

const PokemonDetails: FC<DetailsProps> = ({ pokemon }) => {
  return (
    <div className={styles.pokemonDetail}>
      <h1>{pokemon?.name}</h1>
      <Image src={pokemon?.image} width={80} height={80} alt="" />
    </div>
  )
}

export default PokemonDetails

interface PokemonFromList {
  name: string;
  url: string;
}

interface PokemonList {
  results: PokemonFromList[]
}

export async function getStaticPaths() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery('pokemons', async () => {
    const res = await pokeAPI.get('/pokemon/?offset=0&limit=20')
    return res.data
  })
  const pokemons = queryClient.getQueryData('pokemons') as PokemonList | undefined
  const pokemonsIds = pokemons?.results?.map(pokemon => pokemon.url.split('/')[6])
  const paths = pokemonsIds?.map(id => ({ params: { id: id.toString() } }))
  return {
    paths,
    fallback: true,
  }
}

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['pokemon', id], async () => {
    const poke = await pokeAPI.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    return poke.data
  })
  const pokemonData = queryClient.getQueryData(['pokemon', id]) as Pokemon | undefined
  return {
    props: {
      pokemon: {
        name: pokemonData?.name,
        image: pokemonData?.sprites.front_default
      }
    }
  }
}