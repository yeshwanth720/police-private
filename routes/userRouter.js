const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {getMailer}=require('../utils/mailer');
const {postUserDB,login,main,protectRoute,userReport,nearPolicePosted} = require('../controllers/userControllers');

const userRouter = express.Router();
userRouter.use(express.json());
userRouter.use(cookieParser());
// Serve signup.html for GET requests to /signup
userRouter.use(express.static(path.join(__dirname, '..','views')));
userRouter.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});
userRouter.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/login.html'));
})

userRouter.get('/logout', (req, res) => {
    res.clearCookie('isloggedin');
    res.status(200).json({ message: 'Logout successful' });
  });
userRouter.post('/send-mail',(req,res)=>{
  const { email, subject } = req.body;
  getMailer(email,subject);
  res.status(200).json({ message: 'Feedback sent!' });
});

  userRouter.get('/nearPolicePost',nearPolicePosted);
// Handle POST requests to /register
userRouter.post('/register', postUserDB);
userRouter.post('/loggedin', login);
userRouter.get('/main', protectRoute,main);
userRouter.post('/complaint',userReport);
userRouter.get('/nearbyPolice',(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/nearbyPolice.html'));
  })




// location of police
// userRouter.post('/update-location', async (req, res) => {
//     const { user_id, coordinates } = req.body;
  
//     if (!user_id || !coordinates || coordinates.length !== 2) {
//       return res.status(400).json({ error: 'Invalid data format' });
//     }
  
//     try {
//       // Find the police officer by user_id and update their location
//       await Police.findOneAndUpdate(
//         { user_id },
//         { location: { type: 'Point', coordinates } },
//         { upsert: true, new: true }
//       );
  
//       res.status(200).json({ message: 'Location updated successfully' });
//     } catch (error) {
//       console.error('Error updating location:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });




module.exports =  userRouter;
