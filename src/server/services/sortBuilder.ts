import type { SortConfig } from '~/types/db';
import type { Prisma } from '@prisma/client';

/**
 * Builds a Prisma ORDER BY clause from sort configuration
 * Supports JSONB field sorting for dynamic columns
 */
export function buildSortQuery(sortConfig: SortConfig[]): Prisma.RowOrderByWithRelationInput[] {
    if (!sortConfig || sortConfig.length === 0) {
        // Default sort by order field
        return [{ order: 'asc' }];
    }

    return sortConfig.map((sort) => ({
        data: {
            path: [sort.columnId],
            sort: sort.direction,
        },
    }));
}
