import React from 'react'
import TestButton from '../App/Components/TestButton'
import { render } from 'react-native-testing-library'
// import { render, fireEvent } from 'react-testing-library'

const { getByTestId } = render(<TestButton />)
const button = getByTestId('button')

describe('rendering', () => {
    it('should render a <TouchableOpacity/>', () => {
        expect(button).not.toBe(null)
        // expect(true).toBe(true)
    })
 
    // it('should render a label', test.todo)
    // describe('no type', () => {
    //     it('should have the default style', test.todo) 
    // })
    // describe('primary type', () => {
    //     it('should have the primary style', test.todo)
    // })
})
 
// describe('interaction', () => { 
//     describe('clicking the button', () => {
//         it('should call the onClick callback', test.todo)
//     })
// })
