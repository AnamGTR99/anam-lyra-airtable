import { z } from 'zod';

// Filter validation schemas
export const filterConditionSchema = z.object({
    columnId: z.string(),
    operator: z.enum(['equals', 'contains', 'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty']),
    value: z.union([z.string(), z.number()]).optional(),
});

export const filterConfigSchema = z.object({
    conditions: z.array(filterConditionSchema),
    logic: z.enum(['AND', 'OR']).optional().default('AND'),
});

// Sort validation schemas
export const sortConfigSchema = z.object({
    columnId: z.string(),
    direction: z.enum(['asc', 'desc']),
});

export const sortConfigArraySchema = z.array(sortConfigSchema);
