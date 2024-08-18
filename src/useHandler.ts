import { useRef } from 'react';

/**
 * 创建一个不变的回调引用，使其内部能够始终从最新 props 取值
 *
 * 目的：
 * - 创建出的回调能安全地用做 hook deps，避免防止反复的 useEffect 清理
 * - 使调用方任意能使用函数表达式传递回调
 */
function useHandler<T extends (...args: any[]) => any>(handler: T): T {
	const handlerRef = useRef<T>(handler);

	handlerRef.current = handler;

	const stableHandler = useRef<T>(((...args: any[]) => handlerRef.current(...args)) as T);

	return stableHandler.current;
}

export default useHandler;
