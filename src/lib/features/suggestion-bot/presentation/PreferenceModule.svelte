<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	import { formSchema, type FormSchema } from '../entities/formSchema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let {
		toPreferenceModule,
		data
	}: { toPreferenceModule: () => void; data: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema),
	});

	const { form: formData, enhance } = form;

	// const addEntry = () => {
	// 	formData.payload = [...form.data.payload, { Name: '', Pronoun: '' }];
	// };

	//
</script>

<div>
	<!--	heading-->
	<div
		class="flex h-14 w-full items-center justify-between gap-2 border-b border-solid border-stone-300 bg-stone-50 p-5"
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
				<Tooltip.Content>
					<p>blah blah blah blah</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>

	<div class="group flex flex-col items-center justify-between p-5">
		<!--back-->
		<button class="flex items-center justify-start gap-2" onclick={() => toPreferenceModule()}>
			<span class="material-symbols-outlined s26 text-stone-500">arrow_back</span>
			<span class="text-base group-hover:underline"> Back </span>
		</button>

		<!--form-->

		{form}

<!--		<form method="POST" use:enhance>-->
<!--			{#each form.payload as item, index}-->
<!--		-->
<!--			{/each}-->

<!--			<button type="submit">Submit</button>-->
<!--		</form>-->
		<div>
			<Button class="h-10 w-10	 rounded-full">
				<span class="material-symbols-outlined s26 text-stone-500">add</span></Button
			>
		</div>
	</div>
</div>
