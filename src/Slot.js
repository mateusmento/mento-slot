import { isValidElement, forwardRef, createElement, Children } from "react";
import omit from "lodash.omit";

function Slot(props, ref) {
	let {
		$name: name,
		$source: source = null,
		...defaultProps
	} = props;

	source = source instanceof Array ? source : [source];

	let result = name
		? renderAsNamedSlot(name, source)
		: renderAsDefaultSlot(source);

	return Children.toArray(result);
}

function renderAsDefaultSlot(fillings) {
	return fillings.filter(f => !isValidElement(f) || !Object.keys(f.props).some(k => k.startsWith("$")));
}

function renderAsNamedSlot(name, fillings) {
	return fillings.filter(f => isValidElement(f) && Object.keys(f.props).some(k => k === "$" + name))
		.map(f => cloneFilling(f, name));
}

function cloneFilling({type, props, ref, key}, name) {
	props = omit(props, `$${name}`);
	if (key) props.key = key;
	if (ref) props.ref = ref;
	return createElement(type, props);
}

export default forwardRef(Slot);
