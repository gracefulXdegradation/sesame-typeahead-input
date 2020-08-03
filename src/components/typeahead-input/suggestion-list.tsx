import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { SearchOutputItem } from '../../utils/search'
import { Suggestion } from './suggestion'

const suggestionHeight = 32

const List = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;
  max-height: ${5 * suggestionHeight}px;
`

interface SuggestionListProps {
  suggestions: SearchOutputItem[]
  limit: number
  onSelect: (s: SearchOutputItem) => void
}

export const SuggestionList = (props: SuggestionListProps) => {
  const [ highlight, setHighlight ] = useState(-1)
  const { suggestions, onSelect } = props

  useEffect(() => {
    setHighlight(0)
  }, [props.suggestions])

  const handleKeyPress = useCallback(e => {
    if (e.keyCode === 38) {
      setHighlight(h => !h ? suggestions.length - 1 : h - 1)
    }
    if (e.keyCode === 40) {
      setHighlight(h => (h + 1) % suggestions.length)
    }
    if (e.keyCode === 13) {
      onSelect(suggestions[highlight])
      e.preventDefault()
    }
  }, [suggestions, onSelect, highlight]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <List role="listbox">
      {props.suggestions.map((suggestion, i) => (
        <Suggestion
          key={suggestion.id}
          suggestion={suggestion}
          highlighted={i === highlight}
          ind={i}
          onMouseOver={setHighlight}
          onSelect={props.onSelect}
        />
      ))}
    </List>
  )
}
