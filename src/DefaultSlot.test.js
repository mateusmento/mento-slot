import ReactDOM from 'react-dom';
import Slot from './Slot';
import fireEvent from '@testing-library/user-event';
import { forwardRef } from 'react';

function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}

describe("A default slot", () => {

	let Component = ({children}) => <Slot $source={children}/>

	test("should be filled with unnamed fillings", () => {
		let actual = renderDOM(
			<Component>
				<h1>Hello World</h1>
				<small>Welcome to our page</small>
			</Component>
		);

		let expected = renderDOM(<>
			<h1>Hello World</h1>
			<small>Welcome to our page</small>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should not be filled with named slots", () => {
		let actual = renderDOM(
			<Component>
				<h1>Hello World</h1>
				<small $welcome>Welcome to our page</small>
				<a href="#">Start here</a>
			</Component>
		);

		let expected = renderDOM(<>
			<h1>Hello World</h1>
			<a href="#">Start here</a>
		</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve any value besides react elements as filling", () => {
		let actual = renderDOM(
			<Component>
				{"Hello"} <b>world</b> {1} {[2, "3"]}{true}{null}
			</Component>
		);

		let expected = renderDOM(<>Hello <b>world</b> 1 23</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});

	test("should resolve fillings from non-array values as source of fillings", () => {
		let actual = renderDOM(<>
			<Component>Hello</Component>
			<Component><b>world</b></Component>
			<Component>{12}</Component>
		</>);

		let expected = renderDOM(<>Hello<b>world</b>12</>);

		expect(actual.innerHTML).toBe(expected.innerHTML);
	});


	test("should resolve fillings maintaining its props and ref", () => {
		let Welcome = forwardRef(({name, greet, ...props}, ref) => <h1 {...props} onClick={greet} ref={ref}>Welcome, {name}!</h1>)

		let actualRef = { current: null }
		let greet = jest.fn();

		let actual = renderDOM(
			<Component>
				<Welcome className="welcome" name="Mateus" greet={greet} ref={actualRef}/>
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
});
