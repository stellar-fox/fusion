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
import { action as KeysActions, signingMethod as sm } from "../../redux/Keys"
import { setSigningMethod } from "../../actions/onboarding"
import ModalSignupSceptic from "./ModalSignupSceptic"
import ModalAwaitSceptic from "./ModalAwaitSceptic"




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
        (_state) => ({}),
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
            ({ classes, width }) => <Fragment>
                <ModalSignupSceptic />
                <ModalAwaitSceptic />

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
                                Trust no one. Sign your own transactions
                                elsewhere. Paste them back here when you're done.
                                This one is for geeks.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button
                            classes={{
                                root: classes.button,
                                label: classes.purpleLight,
                            }} variant="outlined" size="small"
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
