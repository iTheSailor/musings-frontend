import React from 'react';
import PropTypes from 'prop-types';
import './Sudoku.css';
import { useState, useEffect } from 'react';

const SudokuCell = ({ cell, rowIndex, colIndex, onInputChange, isError }) => {
    const [showError, setShowError] = useState(false);
    useEffect(() => {   
        setShowError(isError);
        if (isError) {
            const timer = setTimeout(() => setShowError(false), 2000); // 2 seconds
            return () => clearTimeout(timer);
        }
    }, [isError]);

    const handleChange = (event) => {
        const newValue = event.target.value.replace(/[^1-9]/g, '');
        if (newValue.length <= 1) {
            onInputChange(newValue, rowIndex, colIndex);
            setShowError(false);
        }
    };
    


    return (
        <div className={`sudoku-cell ${colIndex === 2 || colIndex === 5 ? 'bold-border-right' : ''} ${rowIndex === 2 || rowIndex === 5 ? 'bold-border-bottom' : ''}`}>
            <input
                type="text"
                value={cell.value || ''}
                onChange={handleChange}
                className={`sudoku-input ${cell.clue ? 'concrete' : ''} ${showError ? 'error-cell' : ''}`}
                disabled={cell.clue}
                
                
            />
        </div>
    );
};

SudokuCell.propTypes = {
    cell: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isError: PropTypes.bool,
};

export default SudokuCell;