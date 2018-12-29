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
import ModalSignupSceptic from "./ModalSignupSceptic"
import ModalAwaitSceptic from "./ModalAwaitSceptic"
import ModalTransactionDetails from "./ModalTransactionDetails"




// <ShambhalaScepticCard> component
export default compose(
    withStyles((theme) => ({
        card: {
            maxWidth: 345,
            backgroundColor: theme.palette.custom.purpleDark,
        },
        media: {
            // ⚠️ object-fit is not supported by IE11.
            objectFit: "cover",
        },
        button: {
            fontSize: "12px",
            borderRadius: "3px",
        },
        purpleLight: {
            color: theme.palette.custom.purpleLight,
        },
    })),
    connect(
        (state) => ({
            count: getCountOfSigningMethodType(state.StellarAccounts, sm.MANUAL),
        }),
        (dispatch) => bindActionCreators({
            showSignupScepticModal: KeysActions.showSignupScepticModal,
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
            this.props.showSignupScepticModal()
            this.props.setSigningMethod(sm.MANUAL)
        }


        // ...
        render = () => (
            ({ classes, count, width }) => <Fragment>
                <ModalSignupSceptic />
                <ModalAwaitSceptic />
                <ModalTransactionDetails />

                <Card raised className={classes.card}>
                    <CardActionArea>
                        {isWidthUp("md", width) &&
                        <CardMedia
                            component="img"
                            alt="Contemplative Reptile"
                            className={classes.media}
                            height="140"
                            image={background}
                            title="Contemplative Reptile"
                        />
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h1" component="h2">
                                Shambhala Sceptic
                            </Typography>
                            <Typography component="p">
                                Trust no one. Sign your transactions
                                offline. Gives you a super secure way of
                                managing your funds. This one is for geeks.
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
                                label: classes.purpleLight,
                            }} variant="outlined" size="small"
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
