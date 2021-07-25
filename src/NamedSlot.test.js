import ReactDOM from 'react-dom';
import Slot from './Slot';
import fireEvent from '@testing-library/user-event';
import { forwardRef } from 'react';

function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}

describe("Named slots", () => {

	let Component = ({children}) =>
		<>
			<Slot $name="title" $source={children}/>
			<Slot $name="description" $source={children}/>
			<Slot $name="tag" $source={children}/>
		</>

	test("should be filled all corresponding named fillings", () => {
		let actual = renderDOM(
			<Component>
				<h2 $title>Article title</h2>
				<h4 $description>Article description</h4>
				<span $tag className="tag">news</span>
				<span $tag className="tag">today</span>
			</Component>
		);

		let expected = renderDOM(<>
			<h2>Article title</h2>
			<h4>Article description</h4>
			<span className="tag">news</span>
			<span className="tag">today</span>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should not be filled with unnamed fillings or not corresponding named fillings", () => {
		let actual = renderDOM(
			<Component>
				<h2 $title>Article title</h2>
				<span $wrong-slot-name>Not rendered</span>
				<span>Also not rendered</span>
			</Component>
		);

		let expected = renderDOM(<h2>Article title</h2>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should only treat react elements as fillings", () => {
		let actual = renderDOM(
			<>
				<Component>{"Hello world"}</Component>
				<Component>{12}</Component>
				<Component><b $title>Welcome</b></Component>
			</>
		);

		let expected = renderDOM(<b>Welcome</b>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve fillings maintaining its props and ref", () => {
		let Welcome = forwardRef(({name, greet, ...props}, ref) => <h1 {...props} onClick={greet} ref={ref}>Welcome, {name}!</h1>)

		let actualRef = { current: null };
		let greet = jest.fn();

		let actual = renderDOM(
			<Component>
				<Welcome $title className="welcome" name="Mateus" greet={greet} ref={actualRef}/>
			</Component>
		);

		let expected = renderDOM(
			<h1 className="welcome">Welcome, Mateus!</h1>
		);

		fireEvent.click(actual.firstChild, {});

		expect(actual.innerHTML).toBe(expected.innerHTML);
		expect(greet).toHaveBeenCalledTimes(1);
		expect(actualRef.current).toBe(actual.firstChild);
	});

	test("should have its name removed from resolved fillings", () => {
		let children = (<>
			<textarea $input $editor></textarea>
			<button></button>
			<input $input/>
		</>).props.children;

		let result = Slot.render({$name: "input", $source: children}, null);

		expect(result).toHaveLength(2);

		for (let {props} of result)
			expect(props).not.toHaveProperty("$input");
	});

	test("should have default props passed to all fillings", () => {
		let Component = ({children}) => <Slot $name="title" $source={children} className="title"/>

		let actual = renderDOM(
			<Component>
				<h3 $title id="title">Hello world</h3>
			</Component>
		);

		let expected = renderDOM(<h3 className="title" id="title">Hello world</h3>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

});
