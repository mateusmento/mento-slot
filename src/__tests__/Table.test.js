import ReactDOM from 'react-dom';
import Table, { Cell, Column, Head, Rows } from '../Table';

function renderDOM(jsx, tag = "div") {
	let root = document.createElement(tag);
	ReactDOM.render(jsx, root);
	return root;
}

test("render table with headers and cells", () => {
	let items = [
		{ id: 1, firstName: "First Name", lastName: "Last Name", age: 20 },
		{ id: 2, firstName: "Name", age: 30, _showDetails: true },
	];

	let actual = renderDOM(
		<Table items={items}>

			<Column title="Name" field="firstName" className="column-name">
				<Head colSpan={2}/>
				<Cell $if={item => item.lastName}/>
				<Cell $else colSpan={2}/>
				<Cell $if={item => item.lastName}>{item => item.lastName}</Cell>
			</Column>

			<Column title="Age" field="age" className="column-age"/>

			<Rows/>
			<Rows $if={item => item._showDetails}>
				<td colSpan={3}></td>
			</Rows>
		</Table>
	);

	let expected = renderDOM(
		<table>
			<thead>
				<tr>
					<th className="column-name" colSpan={2}>Name</th>
					<th className="column-age">Age</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className="column-name">First Name</td>
					<td className="column-name">Last Name</td>
					<td className="column-age">20</td>
				</tr>
				<tr>
					<td className="column-name" colSpan={2}>Name</td>
					<td className="column-age">30</td>
				</tr>
				<tr>
					<td colSpan={3}></td>
				</tr>
			</tbody>
		</table>
	);

	expect(actual.innerHTML).toBe(expected.innerHTML);
});
