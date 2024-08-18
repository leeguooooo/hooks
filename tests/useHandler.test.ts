import { renderHook } from '@testing-library/react-hooks';
import useHandler from '../src/useHandler';

describe('useHandler', () => {
	it('should return the same reference on every render', () => {
		const handler = jest.fn();
		const { result, rerender } = renderHook(() => useHandler(handler));

		const firstResult = result.current;

		rerender();

		expect(result.current).toBe(firstResult);
	});

	it('should call the latest handler provided', () => {
		const handler1 = jest.fn();
		const handler2 = jest.fn();
		const { result, rerender } = renderHook(({ handler }) => useHandler(handler), {
			initialProps: { handler: handler1 },
		});

		result.current();

		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).not.toHaveBeenCalled();

		rerender({ handler: handler2 });

		result.current();

		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
	});

	it('should forward arguments correctly to the handler', () => {
		const handler = jest.fn();
		const { result } = renderHook(() => useHandler(handler));

		result.current('arg1', 'arg2');

		expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
	});
});
