import { isValidElement, forwardRef, createElement, Children } from "react";
import omit from "lodash.omit";

function Slot(props, ref) {
	let {
		$name: name,
		$source: source = [],
		$as: as,
		children: defaultContent = null,
		...defaultProps
	} = props;

	source = source instanceof Array ? source : [source];

	let result = name
		? renderAsNamedSlot(name, source, defaultProps)
		: renderAsDefaultSlot(source);

	if (result.length === 0)
		return renderDefaultContent(as, defaultProps, defaultContent);

	return Children.toArray(result);
}

function renderDefaultContent(type, props, children) {
	if (!type) return children;
	return createElement(type, props, children);
}

function renderAsDefaultSlot(fillings) {
	return fillings.filter(f => !isValidElement(f) || !Object.keys(f.props).some(k => k.startsWith("$")));
}

function renderAsNamedSlot(name, fillings, defaultProps) {
	return fillings.filter(f => isValidElement(f) && `$${name}` in f.props)
		.map(f => cloneFilling(f, name, defaultProps));
}

function cloneFilling({type, props, ref, key}, name, defaultProps) {
	props = { ...defaultProps, ...omit(props, `$${name}`) };
	if (key) props.key = key;
	if (ref) props.ref = ref;
	return createElement(type, props);
}

export default forwardRef(Slot);
