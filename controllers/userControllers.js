const { userModel } = require('../models/userSchema');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const { userComplaint } = require('../models/userComplaint');
const police = require('../models/Police');
const path = require('path');
const express = require('express');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const secretKey=process.env.SECRET_KEY;
const client = require('twilio')(accountSid, authToken);
// signup function of user
async function postUserDB(req, res) {
    try {
        const { name, user_id, role, email, Phone_number, Password, confirmPassword } = req.body;
        const userPost = await userModel.create({
            name: name,
            user_id: user_id,
            role: role,
            email: email,
            Phone_number: Phone_number,
            Password: Password,
            confirmPassword: confirmPassword
        });
        res.status(200).send({
            message: 'User created successfully',
            user: userPost
        });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(400).json({
            message: 'Error creating user',
            error: err.message
        });
    }
}
// login function of user.
async function login(req, res) {
    try {
        let body = req.body;
        let user = await userModel.findOne({ email: body.email });

        if (user) {
            if (body.password === user['Password']) {
                let payload = { user_id: user['user_id'], username: user['name'] };

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

                // Send SMS function call
                await senSMS(user['Phone_number']);

                // Set JWT token in cookie
                res.cookie('loggedin', token, { maxAge: 3600000, httpOnly: true, secure: true });
                res.status(200).send({
                    message: 'User logged in successfully',
                });
            } else {
                res.status(400).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
}
// function for rendering main.html,(shows or opens complaint box).
function main(req, res) {
    res.sendFile(path.join(__dirname, '../views/main.html'));
}
// protectRoute will see the authentication.
function protectRoute(req, res, next) {
    const token = req.cookies.loggedin;
    if (token) {
        JWT.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized login token" });
            }
            req.user = decoded; // Attach decoded user info to request object
            next();
        });
    } else {
        return res.status(401).sendFile(path.join(__dirname, '..', 'views', 'error.html'));
    }
}
// 
async function userReport(req, res) {
    try {
        const { phoneNumber, complaint, coordinates } = req.body;

        if (!phoneNumber || !complaint || !coordinates || coordinates.length !== 2) {
            return res.status(400).json({
                message: 'Invalid input data format'
            });
        }

        const userPost = await userComplaint.create({
            phone_number: phoneNumber,
            complaint: complaint,
            location: {
                type: 'Point',
                coordinates: coordinates
            }
        });

        // Store userPost coordinates in cookie for later use
        res.cookie('userPost', coordinates, { maxAge: 3600000, httpOnly: true, secure: true });

        // Find nearby police and send the response
        let nearbyPolice = await findNearbyPolice(coordinates[0], coordinates[1]);
        res.status(200).json({
            message: 'Complaint Posted',
            user: userPost, 
            nearbyPolice: nearbyPolice  // Send nearby police data to client
        });
    } catch (err) {
        console.error('Error creating Complaint:', err.message);
        res.status(400).json({
            message: 'Error creating Complaint',
            error: err.message
        });
    }
}

async function DateandTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const date = now.toLocaleDateString('en-US', {
        weekday: 'long', // Full weekday name
        year: 'numeric',
        month: 'long', // Full month name
        day: 'numeric'
    });

    return `You are logged in now at ${time} and ${date}.`;
}

async function senSMS(phno) {
    const phoneNumber = '+91' + phno;
    let body = await DateandTime();
    let msgOptions = {
        from: process.env.PH_NO,
        to: phoneNumber,
        body
    }

    try {
        const response = await client.messages.create(msgOptions);
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

async function findNearbyPolice(longitude, latitude) {
    try {
        const nearbyPolice = await police.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distance",
                    maxDistance: 100000, 
                    spherical: true,
                    query: {occupied:false}, // Optional: Additional query conditions for police collection
                    includeLocs: "location",
                    uniqueDocs: true
                }
            }
        ]);
        return nearbyPolice;
    } catch (error) {
        console.error('Error finding nearby police officers:', error);
        throw error;
    }
}

async function nearPolicePosted(req, res) {
    try {
        // Retrieve coordinates from cookie
        let coordinates = req.cookies.userPost;
        let nearbyPolice = await findNearbyPolice(coordinates[1], coordinates[0]);
        console.log("this is from nearPolicePosted");
        console.log(nearbyPolice);
        console.log(coordinates[0], coordinates[1])
        res.json(nearbyPolice);
    } catch (error) {
        console.error('Error fetching nearby police:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { postUserDB, login, main, protectRoute, userReport, nearPolicePosted };
