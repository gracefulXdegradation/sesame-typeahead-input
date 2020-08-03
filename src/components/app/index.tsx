import React from 'react'
import styled from 'styled-components'
import { TypeaheadInput } from '../typeahead-input'
import logo from './logo.svg'

const AppWrapper = styled.div`
  text-align: center;
  background-color: rgb(4, 65, 114);
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;
`

const AppLogo = styled.img`
  height: 80px;
`

const Form = styled.form`
  width: 300px;
  margin-top: 2rem;
`

export const App = () => {
  return (
    <AppWrapper>
      <AppLogo src={logo} alt="logo" />
      <Form>
        <TypeaheadInput
          placeholder="Search"
          onValueChange={(value: string) => {
            console.log('Value changed: ', value)
          }}
        />
      </Form>
    </AppWrapper>
  )
}
