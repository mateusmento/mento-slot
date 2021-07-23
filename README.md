Slot component is an implementation of content distribution with some extended functionality for React.
By using Slot you can make your components extensible, by allowing to child elements be extracted as
fillings for the defined slots.


```
function Modal({children}) {
	return (
		<div className="modal">
			<header>
				<Slot $name="header" $source={children}/>
			</header>
			<main>
				<Slot $source={children}/>
			</main>
		</div>
	);
}
```

<Modal>
	<h4 $header>Hello world</h4>
	<small $header>A message to you all</small>
	<p>...</p>
</Modal>


Props:
- $as -> default type for the replacement of Slot
- $name -> name of the slot
- $type -> type for selecting fillings for the slot
- $condition -> condition for selecting fillings for the slot
- $filter -> filter data for filtering multiple fillings
- $merge -> merge function to reduce multiple fillings
- $require-fillings -> flag indicating a slot must not be filled with defaults
- $source -> source of fillings for the slot
- children as function or JSX -> default children for the slot or an function for constructing the slot

Components:
- Template
- Slot
