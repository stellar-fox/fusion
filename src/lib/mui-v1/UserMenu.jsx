import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import AccountCircle from "@material-ui/icons/AccountCircle"
import {
    Hidden, IconButton, Menu, MenuItem, Typography,
} from "@material-ui/core"
import { action as AuthActions } from "../../redux/Auth"
import { action as GroupManagementActions } from "../../redux/GroupManagement"




// ...
const styles = theme => ({
    menu: {
        backgroundColor: theme.palette.background.paper,
    },
})




// ...
class UserMenu extends Component {

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
    logout = () => {
        this.props.logout()
        this.props.resetGroupManagementState()
    }


    // ...
    render = () => {
        const { anchorEl, } = this.state
        const { classes, } = this.props

        return (
            <Fragment>
                <IconButton
                    aria-owns={anchorEl ? "user-menu" : null}
                    aria-haspopup="true"
                    onClick={this.openMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    classes={{ paper: classes.menu, }}
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My Account</MenuItem>
                    <MenuItem onClick={(event) =>
                        this.handleClose(event, this.logout)}
                    >Logout</MenuItem>
                </Menu>
                <Hidden smDown>
                    <Typography variant="caption" noWrap color="inherit">
                        {this.props.userFullName}
                    </Typography>
                </Hidden>
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
            userFullName: state.Auth.fullName,
        }),
        (dispatch) => bindActionCreators({
            logout: AuthActions.logout,
            resetGroupManagementState: GroupManagementActions.resetState,
        }, dispatch)
    ),
    withStyles(styles)
)(UserMenu)
