import { renderHook, act } from '@testing-library/react-hooks';
import useCountdown from '../src/useCountdown';

describe('useCountdown', () => {
	it('should return the correct initial state', () => {
		const targetDate = Date.now() + 1000 * 60 * 60 * 24; // 1 day from now
		const { result } = renderHook(() => useCountdown(targetDate));

		const { days, hours, minutes, seconds, done } = result.current;

		expect(days).toBe(1);
		expect(hours).toBe(0);
		expect(minutes).toBe(0);
		expect(seconds).toBe(0);
		expect(done).toBe(false);
	});

	it('should update the countdown correctly', () => {
		jest.useFakeTimers();
		const targetDate = Date.now() + 1000 * 60 * 60 * 24; // 1 day from now
		const { result } = renderHook(() => useCountdown(targetDate, { interval: 1000 }));

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		const { days, hours, minutes, seconds, done } = result.current;

		expect(days).toBe(0);
		expect(hours).toBe(23);
		expect(minutes).toBe(59);
		expect(seconds).toBe(59);
		expect(done).toBe(false);

		jest.useRealTimers();
	});

	it('should call onTick callback', () => {
		jest.useFakeTimers();
		const targetDate = Date.now() + 1000 * 60 * 60 * 24; // 1 day from now
		const onTick = jest.fn();
		renderHook(() => useCountdown(targetDate, { interval: 1000, onTick }));

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(onTick).toHaveBeenCalled();

		jest.useRealTimers();
	});

	it('should be done when the countdown reaches zero', () => {
		const targetDate = Date.now();
		const { result } = renderHook(() => useCountdown(targetDate));

		const { done } = result.current;

		expect(done).toBe(true);
	});
});
