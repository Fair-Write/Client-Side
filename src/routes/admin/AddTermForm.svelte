<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Form from '$lib/components/ui/form';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';
	import type { infer } from 'zod';
	import { postBulkList } from './service';

	interface Props {
		data: {
			form: SuperValidated<Infer<FormSchema>>;
		};
	}

	let { data }: Props = $props();

	// Control dialog open/close state
	let dialogOpen = $state(false);

	let submittedEntries: Array<{ term: string; alternatives: string }> = $state([]);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		// Handle client-side only, don't submit to server
		SPA: true,
		onUpdated: ({ form }) => {
			if (form.valid) {
				console.log('Form submitted successfully!');
				// Add the submitted data to our array
				submittedEntries.push({
					term: form.data.term,
					alternatives: form.data.alternatives
				});
				// Reset the form after successful submission
				form.data.term = '';
				form.data.alternatives = '';
				// Close the dialog after successful submission
				// dialogOpen = false;
			}
		}
	});
	const handleDialogClose = () => {
		dialogOpen = false;
		submittedEntries = [];
		// Reset form data to initial state
		reset();
	};

	const { form: formData, enhance, reset } = form;
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={handleDialogClose}>
	<Button
		variant="outline"
		onclick={() => {
			dialogOpen = true;
		}}>Add A New Term</Button
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add a New Term</Dialog.Title>
			<Dialog.Description>
				Make changes to the gender neutral terms here. Click add when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="term">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Term</Form.Label>
						<Input style="text-transform: lowercase;" {...props} bind:value={$formData.term} />
					{/snippet}
				</Form.Control>
				<Form.Description>Enter the gender-neutral term.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="alternatives">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Alternatives</Form.Label>
						<Input
							style="text-transform: lowercase;"
							{...props}
							bind:value={$formData.alternatives}
						/>
					{/snippet}
				</Form.Control>
				<Form.Description>Enter alternative terms (comma-separated).</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Dialog.Footer>
				<Form.Button>Add to list</Form.Button>
			</Dialog.Footer>
		</form>

		<!-- Display submitted entries -->
		{#if submittedEntries.length > 0}
			<div class="mt-4">
				<h4 class="mb-2 font-medium">Added Terms:</h4>
				<div class="max-h-32 space-y-2 overflow-y-auto">
					{#each submittedEntries as entry, index}
						<div class="flex items-center justify-between">
							<div class="rounded bg-muted p-2 text-sm">
								<div><strong>Term:</strong> {entry.term}</div>
								<div><strong>Alternatives:</strong> {entry.alternatives}</div>
							</div>
							<Button
								variant="destructive"
								size="sm"
								onclick={() => {
									submittedEntries.splice(index, 1);
								}}>delete</Button
							>
						</div>
					{/each}
				</div>
			</div>
			<Button
				onclick={() => {
					console.log(postBulkList(submittedEntries));
				}}>Submit</Button
			>
		{/if}
	</Dialog.Content>
</Dialog.Root>
