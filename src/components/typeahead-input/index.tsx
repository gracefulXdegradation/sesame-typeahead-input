import React, { useState, useEffect, useCallback } from 'react'
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
  border-radius: .25rem;
  padding: .5rem;
  font-size: 1rem;
  color: #333;
  letter-spacing: 0.2px;
`

interface TypeaheadInputProps {
  placeholder: string
  onValueChange: (value: string) => void
}

// TODO fetch async from server
const fetchSuggestions = (pattern: string) => search(pattern, terms)

export const TypeaheadInput = (props: TypeaheadInputProps) => {
  const [value, setValue] = useState('')
  const [pattern, setPattern] = useState('')
  const [suggestions, setSuggestions] = useState([] as SearchOutputItem[])
  const { onValueChange } = props

  useEffect(() => {
    setSuggestions(fetchSuggestions(pattern))
  }, [pattern])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(e.target.value)
    setValue('')
  }

  const handleSelect = useCallback((s: SearchOutputItem) => {
    setValue(s.value)
    setPattern('')
    onValueChange(s.value)
  }, [onValueChange])

  return (
    <InputWrapper role="combobox">
      <Input
        value={value || pattern}
        type="text"
        placeholder={props.placeholder}
        onChange={handleInputChange}
      />
      <SuggestionList
        suggestions={suggestions}
        limit={Math.min(suggestions.length, 5)}
        onSelect={handleSelect}
      />
    </InputWrapper>
  )
}
