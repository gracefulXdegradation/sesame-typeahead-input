import React from 'react'
import styled from 'styled-components'
import { TypeaheadInput } from '../typeahead-input'
import logo from './logo.svg'
import { yummies } from './yummies'

const AppWrapper = styled.div`
  text-align: center;
  background-color: rgb(4, 65, 114);
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`

const AppLogo = styled.img`
  height: 80px;
`

export const App = () => {
  return (
    <AppWrapper>
      <AppLogo src={logo} alt="logo" />
      <TypeaheadInput options={yummies} />
    </AppWrapper>
  )
}
