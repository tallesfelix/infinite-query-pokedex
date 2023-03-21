import axios from 'axios'

export const pokeAPI = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/'
})