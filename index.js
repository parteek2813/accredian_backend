const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoute = require("./route/userRoute");
app.use('/user', userRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`server is live on http://localhost:${PORT}`);
})