import { terms } from './terms'
import { search, levenshtein, fuzzyMatch, MatchItem } from './search'

describe('levenshtein', () => {
  test(`'meilenstein', 'levenshtein' => 4`, () => {
    expect(levenshtein('meilenstein', 'levenshtein')).toBe(4)
  })

  test(`'duraim', 'durian' => 3`, () => {
    expect(levenshtein('duraim', 'durian')).toBe(3)
  })

  test(`'durai', 'durian' => 2`, () => {
    expect(levenshtein('durai', 'durian')).toBe(2)
  })

  test(`'durian', 'durian' => 0`, () => {
    expect(levenshtein('durian', 'durian')).toBe(0)
  })
})

describe('fuzzy match', () => {
  const doFuzzyMatch = (query: string, term: string, expectedHighlight: string) => {
    const match = fuzzyMatch(query, term)
    expect(match).toBeDefined()
    expect((match as MatchItem).highlight).toBe(expectedHighlight)
  }

  test('nam c', () => doFuzzyMatch('nam c', 'surinam cherry', '00001110100000'))
  test('cherrymoya', () => doFuzzyMatch('cherrymoya', 'cherimoya', '111111111'))
  test('surina', () => doFuzzyMatch('surina', 'surinam cherry', '11111100000000'))
})

describe('search', () => {
  const doSearch = (() => {
    const items = terms.map((value, i) => ({ value, id: i }))
    return (query: string): string =>
      search(query, items).map(({ value }) => value).join(', ')
  })()

  test('mango => Mango, Mangosteen, Purple mangosteen', () => {
    expect(doSearch('mango')).toBe('Mango, Mangosteen, Purple mangosteen')
  })

  test('CADO => Avocado, Avocado', () => {
    expect(doSearch('CADO')).toBe('Avocado, Avocado')
  })

  test('pea => Pea, Pear, Peach', () => {
    expect(doSearch('pea')).toBe('Pea, Pear, Peach')
  })

  test('AçAí12 => Açaí', () => {
    expect(doSearch('AçAí12')).toBe('Açaí')
  })

  test('cheri => Cherimoya, Cherry, Chili pepper, Surinam cherry', () => {
    expect(doSearch('cheri')).toBe('Cherimoya, Cherry, Chili pepper, Surinam cherry')
  })

  test('nam c => Surinam cherry', () => {
    expect(doSearch('nam c')).toBe('Surinam cherry')
  })

  test(`'' => ''`, () => {
    expect(doSearch('')).toBe('')
  })

  test(`l => ''`, () => {
    expect(doSearch('l')).toBe('')
  })

  test(`lem => Lemon, Pea, Lime, Plum, Japanese plum`, () => {
    expect(doSearch('lem')).toBe('Lemon, Pea, Lime, Plum, Japanese plum')
  })

  // TODO Bell pepper looks odd here
  test(`melo => Melon, Pomelo, Bell pepper`, () => {
    expect(doSearch('melo')).toBe('Melon, Pomelo, Bell pepper')
  })
})
