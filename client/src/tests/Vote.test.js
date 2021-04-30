import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import VoteForm from '../components/VoteForm'


const user = { id: '123',
  name: 'test'
}

const product = {
  id: '1',
  name: 'Mustamakkarakastike pullo',
  instructions: []
}
/*
test('VoteForm renders', () => {
  const instruction = { id:'123' }
  const component = render(
    <VoteForm instruction = {instruction} user={user} />
  )
  expect(component.container).contains({ votes })

})
*/
test('VoteForm like changes value', () => {
  const instruction = { id:'123' }
  product.instructions.push(instruction)
  const component = render(
    <VoteForm instruction = {instruction}  user={user} product={product} />
  )

  const btn = component.container.querySelector('#likeButton')
  const votes = component.container.querySelector('#votes')
  fireEvent.click(btn)
  expect(votes.textContent === '1')
})
test('VoteForm dislike changes value', () => {
  const instruction = { id:'123' }
  product.instructions.push(instruction)
  const component = render(
    <VoteForm instruction = {instruction}  user={user} product={product} />
  )
  const btn = component.container.querySelector('#dislikeButton')
  const votes = component.container.querySelector('#votes')
  fireEvent.click(btn)
  expect(votes.textContent === '-1')
})
test('VoteForm dislike changes value after like is pressed', () => {
  const instruction = { id:'321' }
  product.instructions.push(instruction)
  const component = render(
    <VoteForm instruction = {instruction}  user={user} product={product} />
  )
  const btn = component.container.querySelector('#dislikeButton')
  const btn2 = component.container.querySelector('#likeButton')
  const votes = component.container.querySelector('#votes')
  fireEvent.click(btn)
  fireEvent.click(btn2)
  expect(votes.textContent === '0')
})
test('VoteForm like changes value after dislike is pressed', () => {
  const instruction = { id:'1111' }
  product.instructions.push(instruction)
  const component = render(
    <VoteForm instruction = {instruction}  user={user} product={product} />
  )
  const btn2 = component.container.querySelector('#dislikeButton')
  const btn = component.container.querySelector('#likeButton')
  fireEvent.click(btn)
  fireEvent.click(btn2)
  expect(btn.textContent === 'Like')
})
test('InstructionList order changes when score changes', () => {
  const productA = {
    id: '1',
    name: 'Mustamakkarakastike pullo',
    instructions: []
  }
  const instructionA = { id:'4321', informatio: 'ohje 1', score: 0 }
  const instructionB = { id:'2143', informatio: 'ohje 2', score: 0 }
  const instructionC = { id:'2341', informatio: 'ohje 3', score: 0 }
  productA.instructions.push(instructionA)
  productA.instructions.push(instructionB)
  productA.instructions.push(instructionC)
  //console.log(productA.instructions)
  const componentA = render(
    <VoteForm instruction = {instructionA}  user={user} product={productA} />
  )
  expect(productA.instructions[0]).toBe(instructionA)
  //const dislikeButton = componentA.getByText('Dislike')
  const dislikeButton = componentA.container.querySelector('#dislikeButton')
  fireEvent.click(dislikeButton)
  expect(productA.instructions[0]).toBe(instructionB)
})
