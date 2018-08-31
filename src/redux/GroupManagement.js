import { createReducer } from "@xcmats/js-toolbox"
import { authToken } from "../lib/utils"
import {
    addUserGroup,
    deleteUserGroups,
    listUserGroups,
    updateUserGroup,
} from "../lib/api-calls"




// <GroupManagement> initial state
const initState = {
    selected: [],
    tableData: [],
}




// state const definitions
export const RESET_STATE = "@GroupManagement/RESET_STATE"
export const SET_STATE = "@GroupManagement/SET_STATE"




// ...
export const action = {

    // ...
    addUserGroup: (userGroupObj) =>
        async (_dispatch, getState) =>
            addUserGroup(
                authToken(getState),
                userGroupObj
            ),


    // ...
    deleteUserGroups: (userGroupObj) =>
        async (_dispatch, getState) =>
            deleteUserGroups(
                authToken(getState),
                userGroupObj
            ),


    // ...
    listUserGroups: (skipBots = false) =>
        async (_dispatch, getState) =>
            listUserGroups(authToken(getState), skipBots),


    // ...
    resetState: () => ({ type: RESET_STATE, }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    updateUserGroup: (userGroupObj) =>
        async (_dispatch, getState) =>
            updateUserGroup(
                authToken(getState),
                userGroupObj
            ),

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
