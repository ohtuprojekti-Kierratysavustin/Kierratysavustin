import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, RenderResult } from '@testing-library/react'
import VoteForm from '../components/forms/VoteForm'
import { Instruction, Product, User } from '../types/objects'


describe('When RegisterForm is rendered', () => {

  var user: User
  var product: Product
  var instruction: Instruction
  var component: RenderResult
  var likeButton: Element
  var dislikeButton: Element
  var votes: Element

  beforeEach(() => {

    user = {
      id: 1,
      username: 'test',
      passwordHash: 'sgsgsGFSGEW',
      token: 'GEDSFWAEGW',
      likes: [],
      dislikes: [],
      favoriteProducts: []
    }

    product = {
      id: 1,
      name: 'Mustamakkarakastike pullo',
      instructions: [],
      creator: 123,
      productImage: ''
    }

    instruction = {
      id: 123,
      score: 0,
      information: 'Kierrätä',
      product_id: 1,
      creator: 1
    }

    product.instructions.push(instruction)

    component = render(
      <VoteForm instruction={instruction} user={user} product={product} />
    )

    var likeBtn = component.container.querySelector('#likeButton')
    var dislikeBtn = component.container.querySelector('#dislikeButton')
    var votesElem = component.container.querySelector('#votes')

    if (likeBtn === null) {
      throw new Error("Like button not found!")
    }

    if (votesElem === null) {
      throw new Error("votes not found!")
    }

    if (dislikeBtn === null) {
      throw new Error("Like button not found!")
    }

    likeButton = likeBtn
    dislikeButton = dislikeBtn
    votes = votesElem

  })


  test('VoteForm like changes value', () => {
    fireEvent.click(likeButton)
    expect(votes.textContent === '1')
  })

  test('VoteForm dislike changes value', () => {
    fireEvent.click(dislikeButton)
    expect(votes.textContent === '-1')
  })

  test('VoteForm dislike changes value after like is pressed', () => {
    fireEvent.click(dislikeButton)
    fireEvent.click(likeButton)
    expect(votes.textContent === '0')
  })

  test('VoteForm like changes value after dislike is pressed', () => {
    fireEvent.click(likeButton)
    fireEvent.click(dislikeButton)

    expect(votes.textContent === '0')
  })

  test('InstructionList order changes when score changes', () => {
    const instructionA: Instruction = {
      id: 4321,
      information: 'ohje 1',
      score: 0,
      product_id: 1,
      creator: 1
    }
    const instructionB: Instruction = {
      id: 2143,
      information: 'ohje 2',
      score: 0,
      product_id: 1,
      creator: 1
    }
    const instructionC: Instruction = {
      id: 2341,
      information: 'ohje 3',
      score: 0,
      product_id: 1,
      creator: 1
    }

    product.instructions = []
    product.instructions.push(instructionA)
    product.instructions.push(instructionB)
    product.instructions.push(instructionC)

    fireEvent.click(dislikeButton)
    expect(product.instructions[0]).toBe(instructionB)
  })

})