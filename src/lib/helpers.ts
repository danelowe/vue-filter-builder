/**
 * Strip outer parentheses from a string, while maintaining balance.
 *
 * e.g. '(one),(two)' would not have the parentheses stripped because the outermost ones don't match
 * '((one), (two))' would be converted to (one), (two)
 * @param string
 */
export function removeOuterParentheses(string: string) {
  return string
  let count: {[k: string]: number} = {}
  let num = 0
  const primitivesArr = []

  for(let i = 0; i < string.length; i++){
    count[string[i]] = count[string[i]] ? ++count[string[i]] : 1
    if(count['('] === count[')']){
      primitivesArr.push(string.slice(num, i + 1))
      count = {}
      num = i + 1
    }
  }
  for(let primitive in primitivesArr){ primitivesArr[primitive] = primitivesArr[primitive].slice(1, primitivesArr[primitive].length - 1) }
  return primitivesArr.join('')
}

/**
 * Generate an array with numbers between from and to inclusive
 * @param from
 * @param to
 */
export function range(from: number, to: number): number[] {
  const array: number[] = []
  for (let i = from; i <= to; i++) {
    array.push(i)
  }
  return array
}

/**
 * Format a date according to user's locale
 *
 * @param isoString
 */
export function formatDate(isoString: string) {
  return new Date(Date.parse(isoString)).toLocaleDateString()
}

/**
 * Generate a random unique ID, not for crypto.
 */
export function uniqid() {
  return Math.random().toString(16).slice(2)
}

