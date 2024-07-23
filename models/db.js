const mongoose=require('mongoose');
require('dotenv').config();
function connect()
{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log('connected to the DB');
    })
    .catch((error)=>{
       console.log('error from DB',error);
    })
}
module.exports=connect;