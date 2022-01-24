import React, { useRef, useEffect, useCallback } from 'react';
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


/**
 * 所点击区域是否在容器元素内，并触发 triggerCallback
 *
 * @param {(enable: boolean) => void} triggerCallback
 * @return {*}  {(React.RefObject<HTMLElement>)}
 */
export const useClickTrigger = (triggerCallback: (enable: boolean) => void): React.RefObject<HTMLElement> => {
	const containerRef = React.useRef() as React.RefObject<HTMLElement>

	const callback = useCallback((e: MouseEvent) => {
		if (containerRef.current) {
			triggerCallback(containerRef.current.contains(e.target as Node))
		}
	}, [triggerCallback])

	useEffect(() => {
		window.document.addEventListener('click', callback)
		return () => {
			window.document.removeEventListener('click', callback)
		}
	}, [callback])

	return containerRef
}