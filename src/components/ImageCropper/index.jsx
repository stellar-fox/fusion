import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import ReactCrop, { makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button as GenericButton, CircularProgress } from "@material-ui/core"
import { action as UserManagementActions } from "../../redux/UserManagement"
import { action as AuthActions } from "../../redux/Auth"
import Button from "../../lib/mui-v1/Button"
import { htmlEntities as he } from "../../lib/utils"
import { storageRef } from "../../firebase"



// <ImageCropper> component
export default compose(
    withStyles({
        input: {
            display: "none",
        },
    }),
    connect(
        (state) => ({
            uid: state.Auth.uid,
        }),
        (dispatch) => bindActionCreators({
            setCropStatus: UserManagementActions.setCropStatus,
            openSnackbar: UserManagementActions.openSnackbar,
            setSnackbarMessage: UserManagementActions.setSnackbarMessage,
            updateUserProfile: AuthActions.updateUserProfile,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            src: null,
            pixelCrop: null,
            crop: {
                x: 20,
                y: 20,
                width: 40,
                height: 40,
                aspect: 1,
            },
        }


        // ...
        componentDidMount = () => this.props.setCropStatus(false)


        // ...
        onSelectFile = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const imageType = /^image\//
                const fileSizeLimit = 100000

                // reject non-image files
                if (!imageType.test(e.target.files[0].type)) {
                    const showError = async () => {
                        await this.props.setSnackbarMessage(
                            "Invalid image file selected."
                        )
                        await this.props.openSnackbar()
                    }
                    showError()
                    return
                }

                // reject images larger than 100kb
                if (e.target.files[0].size > fileSizeLimit) {
                    const showError = async () => {
                        await this.props.setSnackbarMessage(
                            "Image file too big."
                        )
                        await this.props.openSnackbar()
                    }
                    showError()
                    return
                }

                const reader = new FileReader()
                reader.addEventListener(
                    "load",
                    () =>
                        this.setState({
                            src: reader.result,
                        }),
                    false
                )
                reader.readAsDataURL(e.target.files[0])
            }
        }


        // ...
        onCropChange = (crop, pixelCrop) => {
            this.setState({ crop, pixelCrop, })
        }


        // ...
        onCropComplete = (crop, pixelCrop) => {
            console.log(crop)
            console.log(pixelCrop)
            this.setState({ crop, pixelCrop, })
        }


        // ...
        onImageLoaded = (image, pixelCrop) => {
            this.props.setCropStatus(true)
            this.setState({
                crop: makeAspectCrop(
                    {
                        x: 20,
                        y: 20,
                        aspect: 1,
                        width: 40,
                        height: 40,
                    },
                    image.naturalWidth / image.naturalHeight
                ),
                image,
                pixelCrop,
            })
        }


        // ...
        getCroppedImage = (image, pixelCrop) => {
            const canvas = document.createElement("canvas")
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height
            const ctx = canvas.getContext("2d")

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            )

            return canvas.toDataURL("image/jpeg", 0.8)
        }


        // ...
        cancelUpload = async () => {
            await this.setState({ src: null, })
            await this.props.setCropStatus(false)
        }


        // ...
        uploadImage = async () => {
            await this.setState({ uploadInProgress: true, })
            await this.setState({
                uploadInProgress: false,
                src: null,
            })
            await this.props.setCropStatus(false)
            const imgData = this.getCroppedImage(
                this.state.image, this.state.pixelCrop
            )
            try {
                const avatarRef = storageRef().child(`${this.props.uid}/avatar.jpeg`)
                await avatarRef.putString(imgData, "data_url")

                await this.props.updateUserProfile({
                    photoUrl: imgData,
                })
            } catch (error) {
                console.log(error)
            }

            console.log(imgData)
        }


        // ...
        render = () => (
            ({ classes, }) =>
                <div className="flex-box-col">
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="photo-upload"
                        multiple
                        type="file"
                        onChange={this.onSelectFile}
                    />
                    <label htmlFor="photo-upload">
                        <GenericButton style={{ marginBottom: "1em", }}
                            size="small" component="span"
                            variant="outlined" color="secondary"
                        >Upload Custom Photo</GenericButton>
                    </label>
                    {this.state.src &&
                    <Fragment>
                        <ReactCrop
                            style={{ maxWidth: "95vw", }}
                            src={this.state.src}
                            crop={this.state.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            keepSelection
                            minHeight={40}
                            minWidth={40}
                        />
                        <div className="flex-box-row m-t">
                            <Button
                                color="green"
                                disabled={this.state.disabled}
                                onClick={this.uploadImage}
                            >
                                {this.state.uploadInProgress ? <CircularProgress
                                    color="secondary" thickness={4} size={16}
                                /> : "Crop & Upload"}
                            </Button>
                            <he.Nbsp /><he.Nbsp />
                            <Button
                                color="yellowDark"
                                disabled={this.state.disabled}
                                onClick={this.cancelUpload}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Fragment>}

                </div>
        )(this.props)

    }
)
