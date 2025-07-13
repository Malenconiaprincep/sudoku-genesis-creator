import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Check, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample Sudoku puzzle (0 represents empty cells)
const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

type Cell = {
  value: number;
  isGiven: boolean;
  hasConflict: boolean;
};

export const SudokuGame = () => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<Cell[][]>(() => {
    return initialPuzzle.map(row => 
      row.map(value => ({
        value,
        isGiven: value !== 0,
        hasConflict: false
      }))
    );
  });
  
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  // Navigation helper function
  const moveSelection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCell) {
      setSelectedCell({row: 0, col: 0});
      return;
    }
    
    let { row, col } = selectedCell;
    
    switch (direction) {
      case 'up':
        row = row > 0 ? row - 1 : 8;
        break;
      case 'down':
        row = row < 8 ? row + 1 : 0;
        break;
      case 'left':
        col = col > 0 ? col - 1 : 8;
        break;
      case 'right':
        col = col < 8 ? col + 1 : 0;
        break;
    }
    
    setSelectedCell({row, col});
  }, [selectedCell]);

  const checkConflicts = useCallback((newGrid: Cell[][]) => {
    const hasConflict = (row: number, col: number, num: number) => {
      if (num === 0) return false;
      
      // Check row
      for (let c = 0; c < 9; c++) {
        if (c !== col && newGrid[row][c].value === num) return true;
      }
      
      // Check column
      for (let r = 0; r < 9; r++) {
        if (r !== row && newGrid[r][col].value === num) return true;
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && newGrid[r][c].value === num) return true;
        }
      }
      
      return false;
    };

    return newGrid.map((row, r) =>
      row.map((cell, c) => ({
        ...cell,
        hasConflict: hasConflict(r, c, cell.value)
      }))
    );
  }, []);

  const updateCell = useCallback((row: number, col: number, value: number) => {
    if (grid[row][col].isGiven) return;
    
    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) => 
        rowIndex === row && colIndex === col 
          ? { ...cell, value }
          : cell
      )
    );
    
    setGrid(checkConflicts(newGrid));
  }, [grid, checkConflicts]);

  const checkSolution = useCallback(() => {
    const isComplete = grid.every(row => row.every(cell => cell.value !== 0));
    const hasConflicts = grid.some(row => row.some(cell => cell.hasConflict));
    
    if (isComplete && !hasConflicts) {
      toast({
        title: "Congratulations! 🎉",
        description: "You've solved the Sudoku puzzle!",
      });
    } else if (hasConflicts) {
      toast({
        title: "Conflicts detected",
        description: "Please resolve the highlighted conflicts",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Keep going!",
        description: "The puzzle is not yet complete",
      });
    }
  }, [grid, toast]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for handled keys
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Delete', 'Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }

      // Number input (1-9)
      if (event.key >= '1' && event.key <= '9' && selectedCell) {
        const num = parseInt(event.key);
        updateCell(selectedCell.row, selectedCell.col, num);
        return;
      }

      // Clear cell (0, Delete, Backspace)
      if ((event.key === '0' || event.key === 'Delete' || event.key === 'Backspace') && selectedCell) {
        updateCell(selectedCell.row, selectedCell.col, 0);
        return;
      }

      // Arrow key navigation
      if (event.key === 'ArrowUp') {
        moveSelection('up');
        return;
      }
      if (event.key === 'ArrowDown') {
        moveSelection('down');
        return;
      }
      if (event.key === 'ArrowLeft') {
        moveSelection('left');
        return;
      }
      if (event.key === 'ArrowRight') {
        moveSelection('right');
        return;
      }

      // Enter to check solution
      if (event.key === 'Enter') {
        checkSolution();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, updateCell, moveSelection, checkSolution]);


  const resetPuzzle = useCallback(() => {
    setGrid(initialPuzzle.map(row => 
      row.map(value => ({
        value,
        isGiven: value !== 0,
        hasConflict: false
      }))
    ));
    setSelectedCell(null);
  }, []);

  const getCellClassName = (cell: Cell, row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const baseClasses = "w-12 h-12 border border-sudoku-grid flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-150";
    
    let bgClass = "bg-sudoku-cell hover:bg-sudoku-cell-hover";
    if (cell.isGiven) {
      bgClass = "bg-sudoku-cell-given";
    } else if (!cell.isGiven && cell.value !== 0) {
      bgClass = "bg-sudoku-cell-user";
    }
    
    if (cell.hasConflict) {
      bgClass = "bg-sudoku-cell-conflict";
    }
    
    if (isSelected) {
      bgClass += " ring-2 ring-primary";
    }
    
    const textClass = cell.hasConflict 
      ? "text-sudoku-number-conflict" 
      : cell.isGiven 
        ? "text-sudoku-number-given"
        : "text-sudoku-number";
    
    // Thick borders for 3x3 boxes
    const borderClasses = [];
    if (row % 3 === 0) borderClasses.push("border-t-2 border-t-sudoku-box-border");
    if (col % 3 === 0) borderClasses.push("border-l-2 border-l-sudoku-box-border");
    if (row === 8) borderClasses.push("border-b-2 border-b-sudoku-box-border");
    if (col === 8) borderClasses.push("border-r-2 border-r-sudoku-box-border");
    
    return `${baseClasses} ${bgClass} ${textClass} ${borderClasses.join(' ')}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sudoku</h1>
          <p className="text-muted-foreground">Fill the grid so each row, column, and 3×3 box contains digits 1-9</p>
        </div>
        
        <div className="flex flex-col items-center gap-8">
          {/* Sudoku Grid */}
          <div className="inline-block border-2 border-sudoku-box-border rounded-lg p-2 bg-sudoku-grid">
            <div className="grid grid-cols-9 gap-0">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClassName(cell, rowIndex, colIndex)}
                    onClick={() => setSelectedCell({row: rowIndex, col: colIndex})}
                  >
                    {cell.value !== 0 ? cell.value : ''}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Number Input */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <Button
                key={num}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 font-semibold"
                onClick={() => {
                  if (selectedCell) {
                    updateCell(selectedCell.row, selectedCell.col, num);
                  }
                }}
                disabled={!selectedCell}
              >
                {num === 0 ? '×' : num}
              </Button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={checkSolution} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Check Solution
            </Button>
            <Button variant="outline" onClick={resetPuzzle} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground text-center max-w-md space-y-2">
            <p>
              <strong>Mouse:</strong> Click on a cell to select it, then click a number button or use keyboard
            </p>
            <p>
              <strong>Keyboard:</strong> Arrow keys to navigate • 1-9 to fill • 0/Delete/Backspace to clear • Enter to check solution
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};