# beam-search

beam-search is an ES2015 implementation of a 'width increasing' beam search using a tree

## Installation
```bash
$ npm install git+https://github.com/ztrange/beam-search.git
```

## Usage
```js
const beam = new BeamSearch(options)

const solutions = beam.strartFrom(rootNode)
```

## API Reference

### Create a new BeamSearch

Create a new BeamSearch with the given options.

```js
const beam = new BeamSearch(options)
```
Valid properties for the options object are:

* `childrenGenerator` **required** - A function that takes one node and returns an array of all children nodes
* `solutionValidator` **required** - A function that takes a node and returns a truthy value if the node represents a solution of the search
* `childrenComparator` **required** - A function that defines the sort order when discriminating children nodes according to beam-width. It should work on an array of nodes with the Array.protoype.sort function.
* `maxWidth` - Max value for beam-width. If defined, the beam search will be executed while no solution is found, or until beam-width exceeds the max value.
* `startingWidth` - Starting beam-width value for the search
* `widthStep` - A function that will be executed whenever the beam-width must be incremented. If undefined, the default value is a single-unit increment.


### startSearch from root node

Pass a root node and execute the search using the provided options. Returns an array with found solutions.

```js
Node[] beam.startFrom(rootNode)
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
