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
import ModalSignupLedger from "./ModalSignupLedger"



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
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            showSignupLedgerModal: KeysActions.showSignupLedgerModal,
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
            setSigningMethod(sm.LEDGERHQ)
        }


        // ...
        render = () => (
            ({ classes, width }) => <Fragment>
                <ModalSignupLedger />
            
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
                            <Typography gutterBottom variant="h1" component="h2">
                                Shambhala Ledger
                            </Typography>
                            <Typography component="p">
                                Associate <span className="cursive">Ledger Nano S
                                </span> device with Shambhala to increase
                                usability. Transactions are simply signed with
                                a PIN of your choice.
                            </Typography>
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
