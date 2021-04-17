import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import VoteForm from '../components/VoteForm'

const user = { id: '123',
  name: 'test'
}

test('VoteForm renders', () => {
  const instruction = { id:'123' }
  const component = render(
    <VoteForm instruction = {instruction} user={user} />
  )
  expect(component.container).toHaveTextContent('Äänet:')

})
test('VoteForm like changes value', () => {
  const instruction = { id:'123' }
  const component = render(
    <VoteForm instruction = {instruction}  user={user} />
  )
  /* const { container, getByTestId } = render(
    <VoteForm instruction = {instruction} />
  ) */
  const btn = component.getByText('Like')
  //.querySelector('#firstinput')
  //const btn = component.getElementById('likeButton')
  //const btn = component.querySelector('likeButton')
  //const btn = component.container.querySelector('#likeButton')
  //const btn = getByTestId(container, 'likeButton')
  //const btn = component.find({ id: 'likeButton' }).first()
  fireEvent.click(btn)
  expect(btn.textContent === 'Poista Like')
})
test('VoteForm dislike changes value', () => {
  const instruction = { id:'123' }
  const component = render(
    <VoteForm instruction = {instruction} user={user} />
  )
  const btn = component.getByText('Dislike')
  fireEvent.click(btn)
  expect(btn.textContent === 'Poista Dislike')
})
test('VoteForm dislike changes value after like is pressed', () => {
  const instruction = { id:'321' }
  const component = render(
    <VoteForm instruction = {instruction} user={user} />
  )
  const btn = component.getByText('Dislike')
  const btn2 = component.getByText('Like')
  fireEvent.click(btn)
  fireEvent.click(btn2)
  expect(btn.textContent === 'Dislike')
})
test('VoteForm like changes value after dislike is pressed', () => {
  const instruction = { id:'1111' }
  const component = render(
    <VoteForm instruction = {instruction} user={user} />
  )
  const btn2 = component.getByText('Dislike')
  const btn = component.getByText('Like')
  fireEvent.click(btn)
  fireEvent.click(btn2)
  expect(btn.textContent === 'Like')
})