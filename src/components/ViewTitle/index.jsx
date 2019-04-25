import React, { Fragment, memo } from "react"
import {
    Grid,
    Typography,
} from "@material-ui/core"




/**
 * `<ViewTitle>` pure, stateless component.
 *
 * @function ViewTitle
 * @returns {React.ReactElement}
 */
export default memo(({ title, subtitle }) =>
    <Fragment>
        <Grid item>
            <Typography variant="h5">
                {title}
            </Typography>
        </Grid>
        <Grid item>
            <Typography noWrap variant="subtitle2">
                {subtitle}
            </Typography>
        </Grid>
    </Fragment>)

