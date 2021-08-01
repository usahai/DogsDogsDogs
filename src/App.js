import React, { Component, Fragment } from "react";
import { Box, CircularProgress, Grid, ListItemIcon, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ArrowUpwardRounded, ArrowDownwardRounded, ClearRounded } from "@material-ui/icons";
import _ from "lodash";
import apiGateway from "./util/apiGateway";
import { SORT, URL } from "./util/constants";
import { DetailsTable, Image } from "./components";

const debounce = (fn, delay) => {
	var timer;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
};

const options = [{}];

const styles = theme => ({
	container: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	gridItem: {
		minHeight: "17rem"
	},
	imageStyles: {
		display: "flex",
		justifyContent: "center"
	},
	navbar: {
		margin: "1rem",
		padding: "1rem",
		// height: "4rem",
		border: "1px solid black",
		borderRadius: "4px",
		marginBottom: "1rem",
		display: "flex",
		alignItems: "center"
	},
	searchField: {
		margin: 0,
		width: "25rem"
	},
	order: {
		width: "10rem"
	},
	select: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
});

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			response: undefined,
			sorted_response: undefined,
			search: undefined,
			loading: true,
			sort: ""
		};
	}

	async componentDidMount() {
		let resp = await apiGateway.get(`${URL.BREEDS}`, {
			params: {
				// limit: 5
				// page: 1
			}
		});

		this.setState({
			data: resp,
			response: resp,
			sorted_response: resp,
			loading: false
		});
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevState.search !== this.state.search) {
			if (this.state.search === "") {
				this.handleSearchUpdate(true);
			} else {
				this.handleSearchUpdate(false);
			}
		}

		if (prevState.sort !== this.state.sort) {
			this.handleSortUpdate();
		}
	}

	handleSearchUpdate = async clear => {
		const { data, search } = this.state;

		this.setState({
			sort: "",
			loading: true
		});

		if (clear) {
			this.setState({
				response: data,
				sorted_response: data
			});
		} else {
			try {
				let resp = await apiGateway.get(`${URL.BREEDS}${URL.SEARCH}`, {
					params: {
						q: search
					}
				});

				this.setState({
					response: resp,
					sorted_response: resp
				});
			} catch (error) {
				console.error(error);
			}
		}

		this.setState({
			loading: false
		});
	};

	handleSearchChange = event => {
		this.setState({
			search: event.target.value
		});
	};

	handleSortUpdate = () => {
		const { response, sort } = this.state;

		switch (sort) {
			case SORT.NAME_ASC:
				this.setState({
					sorted_response: _.orderBy(response, ["name"], ["asc"])
				});

				break;
			case SORT.NAME_DESC:
				this.setState({
					sorted_response: _.orderBy(response, ["name"], ["desc"])
				});

				break;
			case SORT.HEIGHT_ASC:
				let height_asc = response.map(item => {
					if (item.height.metric.includes("-")) {
						item = {
							...item,
							cleaned_height: parseInt(item.height.metric.split(" - ")[0])
						};
					} else {
						item = {
							...item,
							cleaned_height: parseInt(item.height.metric)
						};
					}

					return item;
				});

				this.setState({
					sorted_response: _.orderBy(height_asc, ["cleaned_height"], ["asc"])
				});

				break;
			case SORT.HEIGHT_DESC:
				let height_desc = response.map(item => {
					if (item.height.metric.includes("-")) {
						item = {
							...item,
							cleaned_height: parseInt(item.height.metric.split(" - ")[1])
						};
					} else {
						item = {
							...item,
							cleaned_height: parseInt(item.height.metric)
						};
					}

					return item;
				});

				this.setState({
					sorted_response: _.orderBy(height_desc, ["cleaned_height"], ["desc"])
				});

				break;
			case SORT.LIFESPAN_ASC:
				let lifespan_asc = response.map(item => {
					if (item.life_span.includes("-")) {
						item = {
							...item,
							cleaned_life_span: parseInt(item.life_span.split(" - ")[0])
						};
					} else {
						item = {
							...item,
							cleaned_life_span: parseInt(item.life_span.split(" ")[0])
						};
					}

					return item;
				});

				this.setState({
					sorted_response: _.orderBy(lifespan_asc, ["cleaned_life_span"], ["asc"])
				});

				break;
			case SORT.LIFESPAN_DESC:
				let lifespan_desc = response.map(item => {
					if (item.life_span.includes("-")) {
						item = {
							...item,
							life_span: parseInt(item.life_span.split(" - ")[1])
						};
					} else {
						item = {
							...item,
							life_span: parseInt(item.life_span.split(" ")[0])
						};
					}

					return item;
				});

				this.setState({
					sorted_response: _.orderBy(lifespan_desc, ["life_span"], ["desc"])
				});

				break;
			default:
				this.setState({
					sorted_response: this.state.response
				});
		}
	};

	handleSortChange = event => {
		this.setState({
			sort: event.target.value
		});
	};

	setData = data => [
		{ label: "Name", value: <Image data={data} /> },
		{ label: "Origin", value: data.origin },
		{ label: "Height", value: data.height.metric },
		{ label: "Weight", value: data.weight.metric },
		{ label: "Life Span", value: data.life_span },
		{ label: "Breed Group", value: data.breed_group },
		{ label: "Bred For", value: data.bred_for },
		{ label: "Temperament", value: data.temperament }
	];

	render() {
		const { classes } = this.props;
		const { sorted_response, loading, sort } = this.state;

		return (
			<Fragment>
				<Box className={classes.navbar} fullWidth>
					<Typography variant="body1" style={{ marginRight: "1rem" }}>
						Search
					</Typography>
					<TextField
						className={classes.searchField}
						variant="outlined"
						margin="dense"
						onChange={debounce(this.handleSearchChange, 1000)}
						disabled={loading}
					/>
					<Typography variant="body1" style={{ margin: "0rem 1rem" }}>
						Sort By
					</Typography>
					<Select
						value={sort}
						onChange={this.handleSortChange}
						classes={{ root: classes.order, select: classes.select }}
					>
						<MenuItem value={""}>
							<span style={{ flexGrow: 1 }}>Clear</span>
							<ListItemIcon>
								<ClearRounded color="primary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.NAME_ASC}>
							<span style={{ flexGrow: 1 }}>Name</span>
							<ListItemIcon>
								<ArrowUpwardRounded color="primary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.NAME_DESC}>
							<span style={{ flexGrow: 1 }}>Name</span>
							<ListItemIcon>
								<ArrowDownwardRounded color="secondary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.HEIGHT_ASC}>
							<span style={{ flexGrow: 1 }}>Height</span>
							<ListItemIcon>
								<ArrowUpwardRounded color="primary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.HEIGHT_DESC}>
							<span style={{ flexGrow: 1 }}>Height</span>
							<ListItemIcon>
								<ArrowDownwardRounded color="secondary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.LIFESPAN_ASC}>
							<span style={{ flexGrow: 1 }}>Lifespan</span>
							<ListItemIcon>
								<ArrowUpwardRounded color="primary" />
							</ListItemIcon>
						</MenuItem>
						<MenuItem value={SORT.LIFESPAN_DESC}>
							<span style={{ flexGrow: 1 }}>Lifespan</span>
							<ListItemIcon>
								<ArrowDownwardRounded color="secondary" />
							</ListItemIcon>
						</MenuItem>
					</Select>
				</Box>
				{!loading ? (
					<Grid container spacing={2} className={classes.container}>
						{sorted_response.map(item => (
							<Grid item xs={12} sm={3} className={classes.gridItem}>
								<DetailsTable data={this.setData(item)} />
							</Grid>
						))}
					</Grid>
				) : (
					<span style={{ display: "flex", justifyContent: "center" }}>
						<CircularProgress />
					</span>
				)}
			</Fragment>
		);
	}
}

export default withStyles(styles)(App);
