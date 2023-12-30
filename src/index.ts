import express from "express"
import App from "./services/express.app"
import dbConnection from "./services/database"

const startServer = async () => {

    const app = express()
    await dbConnection()
    await App(app)

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

}

startServer() 