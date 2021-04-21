import React from 'react'
import FavouriteProducts from './FavouriteProducts'
import SearchBarForm from './SearchBarForm'
import { useStore } from '../App'

import InfoBar from './InfoBar'

const SearchForm = ({ products, setFilteredProducts }) => {
  if (!products) {
    return null
  }
  const { user, favorites } = useStore()

  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'kierrätysavustimesta lyhyesti'} />

      <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />

      {user !== null ? (
        <FavouriteProducts userProducts={favorites}/>
      ) : (
        ''
      )}
    </div>
  )
}
export default SearchForm