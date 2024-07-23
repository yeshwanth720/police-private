const express = require('express');
const router = express.Router();
const path = require('path');
const { PoliceLogin, PoliceLogout} = require('../controllers/policeControllers');

// Serve static files from the 'public' directory
router.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Handle police login and logout routes
router.post('/login', PoliceLogin);
router.post('/logout', PoliceLogout);

// Serve the police login page
router.get('/logout-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/policeLogout.html'));
});
router.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/policeLogin.html'));
});

module.exports = router;