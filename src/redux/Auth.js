import {
    createReducer,
    partial,
} from "@xcmats/js-toolbox"
import { login } from "../lib/api-calls"




// <Auth> state
const initState = {
    status: {
        loginAttempts: 0,
        maxLoginAttempts: 1,
    },
}




// ...
export const RESET_STATE = "@Auth/RESET_STATE"
export const SET_STATE = "@Auth/SET_STATE"




// ...
export const action = {

    // ...
    login: (...args) =>
        async (dispatch, _getState) => {
            let resp = await partial(login)(...args)((i, mi) =>
                dispatch(action.setState({
                    status: {
                        loginAttempts: i,
                        maxLoginAttempts: mi,
                    },
                }))
            )

            if (resp.status === 200) {
                dispatch(action.setState({
                    activated: resp.data.metaData.activated,
                    admin: resp.data.admin,
                    authToken: resp.headers["x-auth-token"],
                    createdByUser: resp.data.metaData.createdByUser,
                    createdDate: resp.data.metaData.createdDate,
                    editor: resp.data.editor,
                    fullName:
                        resp.data.fullName.split(", ").reverse().join(" "),
                    groupAdmin: resp.data.groupAdmin,
                    modifiedByUser: resp.data.metaData.modifiedByUser,
                    modifiedDate: resp.data.metaData.modifiedDate,
                    userGroupIds: resp.data.userGroupIds,
                    userId: resp.data.id,
                    userName: resp.data.userName,
                    userRole: resp.data.userRole,
                }))
            }

        },


    // ...
    logout: () =>
        async (dispatch, _getState) =>
            dispatch(action.resetState()),


    // ...
    resetState: () => ({ type: RESET_STATE, }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
