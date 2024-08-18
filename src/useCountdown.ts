import { useRef, useState, useEffect } from 'react';
import useInterval from './useInterval';

/**
 * 创建一个倒计时，获取进行与结束状态
 *
 * ```js
 * const {done, days, hours, minutes, seconds} = useCountdown(myDate)
 *
 * render(done ? null : `还有 ${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`)
 * ```
 */
interface CountdownDiffs {
	done: boolean;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

interface UseCountdownOptions {
	start?: number;
	interval?: number;
	onTick?: (diffs: CountdownDiffs) => void;
}

const calculateDiffs = (endDate: number, startDate: number): CountdownDiffs => {
	const totalSeconds = Math.max(0, Math.floor((endDate - startDate) / 1000));
	return {
		done: totalSeconds === 0,
		days: Math.floor(totalSeconds / (3600 * 24)),
		hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
		minutes: Math.floor((totalSeconds % 3600) / 60),
		seconds: totalSeconds % 60,
	};
};

const useCountdown = (
	date: number | Date,
	{ start, interval = 1000, onTick }: UseCountdownOptions = {}
): CountdownDiffs => {
	const startRef = useRef<number>(start || Date.now());
	const endRef = useRef<number>(typeof date === 'number' ? date : date.getTime());
	const [diffs, setDiffs] = useState<CountdownDiffs>(() => calculateDiffs(endRef.current, startRef.current));

	useEffect(() => {
		startRef.current = start || Date.now();
		endRef.current = typeof date === 'number' ? date : date.getTime();
		setDiffs(calculateDiffs(endRef.current, startRef.current));
	}, [date, start]);

	useInterval(() => {
		const elapsed = Date.now() - startRef.current;
		const newDiffs = calculateDiffs(endRef.current, startRef.current + elapsed);
		setDiffs(newDiffs);
		onTick?.(newDiffs);
	}, diffs.done ? null : interval);

	return diffs;
};

export default useCountdown;
