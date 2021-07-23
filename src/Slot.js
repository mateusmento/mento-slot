function Slot(props) {
	let { 
		$source: source = null,
		...defaultProps
	} = props;

	return source;
}

export default Slot;
