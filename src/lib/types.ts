import type { Id } from '../../convex/_generated/dataModel';
import type { DateValue } from '@internationalized/date';

export interface ExpenseType {
	_id: Id<'expenseTypes'>;
	name: string;
	description?: string;
	imageUrl?: string;
	color?: string;
	createdAt: number;
}

export interface Expense {
	_id: Id<'expenses'>;
	typeId: Id<'expenseTypes'>;
	amount: number;
	description: string;
	date: number;
	createdAt: number;
	expenseType?: ExpenseType | null;
}

export interface NewExpenseType {
	name: string;
	description: string;
	imageUrl: string;
	color: string;
}

export interface NewExpense {
	typeId: string;
	amount: number;
	description: string;
	date: DateValue | undefined;
}
