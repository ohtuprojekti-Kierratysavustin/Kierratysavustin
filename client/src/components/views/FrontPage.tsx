import React from 'react'
import ProductsList from '../ProductsList'
import SearchBarForm from '../forms/SearchBarForm'
import { useStore } from '../../store'
import InfoBar from '../InfoBar'
import { Product } from '../../types/objects'

type Props = {
  products: Product[],
  setFilteredProducts: (param: Product[]) => void
}

const FrontPage: React.FC<Props> = ({ products, setFilteredProducts }) => {
  const { user, favorites } = useStore()
  if (!products) {
    return null
  }

  return (
    <div>
      <InfoBar
        header={'Kotitalouden kierrätysavustin'}
        text={user !== null ? (
          `Hei ${user.username}! Tervetuloa takaisin käyttämään kierrätysavustinta.`
        ) : (
          'Kotitalouden kierrätysavustimen tavoitteena on nostaa kotitalouksien lajitteluastetta. Tule mukaan hakemaan oikea kierrätysohje haluamallesi tuotteelle tai rekisteröidy ja kirjaudu palveluun lisätäksesi tuotteita tai kierrätysohjeita palveluun!'
        )}
      />
      <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />
      {user !== null ? (
        <ProductsList products={favorites} header='Suosikkituotteet' />
      ) : (
        ''
      )}
    </div>
  )
}

export default FrontPage