import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { SearchOutputItem } from '../../utils/search'
import { Suggestion } from './suggestion'

const suggestionHeight = 32

const List = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  margin-top: .25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;
  max-height: ${5 * suggestionHeight}px;
  background: #eee;
  border-radius: 2px 2px 4px 4px;
`

interface SuggestionListProps {
  suggestions: SearchOutputItem[]
  limit: number
  onSelect: (s: SearchOutputItem) => void
  onMouseOver: (s: SearchOutputItem) => void
  onMouseOut: () => void
}

export const SuggestionList = (props: SuggestionListProps) => {
  const [ highlight, setHighlight ] = useState(-1)
  const { suggestions, onSelect, onMouseOver, onMouseOut } = props

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
  }, [suggestions, onSelect, highlight])

  const highlightWithPreview = useCallback((i: number) => {
    setHighlight(i)
    onMouseOver(suggestions[i])
  }, [onMouseOver, suggestions])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <List
      role="listbox"
      onMouseOut={onMouseOut}
    >
      {props.suggestions.map((suggestion, i) => (
        <Suggestion
          key={suggestion.id}
          suggestion={suggestion}
          highlighted={i === highlight}
          ind={i}
          onMouseOver={highlightWithPreview}
          onSelect={props.onSelect}
        />
      ))}
    </List>
  )
}
