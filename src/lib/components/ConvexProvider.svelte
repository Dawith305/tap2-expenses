<script lang="ts">
	import { setContext } from 'svelte';
	import { convex } from '$lib/convex';
	import type { ConvexReactClient } from 'convex/react';

	setContext<ConvexReactClient>('convex', convex);
</script>

<slot />
