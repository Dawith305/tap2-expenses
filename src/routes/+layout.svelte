<script lang="ts">
	import ConvexProvider from '$lib/components/ConvexProvider.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import '../app.css';
</script>

<ConvexProvider>
	<Navigation />
	<slot />
</ConvexProvider>
