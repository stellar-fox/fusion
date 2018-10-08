import { reducer as ApplicationReducer } from "./Fusion"
import { reducer as AuthReducer } from "./Auth"
import { reducer as ModalReducer } from "./Modal"
import { reducer as RouterReducer } from "./FusionRouter"
import { reducer as SnackyReducer } from "./Snacky"
import { reducer as UserManagement } from "./UserManagement"




// ...
export default {

    App: ApplicationReducer,
    Auth: AuthReducer,
    Modal: ModalReducer,
    Router: RouterReducer,
    Snacky: SnackyReducer,
    UserManagement,
}
