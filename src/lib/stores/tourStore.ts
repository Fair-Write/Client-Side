import { driver } from 'driver.js';
import 'driver.js/dist/driver.css'; // Optional: for default styles

export const tourDriver = driver({
	showProgress: true,
	animate: true

	// Global options here
});

// You can optionally define steps here or allow components to define their own
export const steps = [
	{
		element: '#step1',
		popover: {
			title: 'Step 1',
			description: 'This is the first step.',
			position: 'bottom'
		}
	},
	{
		element: '#step2',
		popover: {
			title: 'Step 2',
			description: 'This is the second step.',
			position: 'bottom'
		}
	}
];

export function startTour() {
	driver().setSteps(steps);
	driver().drive();
}
