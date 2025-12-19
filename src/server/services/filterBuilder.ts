import type { FilterConfig } from '~/types/db';

/**
 * Builds a Prisma WHERE clause from filter configuration
 * Supports JSONB queries for efficient filtering at scale
 * 
 * NOTE: Placeholder for Phase 2 - will be fully implemented with Row routers
 */
export function buildFilterQuery(filterConfig: FilterConfig): Record<string, any> {
    if (!filterConfig.conditions || filterConfig.conditions.length === 0) {
        return {};
    }

    const conditions = filterConfig.conditions.map((condition) => {
        const { columnId, operator, value } = condition;

        switch (operator) {
            case 'equals':
                return {
                    data: {
                        path: [columnId],
                        equals: value,
                    },
                };
            case 'contains':
                return {
                    data: {
                        path: [columnId],
                        string_contains: value as string,
                    },
                };
            case 'greaterThan':
                return {
                    data: {
                        path: [columnId],
                        gt: value,
                    },
                };
            case 'lessThan':
                return {
                    data: {
                        path: [columnId],
                        lt: value,
                    },
                };
            case 'isEmpty':
                return {
                    data: {
                        path: [columnId],
                        equals: null,
                    },
                };
            case 'isNotEmpty':
                return {
                    data: {
                        path: [columnId],
                        not: null,
                    },
                };
            default:
                return {};
        }
    });

    // Combine conditions with AND/OR logic
    if (filterConfig.logic === 'OR') {
        return { OR: conditions };
    }

    return { AND: conditions };
}
