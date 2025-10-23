<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { api } from '../../convex/_generated/api';
	import type { Id } from '../../convex/_generated/dataModel';
	import type { ConvexReactClient } from 'convex/react';
	import type { ExpenseType, NewExpenseType } from '$lib/types';
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
	import { Plus, Upload, Trash2, Edit } from 'lucide-svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	let newExpenseType = $state<NewExpenseType>({
		name: '',
		description: '',
		imageUrl: '',
		color: '#3b82f6'
	});

	const convex = getContext<ConvexReactClient>('convex');
	let expenseTypes = $state<ExpenseType[]>([]);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		const loadData = async () => {
			try {
				const data = await convex.query(api.expenses.getExpenseTypes, {});
				expenseTypes = data;
			} catch (error) {
				console.error('Error loading expense types:', error);
			}
		};

		loadData();
		intervalId = setInterval(loadData, 2000);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	let isDialogOpen = $state(false);
	let editingType = $state<ExpenseType | null>(null);

	function handleCreateExpenseType() {
		if (newExpenseType.name.trim()) {
			convex.mutation(api.expenses.createExpenseType, newExpenseType);
			newExpenseType = { name: '', description: '', imageUrl: '', color: '#3b82f6' };
			isDialogOpen = false;
		}
	}

	function handleUpdateExpenseType() {
		if (editingType && newExpenseType.name.trim()) {
			convex.mutation(api.expenses.updateExpenseType, { id: editingType._id, ...newExpenseType });
			editingType = null;
			newExpenseType = { name: '', description: '', imageUrl: '', color: '#3b82f6' };
			isDialogOpen = false;
		}
	}

	function handleEditExpenseType(expenseType: ExpenseType) {
		editingType = expenseType;
		newExpenseType = {
			name: expenseType.name,
			description: expenseType.description || '',
			imageUrl: expenseType.imageUrl || '',
			color: expenseType.color || '#3b82f6'
		};
		isDialogOpen = true;
	}

	function handleDeleteExpenseType(id: Id<'expenseTypes'>) {
		if (confirm('Are you sure you want to delete this expense type?')) {
			convex.mutation(api.expenses.deleteExpenseType, { id });
		}
	}
</script>

<Navigation />

<main class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-3xl font-bold">Expense Types</h2>
		<Dialog bind:open={isDialogOpen}>
			<DialogTrigger>
				<Button class="gap-2">
					<Plus class="h-4 w-4" />
					Add Expense Type
				</Button>
			</DialogTrigger>
			<DialogContent class="border-2 border-gray-300 bg-white shadow-2xl">
				<DialogHeader>
					<DialogTitle>
						{editingType ? 'Edit Expense Type' : 'Add New Expense Type'}
					</DialogTitle>
				</DialogHeader>
				<div class="space-y-4">
					<div class="flex w-full flex-col gap-1.5">
						<Label for="name">Name</Label>
						<Input
							id="name"
							bind:value={newExpenseType.name}
							placeholder="Enter expense type name"
							class="border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="description">Description</Label>
						<Input
							id="description"
							bind:value={newExpenseType.description}
							placeholder="Enter description (optional)"
							class="border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="imageUrl">Image URL</Label>
						<Input
							id="imageUrl"
							bind:value={newExpenseType.imageUrl}
							placeholder="Enter image URL (optional)"
							class="border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="color">Color</Label>
						<Input
							id="color"
							type="color"
							bind:value={newExpenseType.color}
							class="h-12 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500"
						/>
					</div>
					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border-2 border-gray-400 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							onclick={() => {
								isDialogOpen = false;
								editingType = null;
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							class="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							onclick={() => {
								if (editingType) {
									handleUpdateExpenseType();
								} else {
									handleCreateExpenseType();
								}
							}}
						>
							{editingType ? 'Update' : 'Create'}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if expenseTypes && expenseTypes.length > 0}
			{#each expenseTypes as expenseType (expenseType._id)}
				<Card class="group relative">
					<CardHeader class="pb-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div
									class="h-4 w-4 rounded-full"
									style="background-color: {expenseType.color || '#3b82f6'}"
								></div>
								<CardTitle class="text-lg">{expenseType.name}</CardTitle>
							</div>
							<div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
								<button
									type="button"
									class="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
									onclick={() => {
										handleEditExpenseType(expenseType);
									}}
								>
									<Edit class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
									onclick={() => {
										handleDeleteExpenseType(expenseType._id);
									}}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{#if expenseType.imageUrl}
							<img
								src={expenseType.imageUrl}
								alt={expenseType.name}
								class="mb-3 h-32 w-full rounded-md object-cover"
							/>
						{:else}
							<div class="mb-3 flex h-32 w-full items-center justify-center rounded-md bg-gray-100">
								<Upload class="h-8 w-8 text-gray-400" />
							</div>
						{/if}
						{#if expenseType.description}
							<p class="text-sm text-gray-600">{expenseType.description}</p>
						{/if}
					</CardContent>
				</Card>
			{/each}
		{:else}
			<div class="col-span-full py-12 text-center">
				<p class="text-gray-500">No expense types found. Create your first one!</p>
			</div>
		{/if}
	</div>
</main>
