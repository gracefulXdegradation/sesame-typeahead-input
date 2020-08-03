import React, { useState, useEffect } from 'react'
import { terms } from '../../utils/terms'
import styled from 'styled-components'
import { search, SearchOutputItem } from '../../utils/search'
import { SuggestionList } from './suggestion-list'

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`

const Input = styled.input`
  width: 100%;
`

interface TypeaheadInputProps {
  placeholder: string
}

// TODO fetch async from server
const fetchSuggestions = (pattern: string) => search(pattern, terms)

export const TypeaheadInput = (props: TypeaheadInputProps) => {
  const [pattern, setPattern] = useState('')
  const [suggestions, setSuggestions] = useState([] as SearchOutputItem[])

  useEffect(() => {
    setSuggestions(fetchSuggestions(pattern))
  }, [pattern])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)

  return (
    <InputWrapper role="combobox">
      <Input
        type="text"
        placeholder={props.placeholder}
        onChange={handleInputChange}
      />
      <SuggestionList
        suggestions={suggestions}
        limit={Math.min(suggestions.length, 5)}
      />
    </InputWrapper>
  )
}
