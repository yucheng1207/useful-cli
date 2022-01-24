// set相关方法
// reference: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set#%E5%AE%9E%E7%8E%B0%E5%9F%BA%E6%9C%AC%E9%9B%86%E5%90%88%E6%93%8D%E4%BD%9C

/**
 * 判断是否是超集
 * @param set
 * @param subset
 * @returns
 */
export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
	for (const elem of subset) {
		if (!set.has(elem)) {
			return false;
		}
	}
	return true;
}

/**
 * 求两个set并集
 * @param setA
 * @param setB
 * @returns
 */
export function union<T>(setA: Set<T>, setB: Set<T>) {
	const _union = new Set(setA);
	for (const elem of setB) {
		_union.add(elem);
	}
	return _union;
}

/**
 * 求两个set交集
 * @param setA
 * @param setB
 * @returns
 */
export function intersection<T>(setA: Set<T>, setB: Set<T>) {
	const _intersection = new Set<T>();
	for (const elem of setB) {
		if (setA.has(elem)) {
			_intersection.add(elem);
		}
	}
	return _intersection;
}

/**
 * 求两个set的对称差集
 * @param setA
 * @param setB
 * @returns
 */
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>) {
	const _difference = new Set(setA);
	for (const elem of setB) {
		if (_difference.has(elem)) {
			_difference.delete(elem);
		} else {
			_difference.add(elem);
		}
	}
	return _difference;
}

/**
 * 求两个set的差集
 * @param setA
 * @param setB
 * @returns
 */
export function difference<T>(setA: Set<T>, setB: Set<T>) {
	const _difference = new Set(setA);
	for (const elem of setB) {
		_difference.delete(elem);
	}
	return _difference;
}