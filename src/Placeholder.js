import { isValidElement, forwardRef, createElement, Children } from "react";
import { callable, mergeElements } from "./functions";

function Placeholder(props, ref) {
	let {
		$name: name,
		$type: type,
		$condition: condition,
		$source: source = [],
		$as: as,
		$data: data,
		$merged: merge,
		$requireFilling: requireFilling,
		$props,
		children: defaultContent,
		...defaultProps
	} = props;

	defaultProps = { ...defaultProps, ...$props };

	source = Children.toArray(source);
	let fillings = filterFillings();
	if (requireFilling && fillings.length === 0) return null;
	if (merge) fillings = mergeElements(fillings);

	if (defaultContent instanceof Function) {
		if (fillings.length > 0)
			return Children.map(fillings, buildFilling);
		else
			return buildFilling({props: {}, ref});
	}

	fillings = Children.map(fillings, cloned);
	if (fillings.length > 0) return fillings;
	return renderDefaultFilling();



	function isFilling(f) {
		return isValidElement(f) && (!name || `$${name}` in f.props) && (!type || f.type === type);
	}

	function filterFillings() {
		let previousIf = false;
		let fillings = source.filter(f => isFilling(f));

		if (data)
			fillings = fillings.filter(({props: { $if, $else }}) => {
				let currentIf = $if ? !!$if(data) : null;
				let result = $else && previousIf === true ? false : currentIf;
				previousIf = $else && previousIf === true ? true : currentIf;
				return result === false ? false : true;
			});

		if (condition)
			fillings = fillings.filter(f => condition(props, f, children));

		return fillings;
	}

	function cloned(filling) {
		let { type, props, children } = prepareFilling(filling);
		children = children || defaultContent;
		return createElement(type, props, children);
	}

	function buildFilling(filling) {
		let { type, props, children, ref, key } = prepareFilling(filling);
		return defaultContent(props, {type, children, ref, key, count: fillings.length});
	}

	function renderDefaultFilling() {
		if (as && ref) defaultProps.ref = ref;
		if (as) return createElement(as, defaultProps, defaultContent);
		return defaultContent || null;
	}

	function prepareFilling({type, ref, key, ...filling}) {
		let { [`$${name}`]: _, $if, $else, children, ...props } = filling.props;
		if (ref) props.ref = ref;
		if (key) props.key = key;
		props = { ...defaultProps, ...props };
		children = callable(children)(data);
		return { type, props, children, ref, key };
	}
}

export default forwardRef(Placeholder);
