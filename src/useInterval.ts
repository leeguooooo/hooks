import { useEffect } from 'react';
import useHandler from './useHandler';

/**
 * 使用 `setInterval` 的 hook 版本。
 *
 * @param callback 回调
 * @param delay 由数字变为 `null` 以后，会暂停
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */

function useInterval(callback: () => void, delay: number | null): void {
	const tick = useHandler(callback);

	useEffect(() => {
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay, tick]);
}

export default useInterval;
