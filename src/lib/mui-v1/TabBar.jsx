import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Tabs, Tab } from "@material-ui/core"
import {
    AttachMoneyRounded, BarChartRounded, PeopleRounded
} from "@material-ui/icons"




// <TabBar> component
export default compose(
    withStyles( (theme) => ({
        tabsIndicator: {
            backgroundColor: theme.palette.error.dark,
        },
        tabSelected: {
            color: theme.palette.error.dark,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        state = { value: 0, }

        handleTabChange = (_event, value) => this.setState({ value, })

        // ...
        render = () => (
            ({ classes, color, disabled, }, { value, }) =>
                <Tabs
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, }}
                    value={value} onChange={this.handleTabChange}
                >
                    <Tab classes={{ selected: classes.tabSelected, }} disabled={disabled} icon={<BarChartRounded color={color} />} />
                    <Tab classes={{ selected: classes.tabSelected, }} disabled={disabled} icon={<AttachMoneyRounded color={color} />} />
                    <Tab classes={{ selected: classes.tabSelected, }} disabled={disabled} icon={<PeopleRounded color={color} />} />
                </Tabs>
        )(this.props, this.state)

    }
)
