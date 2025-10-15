// Main JavaScript for Knight's Travails Interactive Chessboard
// Handles UI interactions, board generation, and path visualization

import { traverse, makeSquare, getKnightMoves, chessToCoords, coordsToChess } from './knight.js';

class ChessboardController {
    constructor() {
        this.startPosition = null;
        this.endPosition = null;
        this.currentPath = [];
        this.animationInProgress = false;
        
        this.initializeBoard();
        this.bindEventListeners();
        this.updateUI();
    }
    
    initializeBoard() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';
        
        // Create 8x8 grid of squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Alternate colors (light/dark)
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');
                
                // Add click event listener
                square.addEventListener('click', (e) => this.handleSquareClick(e));
                
                chessboard.appendChild(square);
            }
        }
    }
    
    bindEventListeners() {
        // Button event listeners
        document.getElementById('find-path-btn').addEventListener('click', () => this.findPath());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetBoard());
        document.getElementById('animate-btn').addEventListener('click', () => this.animatePath());
    }
    
    handleSquareClick(event) {
        if (this.animationInProgress) return; // no new action while active
        
        const square = event.target;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const coords = [row, col];
        
        // If no start position is set, set this as start
        if (!this.startPosition) {
            this.setStartPosition(coords, square);
        }
        // If start is set but no end, set this as end
        else if (!this.endPosition) {
            // Don't allow same square for start and end
            if (coords[0] === this.startPosition[0] && coords[1] === this.startPosition[1]) {
                this.showMessage('Start and end positions cannot be the same!', 'error');
                return;
            }
            this.setEndPosition(coords, square);
        }
        // If both are set, reset and set new start
        else {
            this.clearSelections();
            this.setStartPosition(coords, square);
        }
        
        this.updateUI();
    }
    
    setStartPosition(coords, square) {
        // Clear previous start position styling
        this.clearSquareStates();
        
        this.startPosition = coords;
        square.classList.add('start');
        square.innerHTML = '♞';
        
        this.showMessage('Start position set! Click another square for the end position.', 'info');
    }
    
    setEndPosition(coords, square) {
        this.endPosition = coords;
        square.classList.add('end');
        // square.innerHTML = '🎯';
        square.innerHTML = '𖣠'; //this looked cooler

        
        this.showMessage('End position set! Click "Find Shortest Path" to calculate the route.', 'success');
    }
    
    clearSelections() {
        this.startPosition = null;
        this.endPosition = null;
        this.currentPath = [];
        this.clearSquareStates();
    }
    
    clearSquareStates() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('start', 'end', 'path', 'current-move', 'selected');
            square.innerHTML = '';
        });
    }
    
    findPath() {
        if (!this.startPosition || !this.endPosition) {
            this.showMessage('Please select both start and end positions first!', 'error');
            return;
        }
        
        try {
            // Use the knight algorithm to find the shortest path
            const path = traverse(this.startPosition, this.endPosition);
            
            if (!path || path.length === 0) {
                this.showMessage('No path found! This shouldn\'t happen on a valid chessboard.', 'error');
                return;
            }
            
            this.currentPath = path;
            this.displayPath(path);
            this.showMessage(`Path found! ${path.length - 1} moves required.`, 'success');
            
            // Update path information and button states
            this.updatePathInfo(path);
            this.updateButtonStates();
            
        } catch (error) {
            console.error('Error finding path:', error);
            this.showMessage('An error occurred while finding the path. Please try again.', 'error');
        }
    }
    
    displayPath(path) {
        // Clear previous path styling but keep start/end
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('path');
            if (!square.classList.contains('start') && !square.classList.contains('end')) {
                square.innerHTML = '';
            }
        });
        
        // Highlight path squares (except start and end)
        path.forEach((coords, index) => {
            const square = this.getSquareAt(coords[0], coords[1]);
            if (square) {
                // Don't override start and end styling
                if (index !== 0 && index !== path.length - 1) {
                    square.classList.add('path');
                    square.innerHTML = (index).toString();
                }
            }
        });
    }
    
    animatePath() {
        // put here in case, should never happen due to button disable
        if (!this.currentPath || this.currentPath.length === 0) {
            this.showMessage('No path to animate! Find a path first.', 'error');
            return;
        }
        
        if (this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.updateButtonStates();
        
        // Clear current path display
        this.clearSquareStates();
        
        // Redraw start and end positions
        const startSquare = this.getSquareAt(this.startPosition[0], this.startPosition[1]);
        const endSquare = this.getSquareAt(this.endPosition[0], this.endPosition[1]);
        
        startSquare.classList.add('start');
        startSquare.innerHTML = '♞';
        endSquare.classList.add('end');
        // endSquare.innerHTML = '🎯';
        endSquare.innerHTML = '𖣠';
        
        // Animate through each step
        this.animateStep(0);
    }
    
    animateStep(stepIndex) {
        if (stepIndex >= this.currentPath.length) {
            // Animation complete
            setTimeout(() => {
                this.animationInProgress = false;
                this.updateButtonStates();
                this.displayPath(this.currentPath); // Show final path
            }, 500);
            return;
        }
        
        const coords = this.currentPath[stepIndex];
        const square = this.getSquareAt(coords[0], coords[1]);
        
        if (square) {
            // Remove previous current-move styling
            document.querySelectorAll('.current-move').forEach(s => {
                s.classList.remove('current-move');
                if (!s.classList.contains('start') && !s.classList.contains('end')) {
                    s.innerHTML = '';
                }
            });
            
            // Highlight current position (except start and end)
            if (stepIndex !== 0 && stepIndex !== this.currentPath.length - 1) {
                square.classList.add('current-move');
                square.innerHTML = '♞';
            }
            
            // Add path styling to previous positions
            if (stepIndex > 0 && stepIndex < this.currentPath.length - 1) {
                const prevCoords = this.currentPath[stepIndex - 1];
                const prevSquare = this.getSquareAt(prevCoords[0], prevCoords[1]);
                if (prevSquare && !prevSquare.classList.contains('start')) {
                    prevSquare.classList.remove('current-move');
                    prevSquare.classList.add('path');
                    prevSquare.innerHTML = stepIndex.toString() - 1;
                }
            }

            if (stepIndex === this.currentPath.length - 2) {
                const lastInPath = this.currentPath[stepIndex];
                const lastSquareInPath = this.getSquareAt(lastInPath[0], lastInPath[1]);
                if (lastSquareInPath && !lastSquareInPath.classList.contains('end')) {
                    setTimeout(() => {
                        lastSquareInPath.classList.remove('current-move');
                        lastSquareInPath.classList.add('path');
                        lastSquareInPath.innerHTML = (stepIndex).toString();
                    }, 800);
                }
            }

        }
        
        // Continue to next step
        setTimeout(() => this.animateStep(stepIndex + 1), 800);
    }
    
    resetBoard() {
        if (this.animationInProgress) {
            this.showMessage('Cannot reset during animation. Please wait.', 'error');
            return;
        }
        
        this.clearSelections();
        this.updateUI();
        this.updatePathInfo(null);
        this.showMessage('Board reset! Click on a square to set the start position.', 'info');
    }
    
    getSquareAt(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    
    updateUI() {
        // Update position displays
        const startPosElement = document.getElementById('start-position');
        const endPosElement = document.getElementById('end-position');
        
        startPosElement.textContent = this.startPosition 
            ? coordsToChess(this.startPosition)
            : 'Not selected';
            
        endPosElement.textContent = this.endPosition 
            ? coordsToChess(this.endPosition)
            : 'Not selected';
        
        this.updateButtonStates();
        this.updatePathStatus();
    }
    
    updateButtonStates() {
        const findPathBtn = document.getElementById('find-path-btn');
        const animateBtn = document.getElementById('animate-btn');
        
        // Enable find path button only if both positions are selected
        findPathBtn.disabled = !this.startPosition || !this.endPosition || this.animationInProgress;
        
        // Enable animate button only if path exists and no animation in progress
        // will remove disable condition upon finding path
        animateBtn.disabled = !this.currentPath.length || this.animationInProgress;
    }
    
    updatePathStatus() {
        const statusElement = document.getElementById('path-status');
        
        if (this.animationInProgress) {
            statusElement.textContent = 'Animating path...';
        } else if (this.currentPath.length > 0) {
            statusElement.textContent = 'Path calculated successfully';
        } else if (this.startPosition && this.endPosition) {
            statusElement.textContent = 'Ready to find path';
        } else if (this.startPosition) {
            statusElement.textContent = 'Select end position';
        } else {
            statusElement.textContent = 'Select start position';
        }
    }
    
    updatePathInfo(path) {
        const moveCountElement = document.getElementById('move-count');
        const pathListElement = document.getElementById('path-list');
        
        if (path && path.length > 0) {
            moveCountElement.textContent = path.length - 1;
            
            // Display path coordinates
            const pathHTML = path.map((coords, index) => {
                const notation = coordsToChess(coords);
                return `<span class="coord-step" data-step="${index}">${notation}</span>`;
            }).join(' → ');
            
            pathListElement.innerHTML = pathHTML;
        } else {
            moveCountElement.textContent = '-';
            pathListElement.innerHTML = '<em>No path calculated yet</em>';
        }
    }
    
    showMessage(message, type = 'info') {
        // message display giving instructions to user
        const statusElement = document.getElementById('path-status');
        const originalText = statusElement.textContent;
        
        statusElement.textContent = message;
        statusElement.style.color = type === 'error' ? '#f44336' : 
                                   type === 'success' ? '#4CAF50' : 
                                   type === 'info' ? '#2196F3' : '#333';
        
        // Reset after 3 seconds
        setTimeout(() => {
            statusElement.style.color = '';
            this.updatePathStatus();
        }, 3000);
    }
}

// Initialize the chessboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessboardController();
});