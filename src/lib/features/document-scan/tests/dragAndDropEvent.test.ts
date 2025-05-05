import { describe, it, vi, expect } from 'vitest';
import { dragOverHandler } from '../use-case/dragAndDropEvents';

describe('dragOverHandler', () => {
	it('calls preventDefault on the event', () => {
		const mockPreventDefault = vi.fn();
		const mockEvent = {
			preventDefault: mockPreventDefault
		} as unknown as Event;

		dragOverHandler(mockEvent);

		expect(mockPreventDefault).toHaveBeenCalled();
	});
});
