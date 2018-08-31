import { reducer as ApplicationReducer } from "./Fusion"
import { reducer as AuthReducer } from "./Auth"
import { reducer as GroupManagementReducer } from "./GroupManagement"
import { reducer as ModalReducer } from "./Modal"
import { reducer as RouterReducer } from "./FusionRouter"
import { reducer as SnackbarReducer } from "./Snackbar"
import { reducer as UserManagementReducer } from "./UserManagement"




// ...
export default {

    App: ApplicationReducer,
    Auth: AuthReducer,
    GroupManagement: GroupManagementReducer,
    Modal: ModalReducer,
    Router: RouterReducer,
    Snackbar: SnackbarReducer,
    UserManagement: UserManagementReducer,

}
