const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const Manager = require('../models/problemmanager.js');

const manageHelper = async (data,username)=>{
    const user=await User.findOne({username:username});
    const probdata={problemUrl:data.problemId,problemName:data.problemName,problemStatus:data.problemStatus};
    // console.log(probdata);
    const found=await Problem.findOne(probdata);
    // console.log(found);
    if(found){
        // console.log('Problem found!');
        let intodo=false;
        user.todo.forEach((prob,i)=>{
            // console.log(prob);
            // console.log(found._id);
            if(found._id.equals(prob)){
                intodo=true;
            }
        })
        // console.log(found);
        // const intodo=await User.findOne({username:username,todo:{$in:[inmanage.problemId]}});
        // console.log(intodo);
        if(!intodo){
            // console.log("dfsfasd");
            const inmanage=await Manager.findOne({problemId:found._id});
            const curfr=inmanage.frequency;
            await Manager.updateOne({problemId:found._id},{$set:{frequency:(1+curfr)}});
            await user.todo.push(inmanage.problemId);
            await user.save();
        }
    }else{
        const newprob=new Problem(probdata);
        await user.todo.push(newprob);
        await newprob.save();
        const newmanage= new Manager({frequency:1,problemId:newprob._id});
        newmanage.save();
        await user.save();
    }
}

module.exports = {manageHelper};