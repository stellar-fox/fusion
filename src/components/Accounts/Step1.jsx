import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Fade,
    FormControl,
    FormControlLabel,
    Grow,
    Radio,
    RadioGroup,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import { setSigningMethod } from "../../actions/onboarding"
import { signingMethod as sm } from "../../redux/Keys"
import InputAccountId from "./InputAccountId"
import InputLedgerAccount from "./InputLedgerAccount"




/**
 * Fusion.
 *
 * Step 1 for creating new account.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Step1>` component.
 *
 * @function Step1
 * @returns {React.ReactElement}
 */
const Step1 = ({ classes, signingMethod, setSigningMethod }) => <Grow in={true}>
    <div className="flex-box-col">
        <Typography
            style={{ margin: "0 0 1rem 0" }}
            variant="body2"
        >
            Your funds and transactions are securely managed with a
            set of keys. We provide different ways of signing your
            transactions. Please select the signing method of your
            choice:
        </Typography>
        <FormControl component="fieldset">
            <RadioGroup aria-label="position" name="position"
                value={signingMethod}
                onChange={(e) => setSigningMethod(e.target.value)}
            >
                <FormControlLabel
                    value="end"
                    control={
                        <Radio
                            checked={signingMethod === sm.SHAMBHALA}
                            onChange={(e) => setSigningMethod(e.target.value)}
                            value={sm.SHAMBHALA}
                            name="radio-button-shambhala"
                            aria-label="Shambhala Pure"
                            classes={{
                                root: classes.root,
                                checked: classes.checked,
                            }}
                        />
                    }
                    label="Shambhala Pure"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="end"
                    control={
                        <Radio
                            checked={signingMethod === sm.LEDGERHQ}
                            onChange={(e) => setSigningMethod(e.target.value)}
                            value={sm.LEDGERHQ}
                            name="radio-button-ledgerhq"
                            aria-label="Shambhala Ledger"
                            classes={{
                                root: classes.root,
                                checked: classes.checked,
                            }}
                        />
                    }
                    label="Shambhala Ledger"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="end"
                    control={
                        <Radio
                            checked={signingMethod === sm.MANUAL}
                            onChange={(e) => setSigningMethod(e.target.value)}
                            value={sm.MANUAL}
                            name="radio-button-manual"
                            aria-label="Shambhala Sceptic"
                            classes={{
                                root: classes.root,
                                checked: classes.checked,
                            }}
                        />
                    }
                    label="Shambhala Sceptic"
                    labelPlacement="end"
                />

            </RadioGroup>
        </FormControl>
        <div className="flex-box-col">
            {func.choose(signingMethod, {
                [sm.SHAMBHALA]: () =>
                    <div className="flex-box-col"><Fade in timeout={{ enter: 700, exit: 300 }}>
                        <Typography
                            style={{ marginTop: "1rem" }}
                            variant="h4"
                        >
                            Your account will be secured by
                            multisignature mechanism and you will have
                            full control of your account at all times.
                            This is option is meant for novice users.
                        </Typography>
                    </Fade></div>,
                [sm.LEDGERHQ]: () => <InputLedgerAccount />,
                [sm.MANUAL]: () => <InputAccountId />,
            }, () => "unknown signing method")}
        </div>
    </div>
</Grow>




// ...
export default func.compose(
    withMobileDialog(),
    withStyles((theme) => ({
        root: {
            "&$checked": {
                color: theme.palette.custom.yellowDark,
            },
        },
        checked: {},
    })),
    connect(
        (state) => ({
            signingMethod: state.Keys.signingMethod,
        }),
        (dispatch) => bindActionCreators({
            setSigningMethod,
        }, dispatch),
    ),
)(Step1)
