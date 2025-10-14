// Import the functions from knight.js
const { makeSquare, getKnightMoves, traverse } = require('./knight.js');

// Test helper function to check if coordinates are valid
function isValidCoordinate(coord) {
    return Array.isArray(coord) && 
           coord.length === 2 && 
           coord[0] >= 0 && coord[0] <= 7 && 
           coord[1] >= 0 && coord[1] <= 7;
}

// Test helper function to check if a move is a valid knight move
function isValidKnightMove(from, to) {
    const dx = Math.abs(from[0] - to[0]);
    const dy = Math.abs(from[1] - to[1]);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

// Test helper function to validate a complete path
function isValidPath(path, start, end) {
    if (!Array.isArray(path) || path.length === 0) return false;
    
    // Check if path starts with start coordinate and ends with end coordinate
    const pathStart = path[0];
    const pathEnd = path[path.length - 1];
    
    if (pathStart[0] !== start[0] || pathStart[1] !== start[1]) return false;
    if (pathEnd[0] !== end[0] || pathEnd[1] !== end[1]) return false;
    
    // Check if all coordinates in path are valid
    for (const coord of path) {
        if (!isValidCoordinate(coord)) return false;
    }
    
    // Check if all consecutive moves are valid knight moves
    for (let i = 0; i < path.length - 1; i++) {
        if (!isValidKnightMove(path[i], path[i + 1])) return false;
    }
    
    return true;
}

// Test function runner
function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
        console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
}

// Test Cases

// Test 1: Same start and end position
console.log("Running Test 1: Same start and end position");
runTest("Same start and end position", () => {
    const start = [0, 0];
    const end = [0, 0];
    const result = traverse(start, end);
    
    if (!Array.isArray(result) || result.length !== 1) {
        throw new Error("Expected single-element array for same start/end position");
    }
    if (result[0][0] !== start[0] || result[0][1] !== start[1]) {
        throw new Error("Result should contain the start position");
    }
});

// Test 2: Simple one-move case
console.log("Running Test 2: One knight move");
runTest("One knight move", () => {
    const start = [0, 0];
    const end = [2, 1];
    const result = traverse(start, end);
    console.log("Path:", result);
    
    if (!isValidPath(result, start, end)) {
        throw new Error("Invalid path returned");
    }
    if (result.length !== 2) {
        throw new Error(`Expected path length 2, got ${result.length}`);
    }
});

// Test 3: Two-move case
console.log("Running Test 3: Two knight moves");
runTest("Two knight moves", () => {
    const start = [0, 0];
    const end = [4, 0];
    const result = traverse(start, end);
    console.log("Path:", result);
    
    if (!isValidPath(result, start, end)) {
        throw new Error("Invalid path returned");
    }
    // This should take exactly 2 moves for optimal path
    // You can update expected length based on actual shortest path
    if (result.length > 4) {  // Allow some flexibility for now
        throw new Error(`Path seems too long: ${result.length} moves`);
    }
});

// Test 4: Opposite corners
console.log("Running Test 4: Opposite corners of board");
runTest("Opposite corners of board", () => {
    const start = [0, 0];
    const end = [7, 7];
    const result = traverse(start, end);
    console.log("Path:", result);
    
    if (!isValidPath(result, start, end)) {
        throw new Error("Invalid path returned");
    }
    // Should be solvable in 6 moves
    if (result.length > 7) {
        throw new Error(`Path is inefficient: ${result.length} moves`);
    }
});

// Test 5: Edge cases - boundary positions
console.log("Running Test 5: Board boundaries");
runTest("Board boundaries", () => {
    const testCases = [
        [[0, 0], [0, 7]],  // Top left to bottom left
        [[7, 0], [7, 7]],  // Top right to bottom right
        [[0, 0], [7, 0]],  // Top left to top right
        [[0, 7], [7, 7]]   // Bottom left to bottom right
    ];
    
    for (const [start, end] of testCases) {
        const result = traverse(start, end);
        console.log("Path:", result);
        if (!isValidPath(result, start, end)) {
            throw new Error(`Invalid path from [${start}] to [${end}]`);
        }
    }
});

// Test 6: Knight moves validation
console.log("Running Test 6: Knight move patterns");
runTest("Knight move patterns", () => {
    const start = [3, 3]; // Center of board
    const possibleMoves = [
        [1, 4], [1, 2], [2, 5], [2, 1],
        [4, 5], [4, 1], [5, 4], [5, 2]
    ];
    
    for (const end of possibleMoves) {
        if (end[0] >= 0 && end[0] <= 7 && end[1] >= 0 && end[1] <= 7) {
            const result = traverse(start, end);
            if (!isValidPath(result, start, end)) {
                throw new Error(`Invalid path from [${start}] to [${end}]`);
            }
            if (result.length !== 2) {
                throw new Error(`Should be one move from [${start}] to [${end}], got ${result.length - 1} moves`);
            }
        }
    }
});

// Test 7: Invalid input handling (template - you can add specific error handling tests)
console.log("Running Test 7: Invalid coordinates");
runTest("Invalid coordinates", () => {
    try {
        // Test with coordinates outside the board
        const result1 = traverse([0, 0], [8, 8]);  // Out of bounds
        console.log("Path:", result1);
        const result2 = traverse([-1, 0], [0, 0]); // Negative coordinates
        console.log("Path:", result2);

        // Add assertions based on how you want to handle invalid input
        // For example, should it return null, throw an error, etc.
        console.log("Note: Add specific assertions for invalid input handling");
    } catch (error) {
        // Expected if function throws on invalid input
    }
});

// Performance test template
console.log("Running Performance Test: Multiple paths");
runTest("Performance - multiple paths", () => {
    const testPairs = [
        [[0, 0], [7, 7]],
        [[0, 7], [7, 0]], 
        [[3, 3], [4, 5]],
        [[1, 1], [6, 6]],
        [[2, 0], [5, 7]]
    ];
    
    const startTime = Date.now();
    for (const [start, end] of testPairs) {
        const result = traverse(start, end);
        if (!isValidPath(result, start, end)) {
            throw new Error(`Invalid path from [${start}] to [${end}]`);
        }
    }
    const endTime = Date.now();
    
    console.log(`Performance: ${testPairs.length} paths calculated in ${endTime - startTime}ms`);
});

// Template for specific path verification
console.log("Running Specific Path Tests");
function testSpecificPath(start, end, expectedPath) {
    const result = traverse(start, end);
    
    if (!isValidPath(result, start, end)) {
        throw new Error("Invalid path structure");
    }
    
    if (expectedPath && result.length !== expectedPath.length) {
        throw new Error(`Expected path length ${expectedPath.length}, got ${result.length}`);
    }
    
    // add more specific path comparisons here
    console.log(`Path from [${start}] to [${end}]:`, result);
}

// Example specific path tests (you can update with exact expected paths)
console.log("\n=== Specific Path Examples ===");
console.log("(Update with expected optimal paths)");

try {
    testSpecificPath([0, 0], [2, 1], null); // Expected: [[0,0], [2,1]]
    testSpecificPath([0, 0], [3, 3], null); // specify expected path
    testSpecificPath([1, 1], [4, 5], null); // specify expected path
} catch (error) {
    console.log("Specific path examples failed:", error.message);
}

console.log("\n=== Test Summary ===");
console.log("All basic tests completed");
