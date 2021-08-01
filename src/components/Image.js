import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	popover: {
		pointerEvents: "none"
	},
	paper: {
		padding: theme.spacing(1)
	},
	label: {
		color: "blue",
		cursor: "pointer"
	},
	img: {
		maxHeight: "30rem"
	}
}));

export default function Image(props) {
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState(null);

	const handlePopoverOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<div>
			<Typography
				className={classes.label}
				aria-owns={open ? "mouse-over-popover" : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
			>
				{props.data.name}
			</Typography>
			<Popover
				id="mouse-over-popover"
				className={classes.popover}
				classes={{
					paper: classes.paper
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<img
					src={`https://cdn2.thedogapi.com/images/${props.data.reference_image_id}.jpg`}
					alt={props.data.name}
					className={classes.img}
					onerror={
						"this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';"
					}
				/>
			</Popover>
		</div>
	);
}
