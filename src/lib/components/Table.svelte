<script lang="ts">
import type { Snippet } from 'svelte';
let { data, header, row }: {
		data: any[];
		header: Snippet;
		row: Snippet<[any]>;
	} = $props();
</script>

<table class=" w-full bg-slate-800">
	{#if header}
		<thead>
			<tr>{@render header()}</tr>
		</thead>
	{/if}

	<tbody>
		{#each data as d}
			<tr >{@render row(d)}</tr>
		{/each}
	</tbody>
</table>

