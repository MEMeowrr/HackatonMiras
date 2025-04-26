import { useState } from "react"
import LoginManager from "./loginManager"
import DashboardOverview from "./Dashboard/dashboardOverview"


const MainManager = () => {

    const [login, setLogin] = useState(true)

    const switchToDashboard = () => {
        setLogin(false)
    }

    return (
        <>
            {login ? <LoginManager switchToDashboard={switchToDashboard}/> : <DashboardOverview />}
        </>
    )

}

export default MainManager