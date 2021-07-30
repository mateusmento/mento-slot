export let callable = (value) => value instanceof Function ? value : () => value;

export let mergeClassNames = (a = '', b = '') => [a || '', b || ''].join(' ').trim();

export let mergeProps = (left, right) => {
	let props = {...left, ...right};

	if (typeof left.id === 'string' && typeof right.id === 'string')
		props.id = mergeClassNames(left.id, right.id);

	if (typeof left.className === 'string' && typeof right.className === 'string')
		props.className = mergeClassNames(left.className, right.className);

	let events = Object.entries(left)
		.filter(([key]) => /^on[A-Z]/.test(key) && key instanceof Function);

	for (let [name, handler] of events)
		if (right[name] instanceof Function)
			props[name] = mergeCallback(handler, right[name]);

	let children = left.children || right.children;
	if (children !== undefined) props.children = children;

	return props;
}

export function mergeElements(a, b) {
	let element = { ...a, props: mergeProps(a.props, b.props) }
	let ref = b.ref || a.ref;
	if (ref) element.ref = ref;
	return element;
}

export let mergeRef = (...refs) => (el) => el && refs.forEach(ref => {
	if (ref instanceof Function) ref(el);
	else if (ref instanceof Object) ref.current = el;
})

export let mergeCallback = (a, b) => {
	return (...args) => {
		a && a(...args);
		b && b(...args);
	};
}
