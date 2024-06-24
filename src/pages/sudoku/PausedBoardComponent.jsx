import React from 'react';
import SudokuCell from './CellComponent';

const PausedBoard = () => {
    const noop = () => {}; // Presuming this is intentionally a no-operation function for placeholder.
    const gridSize = 9; // for a standard Sudoku board
    let board = [];
    for (let row = 0; row < gridSize; row++) {
        let currentRow = [];
        for (let col = 0; col < gridSize; col++) {
            // Insert 'SUDOKU' letters into the middle row
            // Ensure you handle out-of-bounds correctly for '数独-SUDOKU' string
            let cellContent = row === 4 ? ('数独-SUDOKU'[col] || '') : Math.ceil(Math.random() * 9);
            currentRow.push(
                <SudokuCell
                    key={`${row}-${col}`}
                    cell={{ value: cellContent, clue: row !== 4 }}
                    rowIndex={row}
                    colIndex={col}
                    onInputChange={noop}
                />
            );
        }
        board.push(<div key={row} style={{ display: 'flex' }}>{currentRow}</div>); // Added key to each row for React list elements
    }
    return (
        <div id="sudokuBoard" className="sudoku-board">
            {board}
        </div>
    );
};

export default PausedBoard;
