const TreeModel = require('tree-model')
const Debug = require('debug')
const Tree = new TreeModel()

const debug = Debug('beam-search')

const addOne = x => (x + 1)
const notEmpty = arr => (arr.length > 0)


class BeamSearch {
  constructor(options) {
    this.options = {
      width: Object.assign({
        initial: 1,
        next: addOne,
      }, options.width || {}),
      generateChildren: options.childrenGenerator,
      compareNodes: options.childrenComparator,
      isSolution: options.solutionValidator,
      enoughSoultions: options.enoughSoultions || notEmpty,
    }
    this.options.width.max = this.options.width.max || this.options.width.initial
  }

  searchFrom(seed) {
    const root = Tree.parse(Object.assign({}, seed, {
      children: [],
    }))

    const {generateChildren, compareNodes, isSolution, enoughSoultions} = this.options

    const solutions = []

    let width = this.options.width.initial
    const max = this.options.width.max > 0 ? this.options.width.max : width

    while (width <= max) {
      let open = [root]
      let nodeCount = 1
      let openCount = 1

      debug(`Using beam width: ${width}`)
      while (open.length > 0) {
        const nietos = []
        open.forEach(thisNode => {
          debug(`Opening node: ${JSON.stringify(thisNode.model)}`)

          const opciones = generateChildren(thisNode.model)
          debug(`Generated ${opciones.length} children`)

          opciones
            .forEach(c => {
              const childNode = Tree.parse(c)
              thisNode.addChild(childNode)

              if (isSolution(childNode.model)) {
                solutions.push(childNode.model)
              }
              else {
                nietos.push(childNode)
              }
            })
        })
        nodeCount += nietos.length

        open = nietos
          .sort( (a,b) => compareNodes(a.model, b.model) )
          .slice(0, (width === -1 ? undefined : width))

        openCount += open.length
      }

      debug(`${nodeCount} nodes created, ${openCount} nodes explored`)

      if (this.options.enoughSoultions && enoughSoultions(solutions)) {
        break
      }

      width = this.options.width.next(width)
    }

    return solutions
  }
}

module.exports = BeamSearch