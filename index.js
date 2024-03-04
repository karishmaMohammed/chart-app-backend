const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require('./Routes/userRoutes');
const { default: mongoose } = require("mongoose");

const app = express();
dotenv.config();
app.use(express.json());

const connectDB = async() => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log("Server is connected") 
    } catch (error) {
     console.log("Server is not connected",error)   
    }   
}

connectDB(); 

app.get('/', (req, res) => {
    res.send("karishu");
});

app.use('/user', userRoutes);

const PORT = process.env.PORT || 8070;
app.listen(PORT, console.log(`server running ${PORT}`));