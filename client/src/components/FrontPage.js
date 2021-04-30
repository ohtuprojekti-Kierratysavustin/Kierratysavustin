import React from 'react'
import FavouriteProducts from './FavouriteProducts'
import SearchBarForm from './SearchBarForm'
import { useStore } from '../App'

import InfoBar from './InfoBar'

const FrontPage = ( { products, setFilteredProducts } ) => {
  const { user, favorites } = useStore()
  if (!products) {
    return null
  }

  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'kierrätysavustimesta lyhyesti'} />

      <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />

      {user !== null ? (
        <FavouriteProducts userProducts={favorites} />
      ) : (
        ''
      )}
    </div>
  )
}
export default FrontPage