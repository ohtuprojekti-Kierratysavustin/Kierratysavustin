import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { Product, ProductStatistic, User } from '../types'
import RecycleStatistics from '../components/RecycleStatistics'
import { BrowserRouter as Router } from 'react-router-dom'
import { useStore } from '../store'

const originalState = useStore.getState()
 
const juustopaketti: Product = {
    id: 1,
    name: 'Juustopaketti',
    instructions: [],
    users: [],
    user: 1
  }

  const sipsipussi: Product = {
    id: 2,
    name: 'Sipsipussi',
    instructions: [],
    users: [],
    user: 1
  }

const user: User = { 
    id: 234,
    username: 'testuser',
    passwordHash: 'string',
    token: 'string',
    likes: [],
    dislikes: [],
    products: []
}

const statistics: ProductStatistic[] = new Array(
    {
        productID: juustopaketti,
        purchaseCount: 2,
        recycleCount: 1,
    },
    {
        productID: sipsipussi,
        purchaseCount: 1,
        recycleCount: 0,
    },
)

test('Statistics page shows correct text when user not signed in', () => {
    useStore.setState(originalState)
    const component = render(
    <Router>
        <RecycleStatistics />
    </Router>
    )

    expect(component.container).toHaveTextContent(
        'Kirjaudu sisään'
    )
})

describe('When user has signed in', () => {
    beforeEach(() => {
        useStore.setState({ ...originalState, user: user })
      })

    test('Statistics page shows correct text when user has no statistics', () => {
        const component = render(
        <Router>
            <RecycleStatistics />
        </Router>
        )
    
        expect(component.container).toHaveTextContent(
            'Voit kirjata tuotteita sovellukseen niitä hankkittuasi, ja merkitä niitä myöhemmin kierrätetyiksi.Näin tehdessäsi, näet tältä sivulta tietoja kierrättämiesi tuotteiden määristä ja kierrätysasteestasi'
        )
    })

    test('Statistics page shows correct text when user has no statistics', () => {
        useStore.setState({ ...useStore.getState, productStatistics: statistics })
        const component = render(
        <Router>
            <RecycleStatistics />
        </Router>
        )
    
        expect(component.container.querySelector('#listElement1')).toHaveTextContent('1Juustopaketti2150 %')
        expect(component.container.querySelector('#listElement2')).toHaveTextContent('2Sipsipussi100 %')
    })
})
