import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const products = [
  {
    id: 1,
    name: 'Mustamakkarakastike pullo',
    instructions: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
  },
  {
    id: 2,
    name: 'Maitotölkki',
    instructions: 'Huuhtele tölkki. Laita litistettynä kartonkikeräykseen.'
  },
  {
    id: 3,
    name: 'Sanomalehti',
    instructions: 'Laita lehti paperinkeräykseen.'
  }
]


ReactDOM.render(
  <App products={products} />,
  document.getElementById('root')
)
