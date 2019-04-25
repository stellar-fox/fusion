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
import { signingMethodCount } from "../../lib/logic/signingMethods"
import ModalSignupLedger from "./ModalSignupLedger"
import ModalAwaitLedger from "./ModalAwaitLedger"




// <ShambhalaLedgerCard> component
export default compose(
    withStyles((theme) => ({
        card: {
            maxWidth: 345,
            backgroundColor: theme.palette.custom.greenDark,
        },
        media: {
            // ⚠️ object-fit is not supported by IE11.
            objectFit: "cover",
        },
        button: {
            fontSize: "12px",
            borderRadius: "3px",
        },
        greenLight: {
            color: theme.palette.custom.greenLight,
        },
    })),
    connect(
        (state) => ({
            count: signingMethodCount(state.SigningMethods, sm.LEDGERHQ),
        }),
        (dispatch) => bindActionCreators({
            showSignupLedgerModal: KeysActions.showSignupLedgerModal,
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
            this.props.showSignupLedgerModal()
            this.props.setSigningMethod(sm.LEDGERHQ)
        }


        // ...
        render = () => (
            ({ classes, count, width }) => <Fragment>
                <ModalSignupLedger />
                <ModalAwaitLedger />

                <Card raised className={classes.card}>
                    <CardActionArea>
                        {isWidthUp("md", width) &&
                        <CardMedia
                            component="img"
                            alt="Shambhala Ledger"
                            className={classes.media}
                            height="140"
                            image={background}
                            title="Shambhala Ledger"
                        />
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Shambhala Ledger
                            </Typography>
                            <Typography component="p">
                                Pair your <span className="cursive">
                                Ledger Nano S</span> securely with Shambhala to
                                increase usability. Sign transaction with a PIN
                                of your choice without having a physical device
                                present.
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
                                label: classes.greenLight,
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
