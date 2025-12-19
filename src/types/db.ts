// Core database types for Lyra Airtable Clone

export type ColumnType = 'TEXT' | 'NUMBER';

// Row data is stored as JSONB - key is columnId, value is the cell value
export interface RowData {
    [columnId: string]: string | number | null;
}

// Filter condition types
export interface FilterCondition {
    columnId: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value?: string | number;
}

export interface FilterConfig {
    conditions: FilterCondition[];
    logic?: 'AND' | 'OR';
}

// Sort configuration
export interface SortConfig {
    columnId: string;
    direction: 'asc' | 'desc';
}

// View configuration
export interface ViewConfig {
    id: string;
    name: string;
    filterConfig?: FilterConfig;
    sortConfig?: SortConfig[];
}
