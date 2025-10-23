import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	expenseTypes: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		color: v.optional(v.string()),
		createdAt: v.number()
	}),
	expenses: defineTable({
		typeId: v.id('expenseTypes'),
		amount: v.number(),
		description: v.string(),
		date: v.number(),
		createdAt: v.number()
	})
});
