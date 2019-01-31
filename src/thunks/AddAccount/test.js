import {
    actions as AddAccountActions,
    RESET_STATE,
    SET_ACCOUNT_TYPE,
    SET_NAME,
    SET_SIGNING_METHOD,
    
} from "../../redux/AddAccount"
import { accountType } from "../../redux/Accounts"
import { signingMethod } from "../../redux/Keys"




describe("AddAccount steps for Shambhala Pure:", () => {
    
    it("should reset AddAccount Redux tree", () => {
        const expectedAction = {
            type: RESET_STATE,
        }
        expect(AddAccountActions.resetState())
            .toEqual(expectedAction)
    })

    it("should set the accountType key in AddAccount Redux tree", () => {
        const expectedAction = {
            accountType: accountType.REAL,
            type: SET_ACCOUNT_TYPE,
        }
        expect(AddAccountActions.setAccountType(accountType.REAL))
            .toEqual(expectedAction)
    })    

    it("should set the signingMethod key in AddAccount Redux tree", () => {
        const expectedAction = {
            signingMethod: signingMethod.SHAMBHALA,
            type: SET_SIGNING_METHOD,
        }
        expect(AddAccountActions.setSigningMethod(signingMethod.SHAMBHALA))
            .toEqual(expectedAction)
    })

    it("should set the name key in AddAccount Redux tree", () => {
        const expectedAction = {
            name: "Test Name",
            type: SET_NAME,
        }
        expect(AddAccountActions.setName("Test Name"))
            .toEqual(expectedAction)
    })

})
