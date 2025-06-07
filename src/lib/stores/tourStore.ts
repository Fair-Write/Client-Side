// lib/tour.service.ts
import { driver, type Config, type Driver, type DriveStep } from 'driver.js';
import { writable, type Writable } from 'svelte/store';

export interface TourStep extends DriveStep {
	id?: string;
}

export interface Tour {
	id: string;
	steps: TourStep[];
	options?: Config;
}

class TourService {
	private driverInstance: Driver | null = null;
	private tours: Map<string, Tour> = new Map();

	// Store to track current tour state
	public currentTour: Writable<string | null> = writable(null);
	public isActive: Writable<boolean> = writable(false);

	constructor() {
		this.initializeDriver();
	}

	private initializeDriver() {
		this.driverInstance = driver({
			showProgress: true,
			showButtons: ['next', 'previous', 'close'],
			disableActiveInteraction: false,

			// Global event handlers
			onHighlightStarted: () => {
				this.isActive.set(true);
			},

			onDestroyStarted: () => {
				this.isActive.set(false);
				this.currentTour.set(null);
			},

			// Default step options
			popoverClass: 'driverjs-theme',
			animate: true,
			smoothScroll: true
		});
	}

	// Register a tour
	registerTour(tour: Tour) {
		this.tours.set(tour.id, tour);
	}

	// Start a specific tour
	startTour(tourId: string, startFromStep: number = 0) {
		const tour = this.tours.get(tourId);
		if (!tour || !this.driverInstance) {
			console.warn(`Tour '${tourId}' not found`);
			return;
		}

		this.currentTour.set(tourId);

		// Apply tour-specific options
		if (tour.options) {
			this.driverInstance.setConfig(tour.options);
		}

		this.driverInstance.setSteps(tour.steps);
		this.driverInstance.drive(startFromStep);
	}

	// Highlight a specific element without starting full tour
	highlight(element: string | Element, options?: Partial<DriveStep>) {
		if (!this.driverInstance) return;

		this.driverInstance.highlight({
			element,
			...options
		});
	}

	// Stop current tour
	stop() {
		if (this.driverInstance) {
			this.driverInstance.destroy();
		}
	}

	// Move to next step
	next() {
		if (this.driverInstance) {
			this.driverInstance.moveNext();
		}
	}

	// Move to previous step
	previous() {
		if (this.driverInstance) {
			this.driverInstance.movePrevious();
		}
	}

	// Check if tours are available
	hasTour(tourId: string): boolean {
		return this.tours.has(tourId);
	}

	// Get all registered tours
	getAllTours(): Tour[] {
		return Array.from(this.tours.values());
	}

	// Clear all tours
	clearTours() {
		this.tours.clear();
	}
}

// Export singleton instance
export const tourService = new TourService();
