import { renderHook, act } from '@testing-library/react-hooks';
import useInterval from '../src/useInterval';

jest.useFakeTimers();

describe('useInterval', () => {
	it('should call the callback after the specified delay', () => {
		const callback = jest.fn();
		renderHook(() => useInterval(callback, 1000));

		expect(callback).not.toBeCalled();

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('should not call the callback if delay is null', () => {
		const callback = jest.fn();
		renderHook(() => useInterval(callback, null));

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).not.toBeCalled();
	});

	it('should clear the interval when the component is unmounted', () => {
		const callback = jest.fn();
		const { unmount } = renderHook(() => useInterval(callback, 1000));

		unmount();

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).not.toBeCalled();
	});

	it('should restart the interval when delay changes', () => {
		const callback = jest.fn();
		const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
			initialProps: { delay: 1000 },
		});

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		rerender({ delay: 500 });

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(callback).toHaveBeenCalledTimes(2);
	});
});

jest.useRealTimers();
