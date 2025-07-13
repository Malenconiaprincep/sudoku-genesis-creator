import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Check, Lightbulb, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 随机打乱数组
const shuffleArray = (array: number[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// 基础数独模板
const baseSudoku = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8]
];

// 通过数学变换生成新的数独
const generateSudokuSolution = (): number[][] => {
  // 深拷贝基础数独
  const grid = baseSudoku.map(row => [...row]);

  // 1. 随机交换行（在同一个3x3区域内）
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    const rows = [boxRow * 3, boxRow * 3 + 1, boxRow * 3 + 2];
    const shuffledRows = shuffleArray(rows);
    const tempGrid = [...grid];
    for (let i = 0; i < 3; i++) {
      grid[rows[i]] = tempGrid[shuffledRows[i]];
    }
  }

  // 2. 随机交换列（在同一个3x3区域内）
  for (let boxCol = 0; boxCol < 3; boxCol++) {
    const cols = [boxCol * 3, boxCol * 3 + 1, boxCol * 3 + 2];
    const shuffledCols = shuffleArray(cols);
    const tempGrid = grid.map(row => [...row]);
    for (let row = 0; row < 9; row++) {
      for (let i = 0; i < 3; i++) {
        grid[row][cols[i]] = tempGrid[row][shuffledCols[i]];
      }
    }
  }

  // 3. 随机交换3x3区域（行）
  const boxRowGroups = [0, 1, 2];
  const shuffledBoxRows = shuffleArray(boxRowGroups);
  const tempGrid = [...grid];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[i * 3 + j] = tempGrid[shuffledBoxRows[i] * 3 + j];
    }
  }

  // 4. 随机交换3x3区域（列）
  const boxColGroups = [0, 1, 2];
  const shuffledBoxCols = shuffleArray(boxColGroups);
  const tempGrid2 = grid.map(row => [...row]);
  for (let row = 0; row < 9; row++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[row][i * 3 + j] = tempGrid2[row][shuffledBoxCols[i] * 3 + j];
      }
    }
  }

  // 5. 随机替换数字
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledNumbers = shuffleArray(numbers);
  const numberMap: { [key: number]: number } = {};
  for (let i = 0; i < 9; i++) {
    numberMap[numbers[i]] = shuffledNumbers[i];
  }

  // 应用数字替换
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid[row][col] = numberMap[grid[row][col]];
    }
  }

  return grid;
};

// 生成随机数独解答
const getRandomSolution = () => {
  return generateSudokuSolution();
};

// 生成简单难度的数独题目
const createEasyPuzzle = () => {
  const solution = getRandomSolution();
  const puzzle = solution.map(row => [...row]);

  // 移除数字创建题目（保持更多数字以降低难度）
  const cellsToRemove = [
    [0, 2], [0, 3], [0, 6], [0, 7],
    [1, 1], [1, 6], [1, 7],
    [2, 0], [2, 3], [2, 5],
    [3, 1], [3, 3], [3, 5], [3, 7],
    [4, 0], [4, 2], [4, 6], [4, 8],
    [5, 1], [5, 3], [5, 5], [5, 7],
    [6, 2], [6, 4], [6, 7],
    [7, 1], [7, 2], [7, 6],
    [8, 1], [8, 3], [8, 5], [8, 6]
  ];

  cellsToRemove.forEach(([row, col]) => {
    puzzle[row][col] = 0;
  });

  return puzzle;
};

type Cell = {
  value: number;
  isGiven: boolean;
  hasConflict: boolean;
};

export const SudokuGame = () => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<Cell[][]>(() => {
    const easyPuzzle = createEasyPuzzle();
    return easyPuzzle.map(row =>
      row.map(value => ({
        value,
        isGiven: value !== 0,
        hasConflict: false
      }))
    );
  });

  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);

  // Navigation helper function
  const moveSelection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCell) {
      setSelectedCell({ row: 0, col: 0 });
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

    setSelectedCell({ row, col });
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
        title: "恭喜！🎉",
        description: "您已成功解决了数独谜题！",
      });
    } else if (hasConflicts) {
      toast({
        title: "发现冲突",
        description: "请解决高亮显示的冲突",
        variant: "destructive"
      });
    } else {
      toast({
        title: "继续加油！",
        description: "谜题尚未完成",
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


  // Get possible numbers for a cell (hint system)
  const getPossibleNumbers = useCallback((row: number, col: number) => {
    if (grid[row][col].value !== 0) return [];

    const possible = [];
    for (let num = 1; num <= 9; num++) {
      let canPlace = true;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (grid[row][c].value === num) {
          canPlace = false;
          break;
        }
      }

      // Check column
      if (canPlace) {
        for (let r = 0; r < 9; r++) {
          if (grid[r][col].value === num) {
            canPlace = false;
            break;
          }
        }
      }

      // Check 3x3 box
      if (canPlace) {
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            if (grid[r][c].value === num) {
              canPlace = false;
              break;
            }
          }
          if (!canPlace) break;
        }
      }

      if (canPlace) possible.push(num);
    }
    return possible;
  }, [grid]);

  const getHint = useCallback(() => {
    if (!selectedCell || grid[selectedCell.row][selectedCell.col].isGiven) {
      toast({
        title: "请选择一个空白格子",
        description: "点击一个空白格子以获取提示",
      });
      return;
    }

    const possible = getPossibleNumbers(selectedCell.row, selectedCell.col);
    if (possible.length === 0) {
      toast({
        title: "没有有效数字",
        description: "此格子存在冲突，需要先解决",
        variant: "destructive"
      });
    } else {
      toast({
        title: "可能的数字",
        description: `您可以放置：${possible.join(', ')}`,
      });
    }
  }, [selectedCell, grid, getPossibleNumbers, toast]);

  const resetPuzzle = useCallback(() => {
    // 只清空用户输入的数据，保留原始题目
    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          value: cell.isGiven ? cell.value : 0,
          hasConflict: false
        }))
      )
    );
    setSelectedCell(null);
  }, []);

  const newGame = useCallback(() => {
    const easyPuzzle = createEasyPuzzle();
    setGrid(easyPuzzle.map(row =>
      row.map(value => ({
        value,
        isGiven: value !== 0,
        hasConflict: false
      }))
    ));
    setSelectedCell(null);
    toast({
      title: "新游戏开始！",
      description: "已为您生成新的随机数独关卡",
    });
  }, [toast]);

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
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
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
          <div className="flex gap-4 flex-wrap justify-center">
            <Button onClick={newGame} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              新游戏
            </Button>
            <Button onClick={getHint} variant="secondary" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              提示
            </Button>
            <Button onClick={checkSolution} variant="secondary" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              检查答案
            </Button>
            <Button variant="outline" onClick={resetPuzzle} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              重置
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center max-w-md space-y-2">
            <p>
              <strong>鼠标操作：</strong> 点击格子选中，然后点击数字按钮或使用键盘输入
            </p>
            <p>
              <strong>键盘操作：</strong> 方向键导航 • 1-9填入数字 • 0/删除键/退格键清除 • 回车检查答案
            </p>
            <p className="text-xs text-primary">
              💡 每次点击"新游戏"都会生成不同的随机关卡
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};