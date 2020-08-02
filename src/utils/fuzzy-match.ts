import sortBy from 'lodash/sortBy'

interface FuzzyMatchInputItem {
  value: string
}

const FUZZY_MATCH_THRESHOLD = 3

export function fuzzyMatch<T extends FuzzyMatchInputItem>(needle: string, haystick: T[]): T[] {
  const q = needle.replace(/\W/g, '').toLowerCase()
  const results = haystick.reduce((acc, item) => {
    const dist = calculateDist(q, item.value.toLowerCase())

    if (dist < FUZZY_MATCH_THRESHOLD) {
      acc.push([item, dist])
    }
    return acc
  }, [] as [T, number][])

  return sortBy(results, [(tuple: [T, number]) => tuple[1]]).map((tuple: [T, number]) => tuple[0])
}

const calculateDist = (query: string, term: string): number => {
  if (term === query) {
    return 0
  }

  if (query.length >= 2 && (term.startsWith(query) || term.endsWith(query))) {
    return Math.min(term.length - query.length, FUZZY_MATCH_THRESHOLD - 1)
  }

  return levenshtein(term, query)
}

const levenshtein = (a: string, b: string): number => {
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
