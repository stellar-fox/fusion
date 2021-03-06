import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import ReactCrop, { makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import {
    Button as GenericButton, CircularProgress, Typography
} from "@material-ui/core"
import { action as UserManagementActions } from "../../redux/UserManagement"
import { action as SnackyActions } from "../../redux/Snacky"
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
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
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
            disabled: false,
            src: null,
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
                        await this.props.setSnackyColor("error")
                        await this.props.setSnackyMessage(
                            "Invalid image file selected."
                        )
                        await this.props.showSnacky()
                    }
                    showError()
                    return
                }

                // reject images larger than 100kb
                if (e.target.files[0].size > fileSizeLimit) {
                    const showError = async () => {
                        await this.props.setSnackyColor("error")
                        await this.props.setSnackyMessage(
                            "Image file too big."
                        )
                        await this.props.showSnacky()
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
        onCropChange = (crop) => {
            this.setState({ crop })
        }


        // ...
        onCropComplete = (crop) => {
            this.setState({ crop })
        }


        // ...
        onImageLoaded = (image) => {
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
            })
        }


        // ...
        getCroppedImage = (image, crop) => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height
            canvas.width = crop.width
            canvas.height = crop.height


            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            )

            return canvas.toDataURL("image/jpeg", 0.8)
        }


        // ...
        cancelUpload = async () => {
            await this.setState({ src: null })
            await this.props.setCropStatus(false)
        }


        // ...
        uploadImage = async () => {
            await this.setState({
                disabled: true,
                uploadInProgress: true,
            })
            await this.props.setCropStatus(false)
            const imgData = this.getCroppedImage(
                this.state.image, this.state.crop
            )
            try {
                const avatarRef = storageRef().child(
                    `${this.props.uid}/avatar.jpeg`
                )
                let uploadTask = avatarRef.putString(imgData, "data_url")
                uploadTask.on("state_changed", async (snapshot) => {
                    if ((
                        snapshot.bytesTransferred / snapshot.totalBytes
                    ) * 100 === 100) {
                        await this.props.setSnackyColor("success")
                        await this.props.setSnackyMessage("Image uploaded.")
                        await this.props.showSnacky()
                        this.props.updateUserProfile({ photoUrl: imgData })
                        this.setState({
                            disabled: false,
                            uploadInProgress: false,
                            src: null,
                        })
                    }
                })
            } catch (error) {
                await this.props.setSnackyColor("error")
                await this.props.setSnackyMessage("Image upload failed.")
                await this.props.showSnacky()
                await this.setState({
                    disabled: false,
                    uploadInProgress: false,
                    src: null,
                })
            }
        }


        // ...
        render = () => (
            ({ classes }) =>
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
                        <GenericButton style={{ marginBottom: "0.5em" }}
                            size="small" component="span" fullWidth
                            variant="outlined" color="secondary"
                        >Upload Custom Photo</GenericButton>
                        <Typography style={{ marginBottom: "0.5em" }}
                            variant="caption"
                        >
                            Maximum size: 100kb
                        </Typography>
                    </label>
                    {this.state.src &&
                    <Fragment>
                        <ReactCrop
                            style={{ maxWidth: "95vw" }}
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
