/**
 * Parse a query string into an array of numbers
 * 
 * @param {string | string[]} querystring Query string passed from next router
 * @returns {number[]} Array of numbers
 */
export function parse(querystring: string | string[]): number[] {
  if (typeof querystring === 'string') {
    return [querystring].map((queryvar) => {
    return parseInt(queryvar)
    });
  } else if (Array.isArray(querystring)) {
    return querystring.map((queryvar) => {
      return parseInt(queryvar)
    });
  } else {
    return [];
  }
}