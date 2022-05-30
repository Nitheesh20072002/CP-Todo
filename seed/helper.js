// import mongoose  from 'mongoose';
// import User from '../models/user.js';
// import {getData} from '../utils/scrapping.js';
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const Manager = require('../models/problemmanager.js');

const {getData} = require('../scrapping/cf.js');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/CP-Todo';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const sample = ['neal','tourist','Errichto','Priyansh31dec','NitheeshKumar4','NitheeshKumarChapala'];


const seedDB = async () => {
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Manager.deleteMany({});
    // for (let i = 0; i < 6; i++) {
    //     let arr=[];
    //     for(let j=0;j<6;j++){
    //         if(i!=j) arr.push(sample[j]);
    //     }
    //     const newuser = new User({
    //         handle: sample[i],
    //         following: arr,
    //         followers: arr,
    //     });
    //     await getData(sample[i],4).then((data) =>{
    //         newuser.submissions.push(data);
    //     });
    //     await newuser.save();
    // }    
    
}

seedDB().then(() => {
    mongoose.connection.close();
})