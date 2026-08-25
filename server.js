require("dotenv").config();

const app = require("./src/app");
const { checkDatabaseConnection } = require("./src/config/db");
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await checkDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}

startServer();