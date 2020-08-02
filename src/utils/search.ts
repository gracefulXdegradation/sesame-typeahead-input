import sortBy from 'lodash/sortBy'

interface SearchInputItem {
  value: string
}

const FUZZY_MATCH_THRESHOLD = 3

export function search<T extends SearchInputItem>(needle: string, haystick: T[]): T[] {
  const q = needle.trim().toLowerCase()
  if (q.length < 2) {
    return []
  }

  const results = haystick.reduce((acc, item) => {
    const dist = fuzzyMatch(q, item.value.toLowerCase())
    if (dist < FUZZY_MATCH_THRESHOLD) {
      acc.push([item, dist])
    }
    return acc
  }, [] as [T, number][])

  return sortBy(results, [(tuple: [T, number]) => tuple[1]])
    .map((tuple: [T, number]) => tuple[0])
}

const fuzzyMatch = (query: string, term: string) => {
  const queryPieces = query.split(' ')
  const termPieces = term.split(' ')
  if (queryPieces.length > termPieces.length) {
    return FUZZY_MATCH_THRESHOLD
  }
  const dists = queryPieces.map(q => {
      return Math.min(...termPieces.map(t =>
        calculateDist(q, t)
      ))
    }
  )

  return Math.max(...dists) < FUZZY_MATCH_THRESHOLD ? Math.min(...dists) : FUZZY_MATCH_THRESHOLD
}

const calculateDist = (query: string, term: string): number => {
  if (term.startsWith(query) || term.endsWith(query)) {
    return Math.min(term.length - query.length, FUZZY_MATCH_THRESHOLD - 1)
  }

  return levenshtein(term, query)
}

export const levenshtein = (a: string, b: string): number => {
  const height = a.length, width = b.length
  let prevRow: number[] = [], curRow: number[] = [], v: number, h: number
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
