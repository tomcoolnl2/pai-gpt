/**
 * Represents a custom Set tailored for conversation messages.
 * @template T - Type of elements stored in the set.
 */
export class ConversationSet<T> extends Set<T> {
	/**
	 * Finds an element in the set that matches a specific property value.
	 * @param {K} prop - The property to match.
	 * @param {T[K]} value - The value to match for the property.
	 * @returns {T | undefined} - The matching element, if found; otherwise, undefined.
	 */
	findByProperty<K extends keyof T>(prop: K, value: T[K]): T | undefined {
		for (const item of this) {
			if ((item as any)[prop] === value) {
				return item;
			}
		}
		return undefined;
	}

	/**
	 * Finds all elements in the set that match a specific property value.
	 * @param {K} prop - The property to match.
	 * @param {T[K]} value - The value to match for the property.
	 * @returns {T[]} - Array of elements matching the property value.
	 */
	findAllByProperty<K extends keyof T>(prop: K, value: T[K]): T[] {
		const matchingItems: T[] = [];
		for (const item of this) {
			if ((item as any)[prop] === value) {
				matchingItems.push(item);
			}
		}
		return matchingItems;
	}

	/**
	 * Removes elements from the set that match a specific property value.
	 * @param {K} prop - The property to match.
	 * @param {T[K]} value - The value to match for the property.
	 * @returns {void}
	 */
	removeByProperty<K extends keyof T>(prop: K, value: T[K]): void {
		const itemsToRemove = this.findAllByProperty(prop, value);
		for (const item of itemsToRemove) {
			this.delete(item);
		}
	}

	/**
	 * Maps over the elements in the set and applies a transformation function to each element.
	 * @param {Function} callbackfn - A function that accepts an element of the set and returns a transformed value.
	 * @returns {Array} - An array containing the transformed elements.
	 */
	map<U>(callbackfn: (value: T, index: number, set: ConversationSet<T>) => U): U[] {
		const arrayFromSet = Array.from(this);
		return arrayFromSet.map((value, index) => callbackfn(value, index, this));
	}
}
