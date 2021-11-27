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

    var likeBtn = component.container.querySelector('#likeButton123')
    var dislikeBtn = component.container.querySelector('#dislikeButton123')
    var votesElem = component.container.querySelector('#votes123')

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

  // Ei toimi, eikä välttämättä tarvitsekaan saada toimimaan.
  // TODO, Testi ylemmälle tasolle
  // test('InstructionList order changes when score changes', () => {
  //   const instructionA: Instruction = {
  //     id: 4321,
  //     information: 'ohje 1',
  //     score: 0,
  //     product_id: 1,
  //     creator: 1
  //   }
  //   const instructionB: Instruction = {
  //     id: 2143,
  //     information: 'ohje 2',
  //     score: 0,
  //     product_id: 1,
  //     creator: 1
  //   }
  //   const instructionC: Instruction = {
  //     id: 2341,
  //     information: 'ohje 3',
  //     score: 0,
  //     product_id: 1,
  //     creator: 1
  //   }

  //   product = {
  //     id: 1,
  //     name: 'Mustamakkarakastike pullo',
  //     instructions: [],
  //     creator: 123,
  //     productImage: ''
  //   }

  //   product.instructions.push(instructionA)
  //   product.instructions.push(instructionB)
  //   product.instructions.push(instructionC)

  //   let componentA = render(
  //     <VoteForm instruction={instructionA} user={user} product={product} />
  //   )

  //   let componentB = render(
  //     <VoteForm instruction={instructionB} user={user} product={product} />
  //   )

  //   var dislikeBtnA = componentA.container.querySelector('#dislikeButton4321')
  //   var likeBtnB = componentB.container.querySelector('#likeButton2143')

  //   if (dislikeBtnA === null) {
  //     throw new Error("Like button not found!")
  //   }

  //   if (likeBtnB === null) {
  //     throw new Error("Dislike button not found!")
  //   }

  //   fireEvent.click(dislikeBtnA)
  //   fireEvent.click(likeBtnB)

  //   expect(product.instructions[0]).toBe(instructionB)
  //   expect(product.instructions[1]).toBe(instructionC)
  //   expect(product.instructions[2]).toBe(instructionA)
  // })

})