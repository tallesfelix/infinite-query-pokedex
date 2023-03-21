import Image from "next/image";
import Link from "next/link";
import styles from '../styles/Home.module.css'

interface Pokemon {
  name: string;
  url: string;
}

const getPokemonImage = (pokemon: string) => (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon}.svg`)

export default function PokemonsList({ pokemons }: { pokemons: Pokemon[] }) {
  return (
    <>
      {pokemons.map((pokemon: Pokemon) => {
        const pokemonId = pokemon.url.split('/')[6]
        return (
          <Link href={`/details/${pokemonId}`} key={pokemon.name}>
            <div className={styles.card}>
              <h3>{pokemon.name}</h3>
              <Image src={getPokemonImage(pokemonId)} placeholder="blur" width={50} height={50} alt="" />
            </div>
          </Link>
        )
      })}
    </>
  )
}
