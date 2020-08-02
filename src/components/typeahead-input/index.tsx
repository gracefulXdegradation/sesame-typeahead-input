import React, { useState } from 'react'
import styled from 'styled-components'
import { fuzzyMatch } from '../../utils/fuzzy-match'

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

const Option = styled.li`
  
`

interface InputOption {
  value: string
  id: number
  dist?: number
}

interface Match extends InputOption {
  displayValue: any
}

interface TypeaheadInputProps {
  options: InputOption[]
}

export const TypeaheadInput = (props: TypeaheadInputProps) => {
  const [pattern, setPattern] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)

  const matches = fuzzyMatch(pattern, props.options)

  return (
    <InputWrapper role="combobox">
      <Input
        type="text"
        placeholder="Yummy"
        onChange={handleInputChange}
      />
      <OptionsList role="listbox">
        {matches.map((option, i) => (
          <Option key={option.id}>{option.value}</Option>
        ))}
      </OptionsList>
    </InputWrapper>
  )
}
