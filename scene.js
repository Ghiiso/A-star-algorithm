// global variables initialization
var gridSize = [20,20],startTile=null,endTile=null,listOfObstacles = [];


window.onload = function(){
    const wrapper = document.getElementById("tiles");
    let columns = 0, rows = 0;

    const createTile = index => { // creates single cell
        const tile = document.createElement("div");
        tile.addEventListener("click", function(){clickHandler(tile)});
        tile.classList.add("tile");
        tile.id = index
        return tile;
    }
    
    const createTiles = quantity => { // creates cell array
        Array.from(Array(quantity)).map((tile, index) => {
            wrapper.appendChild(createTile(index));
        });
    }
    
    const createGrid = (grid_size) => { // creates a grid according to grid_size
        wrapper.innerHTML = "";
        columns = grid_size[0]
        rows = grid_size[1]
        wrapper.style.setProperty("--columns", columns);
        wrapper.style.setProperty("--rows", rows);
        
        createTiles(columns * rows);
    }
    
    createGrid(gridSize);
}


// button handling
var buttonActivation = [false,false,false]; // S E O

/**
 * "onclick" function of divs with class "tile"
 * handles click and sets class according to active paint button
 * @param {Element} tile 
 */
function clickHandler(tile){
    let tileIndex = tile.id
    let tileRow = Math.trunc(tileIndex/gridSize[1]) // posizione y
    let tileCol = tileIndex - (tileRow*gridSize[1]) // posizione x
    const tileArray = document.getElementsByClassName("tile");
    let button=()=>{ // button represents wich button is active now
        for (let i = 0; i < buttonActivation.length; i++) {
            if(buttonActivation[i]) return i;
        }
    }
    switch (button()) {
        case 0: // start
            if(!tile.classList.contains("end") && !tile.classList.contains("obstacle")){ // if tile is not end or obstacle
                for(let b of tileArray) b.classList.remove("start")
            
            tile.classList.add("start")
            startTile = [tileCol,tileRow]
            }
            break;
        case 1: // end
            if(!tile.classList.contains("start") && !tile.classList.contains("obstacle")){
                for(let b of tileArray) b.classList.remove("end")
            
            tile.classList.add("end")
            endTile = [tileCol,tileRow]
            }
            break;
        case 2: // obstacle
            if(!tile.classList.contains("start") && !tile.classList.contains("end")){
            tile.classList.remove("path","closed")
            tile.classList.toggle("obstacle")
        }
            break;
    }

    if(startTile!=null && endTile!=null){ // il bottone go è attivo solo quando start e end sono piazzati
        const goButton = document.getElementById("go").firstElementChild
        goButton.classList.remove("deactivated")
        goButton.classList.add("active")
    }
}
/**
 * draws path and closed cells derived from the A* algorithm
 * @param {Event} evt 
 */
function tracePath(evt){
    if(evt.currentTarget.classList.contains("active")){
        listOfObstacles = []
        let oldPath = document.getElementsByClassName("path")
        while(oldPath.length) oldPath[0].classList.remove('path') // rimuove il percorso tracciato in precedenza
        let oldClosed = document.getElementsByClassName("closed") // rimuove le celle appartenenti a CLOSED precedente
        while(oldClosed.length) oldClosed[0].classList.remove('closed')
        let obstacles = document.getElementsByClassName("obstacle")
        for(let obstacle of obstacles){ // crea la lista di ostacoli
            let tileIndex = obstacle.id
            let tileRow = Math.trunc(tileIndex/gridSize[1]) // posizione y
            let tileCol = tileIndex - (tileRow*gridSize[1]) // posizione x
            listOfObstacles.push([tileCol,tileRow])
        }
        const path = Astar_pathfinder(gridSize,listOfObstacles,startTile,endTile) // esecuzione algoritmo
        path[0].forEach(cell => {
            let tileid = cell.y*gridSize[1]+cell.x
            document.getElementById(tileid).classList.add("path")
        });
        const showClosed = document.getElementById("showClosed")
        if(showClosed.checked){ // disegna le celle in CLOSED se showClosed è vero
            path[1].forEach(cell => {
                let tileid = cell.y*gridSize[1]+cell.x
                tile = document.getElementById(tileid)
                if(tile.classList.length<2) tile.classList.add("closed")
            });
        }
    }
}

/**
 * set the active painter button, "onclick" function of
 * buttons with class "paint"
 * @param {Event} evt calling event
 * @param {Number} buttonIndex index of calling button
 */
function setPainter(evt,buttonIndex){ // gestisce attivazione bottoni laterali
    const activeButtons = document.getElementsByClassName("active")
    for (let butt of activeButtons){ // se corrente non è il bottone cliccato => non attivo
        if(butt!=evt.currentTarget) butt.classList.remove("active");
    }
    evt.currentTarget.classList.toggle("active");
    for (let i = 0; i < buttonActivation.length; i++) {
        if(i!=buttonIndex) buttonActivation[i]=false;
        else buttonActivation[i]=!buttonActivation[i] // toggle stato attivazione del bottone
    }
}
function cls(){
    location.reload()
}

//---------------- debug

/**
 * returns current obstacles coordinates as an array of tile ids
 * @param {Array} obstacles array of obstacle coordinates
 */
function saveObstacles(obstacles){
    let temp = []
    obstacles.forEach(coord => {
        temp.push(coord[1]*gridSize[1]+coord[0])
    });
    return temp;
}

/**
 * loads a list of obstacles from an array of coordinates
 * e.g. [[x1,y1],[x2,y2],[x3,y3]...]
 * @param {Array} obstacles array of obstacle coordinates
 */
function loadObstacles(obstacles){
    listOfTileid = saveObstacles(obstacles)
    const tiles = document.getElementsByClassName("tile")
    console.log(tiles[0].id+" ",listOfTileid.includes(tiles[0].id))
    for(let tile of tiles){
        if(listOfTileid.includes(parseInt(tile.id))) tile.classList.add("obstacle")
    }

}