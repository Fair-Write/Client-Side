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
	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger>
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
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formData.term} />
					{/snippet}
				</Form.Control>
				<Form.Description>This is your public display name.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="alternatives">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formData.alternatives} />
					{/snippet}
				</Form.Control>
				<Form.Description>This is your public display name.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button>Add to list</Form.Button>
		</form>

		<div class="grid gap-4 py-4">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="term">Term</Label>
				<Input aria-invalid type="text" id="term" placeholder="insert input" />
			</div>

			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="alternatives">Alternatives</Label>
				<Input type="text" id="alternatives" placeholder="insert alternatives" />
				<p class="text-sm text-muted-foreground">Enter your email address.</p>
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Submit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
