function Slot(props) {
	let {
		$name: name,
		$source: source = null,
		...defaultProps
	} = props;

	if (name)
		return renderAsNamedSlot(name, source);

	return renderAsDefaultSlot(source);
}

function renderAsDefaultSlot(fillings) {
	return fillings.filter(f => !Object.keys(f.props).some(k => k.startsWith("$")));
}

function renderAsNamedSlot(name, fillings) {
	return fillings.filter(f => Object.keys(f.props).some(k => k === "$" + name));
}

export default Slot;
