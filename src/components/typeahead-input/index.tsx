import React, { useState } from 'react'
import styled from 'styled-components'
import { search, SearchOutputItem, SearchInputItem } from '../../utils/search'

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`

const Input = styled.input`
  width: 100%;
`

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const MatchItem = styled.span``

const Option = styled.li``

interface TypeaheadInputProps {
  options: SearchInputItem[]
}

const highlightSearchMatch = <T extends SearchOutputItem>({value, highlight}: T): JSX.Element => {
  return (
    <span dangerouslySetInnerHTML={{
      __html: value
        .split('')
        .reduce((acc, v, i) => acc + (highlight[i] === '1' ? `<b>${v}</b>` : v), '')
        .replace(/<\/b><b>/g, '')
    }} />
  )
}

export const TypeaheadInput = (props: TypeaheadInputProps) => {
  const [pattern, setPattern] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)

  const matches = search(pattern, props.options)

  return (
    <InputWrapper role="combobox">
      <Input
        type="text"
        placeholder="Yummy"
        onChange={handleInputChange}
      />
      <OptionsList role="listbox">
        {matches.map((option, i) => (
          <Option key={option.id}>{highlightSearchMatch(option)}</Option>
        ))}
      </OptionsList>
    </InputWrapper>
  )
}
