import { useEffect, useRef } from 'react'
import { dehydrate, QueryClient, useInfiniteQuery, useQuery } from 'react-query'
import ReactLoading from 'react-loading'
import { pokeAPI } from '../client/pokeAPI'
import styles from '../styles/Home.module.css'
import PokemonsList from '../components/PokemonsList'
const DEFAULT_LIMIT = 20

const fetchFunction = async ({ pageParam = '' }) => {
  const searchString = pageParam ? pageParam : `/pokemon/?offset=0&limit=${DEFAULT_LIMIT}`
  const res = await pokeAPI.get(searchString)
  return res.data
}

export default function Home() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery('pokemons', fetchFunction, {
    getNextPageParam: (lastPage) => {
      return lastPage.next
    },
  })
  const loaderRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    }

    const observer = new IntersectionObserver(entities => {
      const target = entities[0]

      if (target.isIntersecting) {
        fetchNextPage()
      }
    }, options)

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }
  }, [fetchNextPage])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Talles pokedex
        </h1>
        <div className={styles.grid}>
          {data?.pages.map(page => (
            <PokemonsList key={page.next} pokemons={page.results} />
          ))}
        </div>
        {isFetchingNextPage && <ReactLoading type="spin" color="#0070f3" height={50} width={50} />}
        <div ref={loaderRef} />
      </main>
    </div>
  )
}


export async function getStaticProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({ queryKey: 'pokemons', queryFn: fetchFunction })

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    }
  }
}
