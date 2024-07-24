const police = require('../models/Police');
// this is for login of police.
async function PoliceLogin(req, res) {
  try {
    const { user_id, password,location } = req.body;

    // Validate input data
    if (!user_id || !location || !password||!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: 'Invalid input data format'
      });
    }

    // Check if the police officer is already logged in
    let policePost = await police.findOne({ user_id: user_id,password:password });
     
    if (policePost) {
      // Update the location if the officer is already logged in

      policePost.location = location;
      await policePost.save();
    } else {
      // Create a new entry if the officer is not logged in
      policePost = await police.create({
        user_id: user_id,
        password:password,
        location: location
      });
    }
    res.status(200).send({
      message: 'Police logged in successfully',
      user: policePost
    });
  } catch (err) {
    console.error('Error logging in Police:', err.message);
    res.status(400).json({
      message: 'Error logging in Police',
      error: err.message
    });
  }
}
// logout of police
async function PoliceLogout(req, res) {
  try {
    const { user_id,password } = req.body;

    if (!user_id||!password) {
      return res.status(400).json({
        message: 'Invalid input data format'
      });
    }

    // Remove the police officer from the collection
    let userLogged=await police.findOne({user_id:user_id,password:password});

    if(userLogged)
    {await police.findOneAndDelete({ user_id: user_id ,password:password});
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

module.exports = { PoliceLogin, PoliceLogout };
