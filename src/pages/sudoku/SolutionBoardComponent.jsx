import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SudokuCell from './CellComponent';
import './Sudoku.css';

const SolutionBoard = ({ puzzle, solution }) => {
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill({ value: 0, clue: false })));

    const initializeBoard = () => {
        if (Array.isArray(puzzle) && Array.isArray(solution)) {
            const newBoard = puzzle.map((row, rowIndex) =>
                row.map((cell, colIndex) => ({
                    value: solution[rowIndex][colIndex], // Value from the solution
                    clue: !!cell.clue, // Using !! to ensure it's a boolean
                    error: cell.value !== 0 && cell.value !== solution[rowIndex][colIndex] // Check if there's a mismatch
                }))
            );
            setBoard(newBoard);
        }
    };

    useEffect(() => {
        initializeBoard();
    }, [puzzle, solution]);

    return (
        <div id="sudokuBoard" className="sudoku-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="sudoku-row">
                    {row.map((cell, colIndex) => (
                        <SudokuCell
                            key={`${rowIndex}-${colIndex}`}
                            cell={cell}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            onInputChange={() => {}} // No-op function
                            isError={cell.error}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

SolutionBoard.propTypes = {
    puzzle: PropTypes.arrayOf(PropTypes.array).isRequired,
    solution: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default SolutionBoard;
