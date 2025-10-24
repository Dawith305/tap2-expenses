<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Receipt, CreditCard } from 'lucide-svelte';
</script>

<nav class="border-b bg-background">
	<div class="container mx-auto px-4 py-4">
		<div class="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
			<h1 class="text-2xl font-bold">Expense Tracker</h1>
			<div class="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<Button
					variant={$page.url.pathname === '/' ? 'default' : 'outline'}
					href="/"
					class="flex items-center gap-2"
				>
					<Receipt class="h-4 w-4" />
					Expense Types
				</Button>
				<Button
					variant={$page.url.pathname === '/expenses' ? 'default' : 'outline'}
					href="/expenses"
					class="flex items-center gap-2"
				>
					<CreditCard class="h-4 w-4" />
					Expenses
				</Button>
			</div>
		</div>
	</div>
</nav>
