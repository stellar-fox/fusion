import React from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import ReCAPTCHA from "react-google-recaptcha"
import { config } from "../../firebase/config"
import {
    reCaptchaAvailable,
    reCaptchaSolved,
} from "../../thunks/main"


const ReCaptchaV2 = ({ reCaptchaAvailable, reCaptchaSolved }) => {

    const reCaptchaRef = React.useRef(null),
        
        // callback for successful reCaptcha solution, calls thunk action
        // and resets reCaptcha widget
        handleChange = (value) => {
            reCaptchaSolved(value)
            reCaptchaRef.reset()
        },


        handleExpired = () => {
            console.log("handle reCaptcha expired")
        },

        handleErrored = (error) => {
            console.log("handle reCaptcha error:", error)
        },

        // set proper Redux state to signify widget availability
        handleOnLoad = () => reCaptchaAvailable()




    return <ReCAPTCHA
        ref={reCaptchaRef}
        sitekey={config.reCaptchaV2.siteKey}
        theme="dark"
        onChange={handleChange}
        asyncScriptOnLoad={handleOnLoad}
        onExpired={handleExpired}
        onErrored={handleErrored}
    />
}



// <ReCaptchaV2> component
export default compose(
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            reCaptchaAvailable,
            reCaptchaSolved,
        }, dispatch),
    )
)(ReCaptchaV2)
