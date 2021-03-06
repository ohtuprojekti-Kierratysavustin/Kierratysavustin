import React from 'react'
import FavouriteProducts from './FavouriteProducts'
import SearchBarForm from './SearchBarForm'
import { useStore } from '../store'
import InfoBar from './InfoBar'

const FrontPage = ({ products, setFilteredProducts }) => {
  const { user, favorites } = useStore()
  if (!products) {
    return null
  }

  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Kotitalouden kierrätysavustimen tavoitteena on nostaa kotitalouksien lajitteluastetta. Tule mukaan hakemaan oikea kierrätysohje haluamallesi tuotteelle tai rekisteröidy ja kirjaudu palveluun lisätäksesi tuotteita tai kierrätysohjeita palveluun!'} />

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