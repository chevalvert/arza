/**
 * Micro language allowing user to define filename pattern for files sequence,
 * using multiple variables with different n-based indexing and 0 padding:

  {{foo:1}}.txt

  for (var foo = 0; foo < 3; foo++)

  → 1.txt
  → 2.txt
  → 3.txt

  {{foo:001}}_{{bar:0}}.txt

  for (var foo = 0; foo < 3; foo++)
    for (var bar = 0; bar < 3; foo++)

  → 001_0.txt
  → 001_1.txt
  → 001_2.txt
  → 002_0.txt
  → 002_1.txt
  → 002_2.txt
  → 003_0.txt
  → 003_1.txt
  → 003_2.txt
 */

const REGEX = {
  tag: /{{[a-zA-Z_]+:[0-9]+}}/g,
  varname: /{{([a-zA-Z_]+):[0-9]+}}/,
  numbering: /{{[a-zA-Z_]+:([0-9]+)}}/
}

export default (pattern, context) => {
  let result = pattern

  // Find all {{varname:000}} tags
  for (const tag of result.match(REGEX.tag)) {
    const varname = tag.match(REGEX.varname)[1]
    if (!varname || !context.hasOwnProperty(varname)) continue

    // {{foo:00}} will start count at 0, {{foo:01}} at 1, etc…
    const numbering = tag.match(REGEX.numbering)[1]
    const baseIndex = parseInt(numbering)
    const padLength = numbering.length
    const number = String(context[varname] + baseIndex).padStart(padLength, '0')

    result = result.replace(tag, number)
  }

  return result
}
