import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Expense Types queries and mutations
export const getExpenseTypes = query({
	handler: async (ctx) => {
		return await ctx.db.query('expenseTypes').collect();
	}
});

export const createExpenseType = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		color: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('expenseTypes', {
			...args,
			createdAt: Date.now()
		});
	}
});

export const updateExpenseType = mutation({
	args: {
		id: v.id('expenseTypes'),
		name: v.string(),
		description: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		color: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		return await ctx.db.patch(id, updates);
	}
});

export const deleteExpenseType = mutation({
	args: { id: v.id('expenseTypes') },
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.id);
	}
});

// Expenses queries and mutations
export const getExpenses = query({
	handler: async (ctx) => {
		const expenses = await ctx.db.query('expenses').collect();
		const expensesWithTypes = await Promise.all(
			expenses.map(async (expense) => {
				const expenseType = await ctx.db.get(expense.typeId);
				return {
					...expense,
					expenseType
				};
			})
		);
		return expensesWithTypes;
	}
});

export const createExpense = mutation({
	args: {
		typeId: v.id('expenseTypes'),
		amount: v.number(),
		description: v.string(),
		date: v.number()
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('expenses', {
			...args,
			createdAt: Date.now()
		});
	}
});

export const updateExpense = mutation({
	args: {
		id: v.id('expenses'),
		typeId: v.id('expenseTypes'),
		amount: v.number(),
		description: v.string(),
		date: v.number()
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		return await ctx.db.patch(id, updates);
	}
});

export const deleteExpense = mutation({
	args: { id: v.id('expenses') },
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.id);
	}
});
