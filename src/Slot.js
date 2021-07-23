import { isValidElement } from "react";

function Slot(props) {
	let {
		$name: name,
		$source: source = null,
		...defaultProps
	} = props;

	source = source instanceof Array ? source : [source];

	if (name)
		return renderAsNamedSlot(name, source);

	return renderAsDefaultSlot(source);
}

function renderAsDefaultSlot(fillings) {
	return fillings.filter(f => !isValidElement(f) || !Object.keys(f.props).some(k => k.startsWith("$")));
}

function renderAsNamedSlot(name, fillings) {
	return fillings.filter(f => isValidElement(f) && Object.keys(f.props).some(k => k === "$" + name));
}

export default Slot;
