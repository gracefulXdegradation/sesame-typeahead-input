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
`

const HighlightedSuggestion = styled(PlainSuggestion)`
  color: white;
  border-color: white;
`

const formatSuggestion = <T extends SearchOutputItem>({value, highlight}: T): JSX.Element => {
  return (
    <span dangerouslySetInnerHTML={{
      __html: value
        .split('')
        .reduce((acc, v, i) => acc + (highlight[i] === '1' ? `<b>${v}</b>` : v), '')
        .replace(/<\/b><b>/g, '')
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
