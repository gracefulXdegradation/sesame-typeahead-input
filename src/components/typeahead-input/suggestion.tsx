import React, { useCallback } from 'react'
import styled from 'styled-components'
import { SearchOutputItem } from '../../utils/search'

const suggestionHeight = 32

const PlainSuggestion = styled.li`
  cursor: pointer;
  min-height: ${suggestionHeight}px;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid transparent;
  padding: .5rem;
  font-size: 1rem;
  color: #333;
  letter-spacing: 0.2px;

  em {
    color: rgb(255, 122, 112);
    font-style: normal;
  }
`

const HighlightedSuggestion = styled(PlainSuggestion)`
  background: #ccc;
`

const formatSuggestion = <T extends SearchOutputItem>({value, highlight}: T): JSX.Element => {
  return (
    <span dangerouslySetInnerHTML={{
      __html: value
        .split('')
        .reduce((acc, v, i) => acc + (highlight[i] === '1' ? `<em>${v}</em>` : v), '')
        .replace(/<\/em><em>/g, '')
    }} />
  )
}

interface SuggestionProps {
  highlighted: boolean
  suggestion: SearchOutputItem
  ind: number
  onMouseOver: (i: number) => void
  onSelect: (s: SearchOutputItem) => void
}

export const Suggestion = (props: SuggestionProps) => {
  const content = formatSuggestion(props.suggestion)

  const handleMouseOver = useCallback(
    e => props.onMouseOver(props.ind),
    [props]
  )

  const handleClick = useCallback(
    e => props.onSelect(props.suggestion),
    [props]
  )

  const SuggestionComponent = props.highlighted ? HighlightedSuggestion : PlainSuggestion

  return (
    <SuggestionComponent
      onMouseEnter={handleMouseOver}
      onMouseMove={handleMouseOver}
      onClick={handleClick}
    >
      {content}
    </SuggestionComponent>
  )
}
