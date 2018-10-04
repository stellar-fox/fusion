import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import AccountBoxRounded from "@material-ui/icons/AccountBoxRounded"
import {
    Divider, IconButton, Menu, MenuItem, Typography,
} from "@material-ui/core"
import { action as AuthActions } from "../../redux/Auth"
import Gravatar from "../Gravatar"
import PhotoAvatar from "../PhotoAvatar"
import { Link } from "react-router-dom"




// ...
const styles = theme => ({
    menu: {
        backgroundColor: theme.palette.background.paper,
    },
    menuItem: {
        "&:hover": {
            backgroundColor: theme.palette.custom.outerSpace,
        },
    },
    menuHeader: {
        cursor: "auto",
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    iconButton: {
        padding: 5,
        marginRight: "0.25em",
    },
})




// ...
class UserMenu extends Component {

    // ...
    state = {
        anchorEl: null,
    }


    // ...
    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget, })
    }


    // ...
    handleClose = (_event, action) => {
        this.setState({ anchorEl: null, })
        typeof action === "function" && action()
    }


    // ...
    logout = () => this.props.logout()


    // ...
    render = () => {
        const { anchorEl, } = this.state
        const { classes, displayName, email, photoUrl, width, } = this.props

        return (
            <Fragment>
                <IconButton
                    classes={{ root: classes.iconButton, }}
                    aria-owns={anchorEl ? "user-menu" : null}
                    aria-haspopup="true"
                    onClick={this.openMenu}
                    color="secondary"
                >
                    {isWidthDown("sm", width) ? <AccountBoxRounded /> :
                        photoUrl ? <PhotoAvatar src={photoUrl} /> :
                            <Gravatar email={email} />}
                </IconButton>
                <Menu
                    classes={{ paper: classes.menu, }}
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem component="div" className={classes.menuHeader}>
                        <div>
                            <Typography variant="body2" noWrap>
                                {displayName}
                            </Typography>
                            <Typography variant="display1" noWrap>
                                Admin
                            </Typography>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem className={classes.menuItem} component={Link}
                        to="/dashboard/user/" onClick={this.handleClose}
                    >Profile</MenuItem>
                    <MenuItem className={classes.menuItem} component={Link}
                        to="/dashboard/account/" onClick={this.handleClose}
                    >Account</MenuItem>
                    <Divider />
                    <MenuItem className={classes.menuItem} onClick={
                        (event) => this.handleClose(event, this.logout)}
                    >Logout</MenuItem>
                </Menu>
            </Fragment>
        )
    }
}




// ...
UserMenu.propTypes = {
    classes: PropTypes.object.isRequired,
}




// ...
export default compose(
    connect(
        (state) => ({
            email: state.Auth.email,
            displayName: state.Auth.displayName,
            photoUrl: state.Auth.photoUrl,
        }),
        (dispatch) => bindActionCreators({
            logout: AuthActions.logout,
        }, dispatch)
    ),
    withStyles(styles),
    withWidth()
)(UserMenu)
