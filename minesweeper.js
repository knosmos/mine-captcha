// Minefield generation and rendering
let width = 4;
let height = 4;
let num_bombs = 4; // May make this a random number

let display_chance = 0.9; // Probability that a square is uncovered
let minefield;
let selected;

// Make minefield
function generate_minefield(){    
    // Create matrix (there are more compact ways but this is more readable)
    let minefield = [];
    for (let i=0; i<height; i++){
        let row = [];
        for (let j=0; j<width; j++){
            row.push(0);
        }
        minefield.push(row);
    }

    // Plant bombs randomly
    for (let i=0; i<num_bombs; i++){
        while (true){
            let bomb_x = Math.floor(Math.random()*width);
            let bomb_y = Math.floor(Math.random()*height);
            if (minefield[bomb_y][bomb_x] == 0){
                minefield[bomb_y][bomb_x] = 9;
                break;
            }
        }
    }

    // Generate the remaining numbers
    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            if (minefield[i][j] != 9){
                let num_surrounding_bombs = 0;
                for (let y=i-1; y<=i+1; y++){
                    if (y >= 0 && y < height){
                        for (let x=j-1; x<=j+1; x++){
                            if (x >= 0 && x < width){
                                if (minefield[y][x] == 9){
                                    num_surrounding_bombs ++;
                                }
                            }
                        }                        
                    }
                }
                minefield[i][j] = num_surrounding_bombs;
            }
        }
    }
    // console.log(minefield);
    return minefield;
}

// Render the minefield
function render_minefield(minefield){
    let tile_grid = document.getElementById("tile-grid");
    tile_grid.innerHTML = "";
    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            let num = minefield[i][j];
            if (num == 9){
                num = 0;
            }
            if (Math.random() > display_chance){
                num = 0;
            }
            let image_num = Math.floor(Math.random()*2);
            tile_grid.innerHTML += `<div class=img onmousedown="select(${j}, ${i}, this)"><img src=img/${num}/${image_num}.jpg></div>`;
        }
    }
}

function make_minefield(){
    minefield = generate_minefield();
    render_minefield(minefield);
    
    selected = [];
    for (let i=0; i<height; i++){
        let row = [];
        for (let j=0; j<width; j++){
            row.push(0);
        }
        selected.push(row);
    }
}
make_minefield();

// Mine selection and verification

function select(x,y,elem){
    elem.classList.toggle("selected");
    if (selected[y][x] == 1){
        selected[y][x] = 0;
    }
    else{
        selected[y][x] = 1;
    }
}

function verify(){
    // Verify that all bombs are selected, and no other squares are selected
    // console.log(selected);
    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            if (selected[i][j] == 0 && minefield[i][j] == 9){
                // console.log(i,j);
                return false;
            }
            if (selected[i][j] == 1 && minefield[i][j] != 9){
                // console.log(i,j);
                return false;
            }
        }
    }
    return true;
}

function verification_handler(){
    let solved = verify();
    if (solved){
        location.href="correct.html";
    }
    else{
        // alert("incorrect");
        make_minefield();
    }
}