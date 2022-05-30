// import User from '../models/user.js';
const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const Manager = require('../models/problemmanager.js');
const {getData} = require('../scrapping/cf.js');
const {updateSingle} = require('../utils/todohelper.js');
const {checkUser} = require('../utils/usercheck.js');
const catchAsync = require('../utils/catchAsync.js');
const {manageHelper} = require('../utils/managehelper.js');
const{deleteAll,deleteSingle} = require('../utils/binhelper.js');


module.exports.showTodo = async (req,res)=>{
    const {username}=req.params;
    const user= (await User.findOne({username:username}).populate({path:'todo'}));
    res.render('userinfo/todolist',{user});
};
module.exports.deleteTodo = async (req,res)=>{
    const {username,probid}=req.params;
    const user= await User.findOne({username:username});
    await User.findByIdAndUpdate(user._id,{$pull:{todo: probid}});
    await user.recentdeleted.push(probid);
    await user.save();
    res.redirect(`/${username}/todo`);
};

module.exports.recentDeleted = async (req,res)=>{
    const {username}=req.params;
    const user= (await User.findOne({username:username}).populate({path:'recentdeleted'}));
    // console.log(user);
    res.render('userinfo/recentdeleted',{user});
};

module.exports.deleteBin = async (req,res)=>{
    const {username}=req.params;
    // console.log(username);
    await deleteAll(username);
    res.redirect(`/${username}/recent`);
};
module.exports.deleteOne = async (req,res)=>{
    const {username}=req.params;
    const{probid}= req.body;
    await deleteSingle(probid,username);
    res.redirect(`/${username}/recent`);
};

module.exports.updateTodo = async (req,res)=>{
    const {username}=req.params;
    await updateSingle(username);
    res.redirect(`/${username}/todo`);
};

module.exports.renderFollowing = async (req,res)=>{
    const {username}=req.params;
    const user= await User.findOne({username:username});
    res.render('userinfo/following',{user});
};

module.exports.addFollow = async (req,res)=>{
    let {username}=req.params;
    let {friendHandle}= req.body;
    username=username.trim();
    friendHandle=friendHandle.trim();
    const check=await checkUser(friendHandle);
    // console.log(check);
    if(check){
        const data=await getData(friendHandle);
        if(Object.keys(data).length){
            const user= await User.findOne({username:username});
            let checkuserfollow=true;
            user.following.forEach((friend,i)=>{
                if(friend.name === friendHandle){
                    checkuserfollow=false;
                }
            })
            if(checkuserfollow){
                await manageHelper(data,username);
                await user.following.push({name:friendHandle,last:data.problemId});
                await user.save();
            }else{
                req.flash('error', "You are following this Handle already");
            }
        }else{
            req.flash('error','Cannot follow the handle as they have no submissions!');
        }
    }else{
        if(friendHandle.length){
            req.flash('error','Handle Not found');
        }else{
            req.flash('error','Handle cannot be empty');
        }
    }
    res.redirect(`/${username}/following`);
}
module.exports.unFollow = async (req,res)=>{
    let {username}=req.params;
    let {friendHandle}= req.body;
    friendHandle=friendHandle.trim();
    username=username.trim();
    await User.updateOne({username:username},{$pull:{following: {name:friendHandle}}});
    // const user=await User.find({username:username});
    res.redirect(`/${username}/following`);
}
