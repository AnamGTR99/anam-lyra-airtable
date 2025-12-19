import type { SortConfig } from '~/types/db';

/**
 * Builds a Prisma ORDER BY clause from sort configuration
 * Supports JSONB path-based sorting
 * 
 * NOTE: Placeholder for Phase 2 - will be fully implemented with Row routers
 */
export function buildSortQuery(sortConfig: SortConfig[]): Record<string, any>[] {
    if (!sortConfig || sortConfig.length === 0) {
        return [{ order: 'asc' }]; // Default sort by order field
    }

    return sortConfig.map((sort) => ({
        data: {
            path: [sort.columnId],
            sort: sort.direction,
        },
    }));
}
