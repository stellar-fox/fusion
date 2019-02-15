import React from "react"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import {
    bindActionCreators,
    compose,
} from "redux"
import ReCAPTCHA from "react-google-recaptcha"
import { config } from "../../firebase/config"
import { Fade } from "@material-ui/core"
import {
    toggleRecaptchaToken,
    reCaptchaAvailable,
    reCaptchaSolved,
    toggleRecaptchaError,
} from "../../thunks/main"




// ...
const ReCaptchaV2 = ({
    onVerify, reCaptchaAvailable, reCaptchaSolved, toggleRecaptchaError,
    toggleRecaptchaToken,
}) => {

    const reCaptchaRef = React.useRef(null),
        
        // callback for successful reCaptcha solution, calls thunk action
        // and passes custom onVerify function from widget prop
        handleChange = (value) => reCaptchaSolved(value, onVerify),


        // clear token from Redux tree when the reCaptcha expires
        handleExpired = () => toggleRecaptchaToken(string.empty()),

        
        // set proper Redux state to signify widget error
        handleErrored = () =>
            toggleRecaptchaError("reCaptcha error. Please try again."),


        // set proper Redux state to signify widget availability
        handleOnLoad = (reCaptchaObj) => {
            if (reCaptchaObj.errored) {
                toggleRecaptchaError("reCaptcha could not be loaded.")
                return
            }
            reCaptchaObj.loaded && reCaptchaAvailable()
        }

    return <Fade in timeout={{ enter: 700, exit: 300 }}><div>
        <ReCAPTCHA
            ref={reCaptchaRef}
            sitekey={config.reCaptchaV2.siteKey}
            theme="dark"
            onChange={handleChange}
            asyncScriptOnLoad={handleOnLoad}
            onExpired={handleExpired}
            onErrored={handleErrored}
        />
    </div></Fade>
}




// <ReCaptchaV2> component
export default compose(
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            reCaptchaAvailable,
            reCaptchaSolved,
            toggleRecaptchaError,
            toggleRecaptchaToken,
        }, dispatch),
    )
)(ReCaptchaV2)
