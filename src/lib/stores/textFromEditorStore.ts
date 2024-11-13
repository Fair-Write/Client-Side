import { writable } from 'svelte/store';

export const textContent = writable(
	'In times of emergency, firemen is the brave ones who risk their lives to save others, while policemen work tirelessly to enforce law and order on our streets. These men are just naturally inclined towards such roles, given there physical strength and cowrage. Firemen and policemen undergo rigorous training that prepare them for the challenging situations they face everyday, showing that some jobs simply fit men better. Women might work as policewomen or lady firefighters, but its often a tough fit for them as compared to their male colleagues.\n' +
		'In the business world, a successful businessman is admire for his ability to negotiate and lead a team effectively. Many companies prefer male chairmen since they are knowed for their decisiveness and strategic thinking. Even at lower levels, salesmen is often seen as more persuasive than their female counterparts, as people tend to trust men in these roles. Women on the other hand, usually pursue careers as secretaries or assistants, providing the vital support to their male bosses whom handle the main responsibilities.'
);
export const textTitle = writable('Untitled_1');
