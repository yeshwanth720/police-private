const police = require('../models/Police');
const JWT = require('jsonwebtoken');
const secretKey=process.env.SECRET_KEY;
require('dotenv').config();
//---------------------------------------------------------------------------------------------
// police signup
async function postpoliceDB(req, res) {
  try {
    const { user_id, password, confirmPassword, location } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    }

    const policePost = await police.create({
      user_id: user_id,
      occupied: false,
      password: password,
      isLoggedin:false,
      location: location
    });

    res.status(200).json({
      message: 'Police created successfully',
      police: policePost
    });
  } catch (err) {
    console.error('Error creating Police:', err.message);
    res.status(400).json({
      message: 'Error creating Police',
      error: err.message
    });
  }
}
// this function will be producing the police from request and storing it in the database
//----------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------------
// this is for login of police.
async function PoliceLogin(req, res) {
  try {
    const { user_id, password, location } = req.body;

    // Validate input data
    if (!user_id || !location || !password || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: 'Invalid input data format'
      });
    }

    // Check if the police officer is already logged in
    let policePost = await police.findOne({ user_id: user_id, password: password });

    if (policePost) {
      // Update the location if the officer is already logged in
      policePost.isLoggedin = true;
      policePost.location = location;
      await policePost.save();

      let payload = { user_id: policePost.user_id };
      
      let token = await new Promise((resolve, reject) => {
        JWT.sign(payload, secretKey, (err, token) => {
          if (err) {
            console.error('Error creating JWT:', err);
            reject(err);
          } else {
            resolve(token);
          }
        });
      });

      // Set the cookie and send the response
      res.cookie('policeLogin', token, { maxAge: 3600000, httpOnly: true, secure: true });
      
      // Send successful response
      return res.status(200).send({
        message: 'Police logged in successfully',
        user: policePost
      });
    } else {
      // User not valid
      return res.status(400).send({
        message: 'User is not valid',
        user: null
      });
    }
  } catch (err) {
    console.error('Error logging in Police:', err.message);
    return res.status(400).json({
      message: 'Error logging in Police',
      error: err.message
    });
  }
}

//---------------------------------------------------------------------------------------------------------------------------
// logout of police

//---------------------------------------------------------------------------------------------------------------------------
async function PoliceLogout(req, res) {
  try {
    const { user_id,password } = req.body;

    if (!user_id||!password) {
      return res.status(400).json({
        message: 'Invalid input data format'
      });
    }
    let person=await police.findOne({ user_id: user_id ,password:password});
    
    if(person)
    {  person["isLoggedin"]=false;
      res.status(200).send({
      message: 'Police logged out successfully'
    });}
    else{
      res.status(400).send({
        message: 'No user with this user_id has been Loggedin'
      })
    }
   
  } catch (err) {
    console.error('Error logging out Police:', err.message);
    res.status(400).json({
      message: 'Error logging out Police',
      error: err.message
    });
  }
}
//----------------------------------------------------------------------------------------------------------------------------
module.exports = { PoliceLogin, PoliceLogout ,postpoliceDB};


// let payload = { user_id: policePost['user_id']};

//                 let token = await new Promise((resolve, reject) => {
//                     JWT.sign(payload, secretKey, (err, token) => {
//                         if (err) {
//                             console.error('Error creating JWT:', err);
//                             reject(err);
//                         } else {
//                             resolve(token);
//                         }
//                     });
//                 });

//res.cookie('loggedin', token, { maxAge: 3600000, httpOnly: true, secure: true });





