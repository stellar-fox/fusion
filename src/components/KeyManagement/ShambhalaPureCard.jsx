import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import withWidth, { isWidthUp } from "@material-ui/core/withWidth"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import background from "../Fusion/static/bg.png"
import ModalSignupPure from "./ModalSignupPure"
import ModalAwaitPure from "./ModalAwaitPure"
import { action as KeysActions, signingMethod as sm } from "../../redux/Keys"
import { setSigningMethod } from "../../actions/onboarding"


// <ShambhalaPureCard> component
export default compose(
    withStyles((theme) => ({
        card: {
            maxWidth: 345,
            backgroundColor: theme.palette.custom.blueDark,
        },
        media: {
            // ⚠️ object-fit is not supported by IE11.
            objectFit: "cover",
        },
        button: {
            fontSize: "12px",
            borderRadius: "3px",
        },
        blue: {
            color: theme.palette.custom.blue,
        },
    })),
    connect(
        (_state) => ({}),
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
        state = {}


        // ...
        handleSelection = () => {
            this.props.showSignupPureModal()
            this.props.setSigningMethod(sm.SHAMBHALA)
        }


        // ...
        render = () => (
            ({ classes, width }) => <Fragment>
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
                                The most convinient way of managing your bank.
                                Authorize this device to sign small transactions
                                on your behalf.
                            </Typography>
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
                        >Select</Button>
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
