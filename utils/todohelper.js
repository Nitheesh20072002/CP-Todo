// import User from '../models/user.js'
// import { getData } from '../utils/scrapping.js';
// import mongoose from 'mongoose';
// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config();
// }
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const {getData} = require('../scrapping/cf.js');
const {manageHelper} = require('./managehelper.js');

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/CP-Todo';
// mongoose.connect(dbUrl,{
//     useNewUrlParser:true,
//     useUnifiedTopology: true
// })
// const db=mongoose.connection;
// db.on("error", console.error.bind(console,"connection error"));
// db.once("open",()=>{
//     console.log("Database connected");
// });

const updateNew= async ()=>{
    const allusers=await User.find();
    for(let x in allusers){
        const cur=allusers[`${x}`]['_doc']; 
        await updateSingle(cur.handle);
    }
    console.log('done');
};

const updateSingle= async (handle)=>{
    // console.log(handle);
    const user=await User.findOne({username:handle});
    user.following.forEach(async (ele,i) =>{
        let newarr=[];
        let start=2;
        while(true){
            const data=await getData(ele.name,start);
            if(Object.keys(data).length === 0){
                break;
            }
            if(data.problemId !== ele.last){
                newarr.push(data);
            }else break;
            start+=2;
        }
        // console.log(newarr);
        for(let i=newarr.length-1;i>=0;i--){
            ele.last=newarr[i].problemId;
            await manageHelper(newarr[i],handle);
            // const newprob=new Problem({problemUrl:newarr[i].problemId,problemName:newarr[i].problemName,problemStatus:newarr[i].problemStatus});
            // await user.todo.push(newprob);
            // await newprob.save();
            // await user.save();
        }
    });
}

// const removefromtodo = async (handle,probId) =>{
//     // db.survey.updateMany({ }, $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } })
//     await User.updateMany({'handle':handle}, {$pull:{todo:{'problemId':probId}}});
// };
// const da= async ()=>{
//     console.log(await getData('NitheeshKumarChapala'));
// }
// da();
// removefromtodo('tourist',"/contest/1684/problem/G");
// updateNew();
// updateSingle('me');
// export {updateNew,removefromtodo};
module.exports ={updateNew,updateSingle};
