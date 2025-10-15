
function makeSquare(coord, path=[]) {
    if (coord[0] > 7 || coord[0] < 0 || coord[1] > 7 || coord[1] < 0) {
        return null;
    }
    return [coord, path];
}

function getKnightMoves(square) {
    const moves = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
    ];
    
    const validMoves = [];
    for (const move of moves) {
        const newX = square[0] + move[0];
        const newY = square[1] + move[1];
        const newSquare = makeSquare([newX, newY]);
        if (newSquare) {
            validMoves.push(newSquare);
        }
    }
    return validMoves;
}

function traverse(start, end) {
    if (start[0] === end[0] && start[1] === end[1]) {
        return [start];
    }
    let currentSquare = makeSquare(start, [start]);
    if (!currentSquare) return null; // Invalid start position
    if (end[0] < 0 || end[0] > 7 || end[1] < 0 || end[1] > 7) return null; // Invalid end position
    let q = [currentSquare];
    let visited = [currentSquare];
    while(currentSquare[0][0] !== end[0] || currentSquare[0][1] !== end[1]){
        currentSquare = q.shift();
        if(currentSquare[0][0] === end[0] && currentSquare[0][1] === end[1]){
            return currentSquare[1];
        }
        let newSquaresArray = getKnightMoves(currentSquare[0]);
        //returns coordinates of moves, empty path info
        for (let square of newSquaresArray) {
            let newPath = [...currentSquare[1]] //get previous path info to add to
            newPath.push(square[0]);
            square = [square[0], newPath]; //make array into square object that includes path info
            if (!visited.includes(square[0].join(','))) { //compare strings since arrays will be different objects
                q.push(square);
                visited.push(square[0].join(','));  // Push string for comparison
            }
        }
    }
}

// Utility function to convert chess notation to coordinates
function chessToCoords(notation) {
    const file = notation.charAt(0).toLowerCase();
    const rank = parseInt(notation.charAt(1));
    
    const fileNum = file.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankNum = 8 - rank; // Convert to 0-7 where 0 is rank 8
    
    return [rankNum, fileNum];
}

// Utility function to convert coordinates to chess notation
function coordsToChess(coords) {
    const rank = 8 - coords[0]; // Convert back to 1-8
    const file = String.fromCharCode('a'.charCodeAt(0) + coords[1]);
    
    return file + rank;
}

// Export functions for testing and web use
export {
    makeSquare,
    getKnightMoves,
    traverse,
    chessToCoords,
    coordsToChess
};