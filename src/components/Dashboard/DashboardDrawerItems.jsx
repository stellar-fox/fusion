import React from "react"
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core"
import {
    AccountBalanceRounded,
    AccountBalanceWalletRounded,
    AccountBoxRounded,
    ContactsRounded,
    CreditCardRounded,
    VpnKeyRounded,
} from "@material-ui/icons"
import { withStyles } from "@material-ui/core/styles"




// ...
const styles = theme => ({
    selectedGreen: {
        backgroundColor: `${theme.palette.custom.greenDark} !important`,
        opacity: "0.9",
    },
    selectedYellow: {
        backgroundColor: `${theme.palette.custom.yellowDark} !important`,
        opacity: "0.9",

    },
    selectedBlue: {
        backgroundColor: `${theme.palette.custom.blue} !important`,
        opacity: "0.85",
    },
})




// ...
export const ActionItems = withStyles(styles)(
    ({ classes, itemClick, selectedItem }) =>
        <List>
            <ListItem classes={{ selected: classes.selectedGreen }}
                selected={selectedItem === "accounts"}
                button onClick={ () => itemClick("accounts") }
            >
                <ListItemIcon>
                    <AccountBalanceRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: "default",
                }} secondary="Accounts"
                />
            </ListItem>
            <ListItem classes={{ selected: classes.selectedGreen }}
                selected={selectedItem === "keys"}
                button onClick={ () => itemClick("keys") }
            >
                <ListItemIcon>
                    <VpnKeyRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: "default",
                }} secondary="Keys"
                />
            </ListItem>
            <ListItem classes={{ selected: classes.selectedGreen }}
                selected={selectedItem === "user"}
                button onClick={() => itemClick("user")}
            >
                <ListItemIcon>
                    <AccountBoxRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: "default",
                }} secondary="User Management"
                />
            </ListItem>
        </List>
)




// ...
export const DashboardItems = withStyles(styles)(
    ({ classes, itemClick, selectedItem }) =>
        <List>
            <ListItem classes={{ selected: classes.selectedYellow }}
                selected={selectedItem === "balances"}
                button onClick={() => itemClick("balances")}
            >
                <ListItemIcon>
                    <AccountBalanceWalletRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: selectedItem === "balances" ? "primary" : "default",
                }} secondary="Financial Overview"
                />
            </ListItem>
            <ListItem classes={{ selected: classes.selectedYellow }}
                selected={selectedItem === "transactions"}
                button onClick={() => itemClick("transactions")}
            >
                <ListItemIcon>
                    <CreditCardRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: selectedItem === "transactions" ? "primary" : "default",
                }} secondary="Transaction History"
                />
            </ListItem>
        </List>
)




// ...
export const ManagementItems = withStyles(styles)(
    ({ classes, itemClick, selectedItem }) =>
        <List>
            <ListItem classes={{ selected: classes.selectedBlue }}
                selected={selectedItem === "contacts"}
                button onClick={() => itemClick("contacts") }
            >
                <ListItemIcon>
                    <ContactsRounded className="drawer-svg-icon" />
                </ListItemIcon>
                <ListItemText secondaryTypographyProps={{
                    variant: "subtitle1",
                    color: selectedItem === "contacts" ? "primary" : "default",
                }} secondary="Contact Book"
                />
            </ListItem>
        </List>
)
