import type { FilterConfig } from '~/types/db';
import type { Prisma } from '@prisma/client';

/**
 * Builds a Prisma WHERE clause from filter configuration
 * Supports JSONB queries for efficient filtering at scale
 */
export function buildFilterQuery(filterConfig: FilterConfig): Prisma.RowWhereInput {
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
                    OR: [
                        {
                            data: {
                                path: [columnId],
                                equals: Prisma.DbNull,
                            },
                        },
                        {
                            data: {
                                path: [columnId],
                                equals: '',
                            },
                        },
                    ],
                };
            case 'isNotEmpty':
                return {
                    AND: [
                        {
                            data: {
                                path: [columnId],
                                not: Prisma.DbNull,
                            },
                        },
                        {
                            data: {
                                path: [columnId],
                                not: '',
                            },
                        },
                    ],
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
