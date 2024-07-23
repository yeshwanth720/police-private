// const express = require('express');
// const dapp = express();
// const http = require('http');
// const { Server } = require('socket.io');
// const PORT = 5000;
// const police = require('./models/Police');
// const connect = require('./models/db');
// const path = require('path');
// dapp.use(express.json());
// connect();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer);



// async function updateLocation(data) {
//     try {
//       const polices = await police.findOne({ user_id: data.user_id });
//       if (polices) {
//         polices.location.coordinates = data.location.coordinates;
//         await polices.save();
//         console.log('Location updated:', polices);
//       } else {
//         console.log('Police ID not found');
//       }
//     } catch (error) {
//       console.error('Error updating location:', error);
//     }
//   }
  
//   dapp.use(express.static(path.resolve('./public')));
  
//   dapp.get('/', (req, res) => {
//     res.sendFile(path.resolve('./public/policeliveupdatation.html'));
//   });
  
//   io.on('connection', (socket) => {
//     console.log('A new user connected:', socket.id);
//     socket.on('message', async (data) => {
//       console.log('Data from user:', data);
//       await updateLocation(data);
//     });
    
//   });
  
//   httpServer.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
//   });