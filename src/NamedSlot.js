import { isValidElement, forwardRef, createElement, Children } from "react";
import { mergeElements } from "../functions";

function NamedSlot(props, ref) {
	let {
		$name: name,
		$type: type,
		$condition: condition,
		$source: source = [],
		$as: as,
		$filter: filter,
		$data: data,
		$merged: merge,
		$requireFilling: requireFilling,
		children: defaultContent,
		...defaultProps
	} = props;


	source = Children.toArray(source);
	let fillings = source.filter(f => isFilling(f));
	if (requireFilling && fillings.length === 0) return null;
	if (merge) fillings = merged(fillings);

	if (defaultContent instanceof Function) {
		if (fillings.length > 0)
			return fillings.map(buildFilling);
		else
			return buildFilling({props: {}, ref});
	}

	fillings = Children.map(fillings, cloned);
	if (fillings.length > 0) return fillings;
	return renderDefaultFilling();



	function isFilling(filling) {
		let { [`$${name}`]: $slot, $filter, children, ...props } = filling.props;
		let filterCriteria = $slot instanceof Function ? $slot : $filter;

		let result = isValidElement(filling)
			&& (!name || `$${name}` in filling.props)
			&& (!type || filling.type === type)
			&& (!condition || condition(props, filling, children))
			&& (!filter || callable(filterCriteria || true)(filter));

		return result;
	}

	function cloned(filling) {
		let { [`$${name}`]: _, $filter, children, ...props } = filling.props;
		if (filling.key) props.key = filling.key;
		if (filling.ref) props.ref = filling.ref;
		children = children || defaultContent;
		return createElement(filling.type, { ...defaultProps, ...props }, children);
	}

	function merged(fillings) {
		return mergeElements(fillings);
	}

	function renderDefaultFilling() {
		if (ref) defaultProps.ref = ref;
		if (typeof as === "string" || typeof as === "function")
			return createElement(as, defaultProps, defaultContent);
		return defaultContent || null;
	}

	function buildFilling({type, ref, key, ...filling}) {
		let { [`$${name}`]: $slot, $filter, children, ...props } = filling.props;
		if (ref) props.ref = ref;
		if (key) props.key = key;
		props = {...defaultProps, ...props};
		return defaultContent(props, {type, children, ref, key, count: fillings.count});
	}
}

export default forwardRef(NamedSlot);
