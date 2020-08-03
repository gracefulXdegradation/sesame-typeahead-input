import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  * {
    box-sizing: border-box;
  }
  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
  }
  h1 {
    font-family: Montserrat;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0;
  }
  input {
    border: none;
    outline: none;
  }
`
