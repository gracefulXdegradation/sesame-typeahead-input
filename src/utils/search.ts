import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import repeat from 'lodash/repeat'

export interface SearchInputItem {
  id: number
  value: string
}

export interface SearchOutputItem extends SearchInputItem {
  highlight: string
}

export interface MatchItem {
  dist: number
  highlight: string
}

const FUZZY_MATCH_THRESHOLD = 3

export function search<T extends SearchInputItem, K extends SearchOutputItem>(needle: string, haystick: T[]): K[] {
  const q = needle.trim().toLowerCase()
  if (q.length < 2) {
    return []
  }

  const results = haystick.reduce((acc, item) => {
    const match = fuzzyMatch(q, item.value.toLowerCase())
    if (match) {
      const outputItem = {
        ...item,
        highlight: match.highlight
      } as unknown as K

      acc.push([outputItem, match.dist])
    }
    return acc
  }, [] as [K, number][])

  return orderSuggestions(results)
}

export const fuzzyMatch = (query: string, term: string): MatchItem | undefined => {
  const queryPieces = query.split(' ')
  const termPieces = term.split(' ')
  if (queryPieces.length > termPieces.length) {
    return
  }
  const matches = queryPieces.map(q => {
      const queryPieceMatches = termPieces.map((t, i) => {
        const offset = termPieces.slice(0, i).reduce((off, t) => off + t.length, 0) + i
        const match = findMatch(q, t)
        return {
          ...match,
          termIndex: i,
          highlight: match.highlight.padStart(match.highlight.length + offset, '0').padEnd(term.length, '0')
        }
      })
      return minBy(queryPieceMatches, m => m.dist) as MatchItem
    }
  )

  const isQueryMatch = (maxBy(matches, m => m.dist) as MatchItem).dist < FUZZY_MATCH_THRESHOLD

  if (isQueryMatch) {
    return {
      dist: (minBy(matches, m => m.dist) as MatchItem).dist,
      highlight: mergeHighlights(matches.map(m => m.highlight), term.length)
    }
  }
}

const findMatch = (query: string, term: string): MatchItem => {
  if (term.startsWith(query)) {
    return {
      dist: 0,
      highlight: highlight(0, query.length, term.length)
    }
  }
  
  if (term.endsWith(query)) {
    return {
      dist: 1,
      highlight: highlight(term.indexOf(query), query.length, term.length)
    }
  }

  return {
    dist: levenshtein(term, query),
    highlight: highlight(0, term.length, term.length)
  }
}

const highlight = (hlStart: number, hlLength: number, wordLength: number): string =>
  repeat('0', hlStart) + repeat('1', hlLength) + repeat('0', wordLength - hlStart - hlLength)

const mergeHighlights = (hls: string[], length: number): string =>
  hls.reduce((a, b) => a | parseInt(b, 2), 0)
    .toString(2)
    .padStart(length, '0')

const orderSuggestions = <K extends SearchOutputItem>(suggestions: [K, number][]): K[] => {
  const grouped = groupBy(suggestions, tuple => tuple[1]) as Record<number, [K, number][]>
  const reduced = Object.values(grouped).reduce(
    (acc, list) => [...acc, ...sortBy(list, [tuple => tuple[0].value.length])],
    []
  )
  return reduced.map(tuple => tuple[0])
}

export const levenshtein = (a: string, b: string): number => {
  const height = a.length,
    width = b.length
  let prevRow: number[] = [],
    curRow: number[] = [],
    v: number,
    h: number
  if (!height) return width
  if (!width) return height
  for (h = 0; h <= width; h++) {
    prevRow[h] = h
  }
  for (v = 1; v <= height; v++) {
    for (curRow = [v], h = 1; h <= width; h++) {
      curRow[h] = a[v - 1] === b[h - 1]
        ? prevRow[h - 1]
        : Math.min(prevRow[h - 1], prevRow[h], curRow[h - 1]) + 1;
    }
    prevRow = curRow
  }
  return curRow[width]
}
