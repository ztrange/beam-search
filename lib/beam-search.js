const TreeModel = require('tree-model')
const Tree = new TreeModel()


const addOne = x => (x + 1)
const notEmpty = arr => (arr.length > 0)


class BeamSearch {
  constructor(options) {
    this.generateChildren = options.childrenGenerator
    this.compareNodes = options.childrenComparator
    this.isSolution = options.solutionValidator
    this.maxWidth = options.maxWidth || -1
    this.startingWidth = options.startingWidth || 1
    this.increaseWidth = options.widthStep || addOne
    this.enoughSoultions = options.growthStop || notEmpty
  }

  strartFrom(data) {
    const root = Tree.parse(Object.assign({}, data, {
      children: [],
    }))

    const solutions = []
    let width = this.startingWidth

    while (width <= this.maxWidth) {
      let open = [root]
      // let nodeCount = 1
      // let openCount = 1

      // console.log(`Intentando con BEAM_WIDTH = ${width}`)
      while (open.length > 0) {
        const nietos = []
        open.forEach(thisNode => {

          const opciones = this.generateChildren(thisNode.model)

          opciones
            .map(c => Tree.parse(c))
            .forEach(c => {
              thisNode.addChild(c)

              if (this.isSolution(c.model)) {
                solutions.push(c.model)
              }
              else {
                nietos.push(c)
              }
            })
        })
        // nodeCount += nietos.length

        open = nietos
          .sort( (a,b) => this.compareNodes(a.model, b.model) )
          .slice(0, (width === -1 ? undefined : width))

        // openCount += open.length
      }

      // console.log(`Con BEAM_WIDTH: ${width}, se crearon ${nodeCount} nodos y se exploraron ${openCount}`)

      if (this.enoughSoultions && this.enoughSoultions(solutions)) {
        break
      }

      width = this.increaseWidth(width)
    }

    return solutions
  }
}

module.exports = BeamSearch
