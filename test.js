const PROVIDERS = 6
const { randomBytes } = require('crypto')
const BeamSearch = require('./lib/beam-search')

const ALL_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  .split('')
  .slice(0, PROVIDERS)

function randomProviders (howMany) {
  const chars = [].concat(ALL_CHARS)
  const rnd = randomBytes(howMany)
  const value = new Array(howMany)

  for (let i = 0; i < howMany; i++) {
    const len = chars.length
    const index = rnd[i] % len
    const chr = chars[index]
    chars.splice(index, 1)
    value[i] = chr
  }

  return value
}

const JORNADAS = []
for (let i = 0; i < 30; i++) {
  const qty = Math.round(Math.random() * 2) + 13
  JORNADAS.push({
    day: i+1,
    providers: randomProviders(qty),
  })
}


const jornadasProveedor = JORNADAS.reduce( (col, { day, providers }) => {
  providers.forEach( p => {
    col[p] = col[p] || []
    col[p].push(day)
  })
  return col
}, {})


const opciones = Object.keys(jornadasProveedor)
  .reduce( (col, provider ) => col.concat(
    jornadasProveedor[provider]
      .reduce( (jp, d) => {
        jp[d % 2].push(d)
        return jp
      }, [[],[]] )
      .map( days => ({ provider, days }) )
  )
, [])

const mostAvailable = ({jornadas = [], providers = [], limit = 1}) => {
  const result = opciones
    .filter( ({ provider }) => providers.indexOf(provider) === -1 )
    .map( ({provider, days}) => ({
      provider,
      days: days.filter( d => jornadas.indexOf(d) === -1 ),
    }))
    .filter( ({days}) => days.length > 0 )
    .sort( (a, b) => b.days.length - a.days.length )

  return result.slice(0, (limit === -1 ? undefined : limit))
}


const beam = new BeamSearch({
  childrenGenerator: (currentNode) => {
    const soFar = currentNode.path.reduce( (col, { provider = null, days = [] }) => {
      if (provider) {
        col.providers.push(provider)
        col.jornadas = col.jornadas.concat(days)
      }
      return col
    } , {jornadas: [], providers: []} )

    return mostAvailable(Object.assign(soFar, {limit: -1}))
      .map(option => ({
        path: currentNode.path.concat(option),
        step: option,
        daysCovered: currentNode.daysCovered + option.days.length,
      }))
  },

  solutionValidator: ({daysCovered}) => {
    return daysCovered === JORNADAS.length
  },

  childrenComparator: (a, b) => {
    return b.step.days.length - a.step.days.length
  },

  maxWidth: 500,
  startingWidth: 12,
  widthStep: (w) => (w * 2),
})

const solutions = beam.strartFrom({
  path: [],
  daysCovered: 0,
})

console.log({
  results: {
    length: solutions.length,
  },
  data: (solutions || [])
    .sort((a,b) => a.path.length - b.path.length)
    .map(s => s.path)
    .shift(),
})
