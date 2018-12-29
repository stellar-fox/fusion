import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import withWidth, { isWidthUp } from "@material-ui/core/withWidth"

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from "@material-ui/core"

import AnimatedValue from "../AnimatedValue"
import background from "../Fusion/static/bg.png"
import { action as KeysActions, signingMethod as sm } from "../../redux/Keys"
import { setSigningMethod } from "../../actions/onboarding"
import { getCountOfSigningMethodType } from "../../lib/logic/stellarAccount"
import ModalSignupPure from "./ModalSignupPure"
import ModalAwaitPure from "./ModalAwaitPure"




// <ShambhalaPureCard> component
export default compose(
    withStyles((theme) => ({
        blue: {
            color: theme.palette.custom.blue,
        },
        button: {
            fontSize: "12px",
            borderRadius: "3px",
        },
        card: {
            maxWidth: 345,
            backgroundColor: theme.palette.custom.blueDark,
        },
        media: {
            // ⚠️ object-fit is not supported by IE11.
            objectFit: "cover",
        },

    })),
    connect(
        (state) => ({
            count: getCountOfSigningMethodType(state.StellarAccounts, sm.SHAMBHALA),
        }),
        (dispatch) => bindActionCreators({
            showSignupPureModal: KeysActions.showSignupPureModal,
            setSigningMethod,
        }, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleSelection = () => {
            this.props.showSignupPureModal()
            this.props.setSigningMethod(sm.SHAMBHALA)
        }


        // ...
        render = () => (
            ({ classes, count, width }) => <Fragment>
                <ModalSignupPure />
                <ModalAwaitPure />
                <Card raised className={classes.card}>
                    <CardActionArea>
                        {isWidthUp("md", width) &&
                        <CardMedia
                            component="img"
                            alt="Shambhala Pure"
                            className={classes.media}
                            height="140"
                            image={background}
                            title="Shambhala Pure"
                        />
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h1" component="h2">
                                Shambhala Pure
                            </Typography>
                            <Typography component="p">
                                The most convinient and secure way of accessing
                                your bank. Manage your funds and sign
                                transactions with a simple PIN.
                            </Typography>
                            <div className="m-t flex-box-row space-between">
                                <Typography variant="subtitle1">
                                    Keys:
                                </Typography>
                                <AnimatedValue
                                    valueToAnimate={count}
                                    variant="subtitle1"
                                />
                            </div>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button
                            classes={{
                                root: classes.button,
                                label: classes.blue,
                            }}
                            variant="outlined" size="small"
                            onClick={this.handleSelection}
                        >Add</Button>
                        <Button classes={{
                            root: classes.button,
                        }} variant="outlined" size="small"
                        >Learn More</Button>
                    </CardActions>
                </Card>
            </Fragment>
        )(this.props)

    }
)
