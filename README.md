# beam-search

beam-search is an ES2015 implementation of a 'width increasing' beam search using a tree

## Installation
```bash
$ npm install git+https://github.com/ztrange/beam-search.git
```

## API Reference

### Create a new BeamSearch

Create a new BeamSearch with the given options.

```js
const beam = new BeamSearch(options)
```

Valid properties for the options object are:

```js
{
  /*
  A required function that takes one node and returns an array of all 
  children nodes
  */
  childrenGenerator: node => [ node_children ],
  /*
  A required function that takes a node and returns wether the node 
  represents a solution of the search or not
  */
  solutionValidator: node => boolean,
  /*
  A required comparator function to pass to Array.prototype.sort
  */
  childrenComparator: (nodeA, nodeB) => Integer,
  width: {
    // Optional initial beam width for this search
    intial: Integer(1),
    /*
    Optional max value for beam width, width.initial by default.
    The search will continue until a solution is found or the current  
    beam width exceeds this value
    */
    max: Integer, 
    /*
    Optional function to adjust beam width, by default increments 
    beam width by one 
    */
    next: Integer(val) => val + 1,
  },
}
```

### Start search from root node

Pass a root node to execute the search using the provided options. Returns an array with valid solutions.

```js
const solutions = beam.searchFrom(rootNode)
```


## Example

```js
// Get the best combination of rooms for the given dates,
// using the least number of rooms

const BeamSearch = require('beam-search')

// Lets declare our range of dates
const DATES = '2016-12-12 2016-12-13 2016-12-14 2016-12-15 2016-12-16 2016-12-17 2016-12-18'.split(' ')
// And the dates when every room is available
const SCHEDULES ={
  400: ['2016-12-13', '2016-12-15', '2016-12-16', '2016-12-18'],
  401: ['2016-12-12', '2016-12-14', '2016-12-17', '2016-12-18'],
  402: ['2016-12-12', '2016-12-13', '2016-12-14', '2016-12-15'],
  404: ['2016-12-13', '2016-12-16', '2016-12-17', '2016-12-18'],
  418: ['2016-12-13', '2016-12-15', '2016-12-16'],
  420: ['2016-12-12', '2016-12-13', '2016-12-14', '2016-12-17', '2016-12-18'],
  422: ['2016-12-12', '2016-12-13', '2016-12-14', '2016-12-15', '2016-12-18'],
}

// Collect all rooms and dates covered by this path
const soFar = (path) => path.reduce( (col, { room = null, dates = [] }) => {
  if (room && dates) {
    col.rooms.push(room)
    col.dates = col.dates.concat(dates)
  }
  return col
}, { rooms: [], dates: [] })

const options = {
  // Returns all possible children for a given path
  childrenGenerator: ({ path }) => {
    const chosen = soFar(path)

    return Object.keys(SCHEDULES)
      .reduce( (col, room) => {
        if (!chosen.rooms.includes(room)) {
          const dates = SCHEDULES[room].filter( d => !chosen.dates.includes(d) )
          if (dates.length > 0) {
            // add rooms and corresponding dates that
            // this path doesn't already include
            col.push({ path: path.concat({ room, dates }) })
          }
        }
        return col
      }, [])
  },
  solutionValidator: ({ path }) => soFar(path).dates.length === DATES.length,
  childrenComparator: (nodeA, nodeB) => {
    const { dates: datesA } = soFar(nodeA.path)
    const { dates: datesB } = soFar(nodeB.path)
    return datesB.length - datesA.length
  },
}


// Initialize our search
const beam = new BeamSearch(options)
// Search from a given root node
const solutions = beam.searchFrom({ path: [] })
  // and sort results by least amount of rooms
  .sort( (s1, s2) => s1.path.length - s2.path.length )

console.log(
  // Pretty print the results
  solutions.reduce( (col, { path }) => {
    const solution = []
    path.forEach( ({ room, dates }) => solution
      .push(...dates.map( d => `${d} - Room/1.1 ${room}`))
    )

    col.push(solution.sort().join('\n'))
    return col
  }, [])
  .join('\n----\n')
)
```

Which prints a series of solutions, ordered by the ones with the least amount of rooms needed to produce it, like so:

```
2016-12-12 - 420
2016-12-13 - 420
2016-12-14 - 420
2016-12-15 - 400
2016-12-16 - 400
2016-12-17 - 420
2016-12-18 - 420
----
2016-12-12 - 420
2016-12-13 - 420
2016-12-14 - 420
2016-12-15 - 418
2016-12-16 - 418
2016-12-17 - 420
2016-12-18 - 420
----
2016-12-12 - 420
2016-12-13 - 420
2016-12-14 - 420
2016-12-15 - 402
2016-12-16 - 400
2016-12-17 - 420
2016-12-18 - 420
```


## Contributors
 * [unRob](https://github.com/unRob)

## License 

(The MIT License)

Copyright (c) 2017 Mario Ferreira &lt;ztrange@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Changelog

**1.0.0**
 * Initial commit
