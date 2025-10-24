<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { api } from '../../convex/_generated/api';
	import type { Id } from '../../convex/_generated/dataModel';
	import type { ConvexReactClient } from 'convex/react';
	import type { Expense, ExpenseType, NewExpense } from '$lib/types';
	import { today, getLocalTimeZone, fromDate } from '@internationalized/date';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Plus, Edit, Trash2, DollarSign } from 'lucide-svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { DatePicker } from '$lib/components/ui/date-picker';
	import { Loading } from '$lib/components/ui/loading';

	let newExpense = $state<NewExpense>({
		typeId: '',
		amount: 0,
		description: '',
		date: today(getLocalTimeZone())
	});

	const convex = getContext<ConvexReactClient>('convex');
	let expenses = $state<Expense[]>([]);
	let expenseTypes = $state<ExpenseType[]>([]);
	let isLoading = $state(true);

	const loadData = async () => {
		try {
			const [expensesData, typesData] = await Promise.all([
				convex.query(api.expenses.getExpenses, {}),
				convex.query(api.expenses.getExpenseTypes, {})
			]);
			expenses = expensesData;
			expenseTypes = typesData;
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		loadData();
	});

	let isDialogOpen = $state(false);
	let editingExpense = $state<Expense | null>(null);

	function handleCreateExpense() {
		if (newExpense.typeId && newExpense.amount > 0 && newExpense.description.trim()) {
			const expenseData = {
				typeId: newExpense.typeId as Id<'expenseTypes'>,
				amount: newExpense.amount,
				description: newExpense.description,
				date: newExpense.date ? newExpense.date.toDate(getLocalTimeZone()).getTime() : Date.now()
			};
			convex.mutation(api.expenses.createExpense, expenseData).then(() => {
				loadData();
			});
			newExpense = {
				typeId: '',
				amount: 0,
				description: '',
				date: today(getLocalTimeZone())
			};
			isDialogOpen = false;
		}
	}

	function handleUpdateExpense() {
		if (
			editingExpense &&
			newExpense.typeId &&
			newExpense.amount > 0 &&
			newExpense.description.trim()
		) {
			const expenseData = {
				id: editingExpense._id,
				typeId: newExpense.typeId as Id<'expenseTypes'>,
				amount: newExpense.amount,
				description: newExpense.description,
				date: newExpense.date ? newExpense.date.toDate(getLocalTimeZone()).getTime() : Date.now()
			};
			convex.mutation(api.expenses.updateExpense, expenseData).then(() => {
				loadData();
			});
			editingExpense = null;
			newExpense = {
				typeId: '',
				amount: 0,
				description: '',
				date: today(getLocalTimeZone())
			};
			isDialogOpen = false;
		}
	}

	function handleEditExpense(expense: Expense) {
		editingExpense = expense;
		newExpense = {
			typeId: expense.typeId,
			amount: expense.amount,
			description: expense.description,
			date: fromDate(new Date(expense.date), getLocalTimeZone())
		};
		isDialogOpen = true;
	}

	function handleDeleteExpense(id: Id<'expenses'>) {
		if (confirm('Are you sure you want to delete this expense?')) {
			convex.mutation(api.expenses.deleteExpense, { id }).then(() => {
				loadData();
			});
		}
	}

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleDateString();
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}
</script>

<Navigation />

<main class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-3xl font-bold">Expenses</h2>
		<Dialog bind:open={isDialogOpen}>
			<DialogTrigger>
				<Button class="gap-2">
					<Plus class="h-4 w-4" />
					Add Expense
				</Button>
			</DialogTrigger>
			<DialogContent class="border-2 border-gray-300 bg-white shadow-2xl">
				<DialogHeader>
					<DialogTitle>
						{editingExpense ? 'Edit Expense' : 'Add New Expense'}
					</DialogTitle>
				</DialogHeader>
				<div class="space-y-4">
					<div class="flex w-full flex-col gap-1.5">
						<Label for="typeId">Expense Type</Label>
						<select
							id="typeId"
							bind:value={newExpense.typeId}
							class="w-full rounded-md border-2 border-gray-400 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="">Select expense type</option>
							{#if expenseTypes && expenseTypes.length > 0}
								{#each expenseTypes as expenseType}
									<option value={expenseType._id}>{expenseType.name}</option>
								{/each}
							{/if}
						</select>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="amount">Amount</Label>
						<Input
							id="amount"
							type="number"
							step="0.01"
							min="0"
							bind:value={newExpense.amount}
							placeholder="Enter amount"
							class="border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="description">Description</Label>
						<Input
							id="description"
							bind:value={newExpense.description}
							placeholder="Enter description"
							class="border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="date">Date</Label>
						<DatePicker bind:value={newExpense.date} />
					</div>
					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="inline-flex h-10 items-center justify-center rounded-md border-2 border-gray-400 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900 ring-offset-background transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							onclick={() => {
								isDialogOpen = false;
								editingExpense = null;
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							class="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white ring-offset-background transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							onclick={() => {
								if (editingExpense) {
									handleUpdateExpense();
								} else {
									handleCreateExpense();
								}
							}}
						>
							{editingExpense ? 'Update' : 'Create'}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</div>

	{#if isLoading}
		<div class="py-12 text-center">
			<Loading size="lg" />
		</div>
	{:else if expenses && expenses.length > 0}
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<DollarSign class="h-5 w-5" />
					Expense List
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Date</TableHead>
							<TableHead class="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each expenses as expense (expense._id)}
							<TableRow>
								<TableCell>
									<div class="flex items-center gap-2">
										{#if expense.expenseType}
											<div
												class="h-3 w-3 rounded-full"
												style="background-color: {expense.expenseType.color || '#3b82f6'}"
											></div>
											<span>{expense.expenseType.name}</span>
										{:else}
											<span class="text-gray-400">Unknown Type</span>
										{/if}
									</div>
								</TableCell>
								<TableCell>{expense.description}</TableCell>
								<TableCell class="font-medium">{formatCurrency(expense.amount)}</TableCell>
								<TableCell>{formatDate(expense.date)}</TableCell>
								<TableCell class="text-right">
									<div class="flex justify-end gap-2">
										<button
											type="button"
											class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
											onclick={() => {
												handleEditExpense(expense);
											}}
										>
											<Edit class="h-4 w-4" />
										</button>
										<button
											type="button"
											class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
											onclick={() => {
												handleDeleteExpense(expense._id);
											}}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	{:else}
		<div class="py-12 text-center">
			<DollarSign class="mx-auto mb-4 h-12 w-12 text-gray-400" />
			<p class="text-gray-500">No expenses found. Add your first expense!</p>
		</div>
	{/if}
</main>
