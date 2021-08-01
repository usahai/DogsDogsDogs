import "./table.css";

const DetailsTable = props => (
	<table>
		{props.data.map(item => (
			<tr>
				<td>{item.label}</td>
				<td>{item.value}</td>
			</tr>
		))}
	</table>
);

export default DetailsTable;
