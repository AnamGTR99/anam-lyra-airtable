import { create } from 'zustand';

/**
 * Global state for keyboard focus and cell selection
 * Used for 60fps keyboard navigation across 1M+ rows
 */
interface FocusState {
    focusedCell: { rowIndex: number; columnIndex: number } | null;
    selectedCells: Array<{ rowIndex: number; columnIndex: number }>;
    isEditing: boolean;

    setFocusedCell: (cell: { rowIndex: number; columnIndex: number } | null) => void;
    setSelectedCells: (cells: Array<{ rowIndex: number; columnIndex: number }>) => void;
    setIsEditing: (isEditing: boolean) => void;

    // Keyboard navigation helpers
    moveFocusUp: () => void;
    moveFocusDown: () => void;
    moveFocusLeft: () => void;
    moveFocusRight: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
    focusedCell: null,
    selectedCells: [],
    isEditing: false,

    setFocusedCell: (cell) => set({ focusedCell: cell }),
    setSelectedCells: (cells) => set({ selectedCells: cells }),
    setIsEditing: (isEditing) => set({ isEditing }),

    moveFocusUp: () => {
        const { focusedCell } = get();
        if (focusedCell && focusedCell.rowIndex > 0) {
            set({
                focusedCell: {
                    rowIndex: focusedCell.rowIndex - 1,
                    columnIndex: focusedCell.columnIndex,
                },
            });
        }
    },

    moveFocusDown: () => {
        const { focusedCell } = get();
        if (focusedCell) {
            set({
                focusedCell: {
                    rowIndex: focusedCell.rowIndex + 1,
                    columnIndex: focusedCell.columnIndex,
                },
            });
        }
    },

    moveFocusLeft: () => {
        const { focusedCell } = get();
        if (focusedCell && focusedCell.columnIndex > 0) {
            set({
                focusedCell: {
                    rowIndex: focusedCell.rowIndex,
                    columnIndex: focusedCell.columnIndex - 1,
                },
            });
        }
    },

    moveFocusRight: () => {
        const { focusedCell } = get();
        if (focusedCell) {
            set({
                focusedCell: {
                    rowIndex: focusedCell.rowIndex,
                    columnIndex: focusedCell.columnIndex + 1,
                },
            });
        }
    },
}));
