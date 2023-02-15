
class Cell{
    /**
     * 
     * @param {number} x row coordinate
     * @param {number} y col coordinate
     */
    constructor(x,y){
        this.x = x
        this.y = y
        this.g_cost = 1000
        this.h_cost = 1000
        this.f_cost = 1000
        this.isTraversable = true
        this.parent = null
    }

    /**
     * calculates distance between this cell and the cell passed
     * @param {Cell} cell 
     * @returns {number}
     */
    distance(cell) {
        let catetoX = (this.x-cell.x)*10
        let catetoY = (this.y-cell.y)*10
        return Math.trunc(Math.sqrt(Math.pow(catetoX,2)+Math.pow(catetoY,2)))
    }
    /**
     * recursive function to set g,h,f costs to this cell
     * @param {Cell} cell1 startCell (user call)
     * @param {Cell} cell2 endCell (user call)
     * @param {boolean} isStart optional parameter for recursive call
     */
    setCost(cell1,cell2,isStart=true){
        dist = this.distance(cell1)
        if(isStart){
            this.g_cost = dist;
            this.setCost(cell2,cell1,false)
        }
        else{
            this.h_cost = dist;
            this.f_cost = this.g_cost+this.h_cost
        }
    }
    /**
     * returns true if this cell and passed cell are neighbours
     * (if the two cells have at least a common corner)
     * @param {Cell} cell cell to check
     * @returns boolean
     */
    isNeighbour(cell){
        if(this!=cell){
            let dX = Math.abs(this.x-cell.x)
            let dY = Math.abs(this.y-cell.y)
            return (dX<=1 && dY<=1)
        }
        else return false
    }
    /**
     * returns an array containing Cell objects which are neighbours of this cell
     * @param {Array} grid Matrix containig all Cell objects
     * @returns Array 
     */
    neigbours(grid){
        let temp = []
        grid.forEach(i => {
            i.forEach(cell => {
                if(this.isNeighbour(cell)) temp.push(cell)
            });
        });
        return temp
    }
}
/**
 * initializes grid by adding Cell objects
 * it also sets if a cell is obstacle
 * @param {Array} grid Matrix containing all Cell objects
 * @param {Array} dimensions array containing grid dimensions
 * @param {Array} obstacles array containing obstacles coordinates
 */
function initGrid(grid,dimensions,obstacles){
    for (let i = 0; i < dimensions[0]; i++) {
        grid.push([])
        for (let j = 0; j < dimensions[1]; j++) {
            grid[i].push(new Cell(i,j))
            obstacles.forEach(coord => {
                if(i==coord[0] && j==coord[1]) grid[i][j].isTraversable = false // if cell in obstacles, set to obstacle (not traversable)
            });
        }        
    }
}

/**
 * returns best open cell based on f cost and h cost
 * @param {Array} openCells array of currently open cells
 * @returns {Cell}
 */
function getLowest(openCells){
    let min = openCells[0]
    openCells.forEach(neighbour => {
        if(neighbour.f_cost <= min.f_cost && neighbour.h_cost < min.h_cost){
            min = neighbour
        }
    });
    return min
}

/**
 * returns path array by reading each cell parent until it reaches start cell
 * then reverses the array
 * @param {Cell} start start cell
 * @param {Cell} end end cell
 * @returns {Array}
 */
function getPath(start,end){
    let path = []
    let current = end.parent
    
    while(current != start){
        //console.log(current)
        path.push(current)
        current = current.parent
    }
    return path.reverse()
}
/**
 * 
 * @param {Array} grid_dimension [x,y] array containing displayed grid dimensions  
 * @param {Array} obstacles array containing obstacles coordinates in array pairs
 * @param {Array} start array containing start tile coordinates 
 * @param {Array} end array containing end tile coordinates 
 * @returns Array containing path from start to end and closed array
 */
window.Astar_pathfinder = function Astar_pathfinder(grid_dimension,obstacles,start,end){
    let grid = [],OPEN=[],CLOSED=[],PATH=[] // griglia, nodi da esaminare, nodi esaminati, lista dei nodi del percorso
    initGrid(grid,grid_dimension,obstacles);
    let startCell = grid[start[0]][start[1]]
    let endCell = grid[end[0]][end[1]]

    OPEN.push(startCell) // add start node to open

    while(OPEN.length){ // main algorithm loop
        let current = getLowest(OPEN)           // current = node in open with lowest f_cost
        OPEN.splice(OPEN.indexOf(current),1)    // remove current from open
        CLOSED.push(current)                    // add current to closed

        if(current==endCell){                   // if current is the target node:
            
            PATH = getPath(startCell,endCell)   // trace path
            break
        }
        
        current.neigbours(grid).forEach(neighbour => { // foreach neighbour of current node
            if(CLOSED.includes(neighbour) || !neighbour.isTraversable){ // if neighbour is not traversable or neighbour is in closed, continue
                return;
            }
            let newCost = current.g_cost + current.distance(neighbour)  // cost of new path
            if(newCost < neighbour.g_cost || !(OPEN.includes(neighbour)) ){    // if new path to neighbour is shorter or neighbour is not open
                neighbour.g_cost = newCost
                neighbour.h_cost = neighbour.distance(endCell)
                neighbour.f_cost = neighbour.g_cost + neighbour.h_cost // set f_cost of neighbour
                neighbour.parent = current  // set parent to current
                if(!(OPEN.includes(neighbour))){   // if neighbour is not open, open it
                    OPEN.push(neighbour)
                }
            }
        });
    }
    return [PATH,CLOSED];
}




