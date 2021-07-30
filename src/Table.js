import { forwardRef } from 'react';
import Placeholder from './Placeholder';


export let Column = () => null;

export let Head = forwardRef((props, ref) => <th {...props} ref={ref}/>);
Head.displayName = "Head";

export let Cell = forwardRef((props, ref) => <td {...props} ref={ref}/>);
Cell.displayName = "Cell";

export let Rows = forwardRef((props, ref) => <tr {...props} ref={ref}/>);
Rows.displayName = "Row";


function Table({items, children, ...props}, ref) {
	return (
		<table {...props} ref={ref}>
			<thead>
				<tr>
					<Placeholder $type={Column} $source={children}>{
						({title, field, ...props}, {children}) =>
							<Placeholder $type={Head} $as={Head} $source={children} $props={props}>{title}</Placeholder>
					}</Placeholder>
				</tr>
			</thead>
			<tbody>
				{items.map((item) =>
					<Placeholder key={item.id} $type={Rows} $as={Rows} $source={children} $data={item}>
						<Placeholder $type={Column} $source={children}>{
							({field, title, ...props}, {children}) =>
								<Placeholder $type={Cell} $as={Cell} $source={children} $props={props} $data={item}>{item[field]}</Placeholder>
						}</Placeholder>
					</Placeholder>
				)}
			</tbody>
		</table>
	);
}

export default forwardRef(Table);
