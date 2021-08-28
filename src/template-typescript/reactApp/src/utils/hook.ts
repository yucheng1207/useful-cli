import React, { useRef, useEffect } from 'react';
/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
export function useDidUpdateEffect(effect: React.EffectCallback, dependencies: React.DependencyList = []) {
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			effect();
		}
	}, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}
