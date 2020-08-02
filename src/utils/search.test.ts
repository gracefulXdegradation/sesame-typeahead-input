import { terms } from './terms'
import { search, levenshtein } from './search'


const doSearch = (() => {
  const items = terms.map(value => ({ value }))
  return (query: string): string =>
    search(query, items).map(({ value }) => value).join(', ')
})()

test(`levenshtein('meilenstein', 'levenshtein') => 4`, () => {
  expect(levenshtein('meilenstein', 'levenshtein')).toBe(4)
})

test(`levenshtein('honda', 'hyundai') => 3`, () => {
  expect(levenshtein('honda', 'hyundai')).toBe(3)
})

test(`levenshtein('duraim', 'durian') => 3`, () => {
  expect(levenshtein('duraim', 'durian')).toBe(3)
})

test(`levenshtein('durai', 'durian') => 2`, () => {
  expect(levenshtein('durai', 'durian')).toBe(2)
})

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
