<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { TformSchema } from '$lib/features/suggestion-bot/entities/formSchema';
	import { cn } from '$lib/utils';
	import * as Select from '$lib/components/ui/select/index.js';
	import { preferenceStore } from '$lib/stores/preferenceStore';
	import { onMount } from 'svelte';
	let { toPreferenceModule }: { toPreferenceModule: () => void } = $props();

	let preferences = $state<TformSchema[]>([{ name: '', pronoun: '' }]);
	// this is the shittiest implementation of a preference array in history
	// I fucking hate this implementation
	// why can't svelte watch mutations of an array
	onMount(() => {
		// gets preferences
		if (localStorage.getItem('preferences')) {
			preferences = JSON.parse(localStorage.getItem('preferences') as string);
			$preferenceStore = JSON.parse(localStorage.getItem('preferences') as string);
			console.log('preferences', preferences);
			console.log('preferenceStore', $preferenceStore);
		} else {
			preferences = $preferenceStore;
		}
	});
</script>

<div class="h-full w-full">
	<!--	heading-->
	<div
		class="flex h-14 w-full items-center justify-between gap-2 border-b border-solid border-stone-300 bg-stone-50 p-3"
	>
		<div class="flex items-center justify-start gap-2">
			<span class="material-symbols-outlined s36 text-stone-500">psychology</span>
			<h2 class="text-xl font-semibold">Preference</h2>
		</div>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<span class="material-symbols-outlined s26 text-stone-500">info</span>
				</Tooltip.Trigger>
				<Tooltip.Content class="w-64">
					<p>
						If you have people with preferred pronouns, list down their names here and the AI will
						adjust accordingly.
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
	<div class="flex flex-col items-start justify-center gap-2 p-3">
		<!--back-->
		<div class="mb-5 w-full">
			<button
				class="group flex items-center justify-start gap-2"
				onclick={() => toPreferenceModule()}
			>
				<span class="material-symbols-outlined s26 text-stone-500">arrow_back</span>
				<span class="text-base group-hover:underline"> Back </span>
			</button>
		</div>
		<!--inputs -->
		<div class=" flex w-full flex-col items-center justify-center gap-3">
			{#each preferences as preference, index}
				<div class="flex items-center justify-center gap-2">
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						{#if index === 0}
							<Label for="Name">Name</Label>
						{/if}
						<Input
							type="text"
							bind:value={preference.name}
							onchange={() => {
								$preferenceStore = preferences;
								localStorage.setItem('preferences', JSON.stringify($preferenceStore));
							}}
							class="focus-visible:ring-blue-500"
							id="Name"
							placeholder="Insert your name..."
						/>
					</div>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						{#if index === 0}
							<Label for="Pronoun">Pronouns</Label>
						{/if}
						<Select.Root
							type="single"
							bind:value={preference.pronoun}
							onValueChange={() => {
								$preferenceStore = preferences;
								localStorage.setItem('preferences', JSON.stringify($preferenceStore));
							}}
						>
							<Select.Trigger class="focus:ring-blue-500">
								{#if preference.pronoun === ''}
									Preference
								{:else}
									{preference.pronoun}
								{/if}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="male">Male</Select.Item>
								<Select.Item value="female">Female</Select.Item>
								<Select.Item value="gender_fair">Neutral</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<!--remove entry-->
					<button
						class={cn('group', index === 0 && 'mt-5')}
						onclick={() => {
							preferences.splice(index, 1);
							$preferenceStore = preferences;
							localStorage.setItem('preferences', JSON.stringify($preferenceStore));
						}}
					>
						<span class="material-symbols-outlined s26 text-stone-500 group-hover:text-red-500"
							>cancel</span
						>
					</button>
				</div>
			{/each}

			{#if preferences.length === 0}
				<p class=" text-base text-muted-foreground">No Preferences</p>
			{/if}
		</div>
		<!--add-->
		<div class="flex w-full items-center justify-center">
			<Button
				class="h-10 w-10 rounded-full"
				variant="outline"
				onclick={() => {
					preferences = [...preferences, { name: '', pronoun: '' }];
					$preferenceStore = preferences;
					localStorage.setItem('preferences', JSON.stringify($preferenceStore));
					console.log(localStorage.getItem('preferences'));
				}}
			>
				<span class="material-symbols-outlined s26 text-stone-500">add</span></Button
			>
		</div>
	</div>
</div>
