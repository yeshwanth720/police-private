require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const policeRoutes = require('./routes/policeRoute');
const userRouter = require('./routes/userRouter');
const connectDB = require('./models/db');
const Police = require('./models/Police');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', userRouter);
app.use('/police', policeRoutes);
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','home.html'));
})
// Function to update police location
async function updateLocation(data) {
    try {
        // console.log(data);
        const police = await Police.findOne({ user_id: data.user_id });
        if (police) {
            police.location.coordinates = data.location.coordinates;
            await police.save();
            console.log('Location updated:', police);
        } else {
            console.log('Police ID not found');
        }
    } catch (error) {
        console.error('Error updating location:', error);
    }
}

// Serve static files
app.use(express.static(path.resolve('./public')));

app.get('/police-waiting', (req, res) => {
    res.sendFile(path.resolve('./public/policeliveupdatation.html'));
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A new user connected:', socket.id);
    socket.on('message', async (data) => {
        console.log('Data from user:', data);
        await updateLocation(data);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
