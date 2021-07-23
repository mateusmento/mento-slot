function Slot(props) {
	let { 
		$source: source = null,
		...defaultProps
	} = props;

	return source.filter(s => !Object.keys(s.props).some(k => k.startsWith("$")));
}

export default Slot;
