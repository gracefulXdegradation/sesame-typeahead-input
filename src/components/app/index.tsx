import React from 'react'
import styled from 'styled-components'
import { TypeaheadInput } from '../typeahead-input'
import logo from './logo.svg'
import { yummies } from './yummies'

const options = yummies.map((value, i) => ({
  id: i,
  value
}))

const AppWrapper = styled.div`
  text-align: center;
  background-color: rgb(4, 65, 114);
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AppLogo = styled.img`
  height: 80px;
`

const Form = styled.form`
  width: 200px;
`

export const App = () => {
  return (
    <AppWrapper>
      <AppLogo src={logo} alt="logo" />
      <Form>
        <TypeaheadInput options={options} />
      </Form>
    </AppWrapper>
  )
}
