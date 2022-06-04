const axios = require('axios');
const {load} = require('cheerio');
const ExpressError = require('../utils/ExpressError.js');

// const url=`https://codeforces.com/submissions/${handle}`;
const getData= async(handle,start=1,count=1)=>{
    let userData={};
    const submissionsUrl= `https://codeforces.com/api/user.status?handle=${handle}&from=${start}&count=${count}`;
    const outp=await axios.get(submissionsUrl)
    .then((response) => {
            if(response.status === 200) {
                // console.log(response.data.result['0']);
                const contestId = response.data.result['0'].contestId;
                const problem = response.data.result['0'].problem;
                const problemUrl= `/contest/${contestId}/problem/${problem.index}`;
                userData.handle = handle.trim();
                // // console.log(cur.children['1'].attribs['href']);
                userData.problemId= problemUrl;
                // // console.log(cur.children['1'].children['0'].data.trim());
                userData.problemName = `${problem.index} - `+problem.name.trim();
                // // console.log(row.children['11'].children['0'].next.attribs.submissionverdict);
                userData.problemStatus = response.data.result['0'].verdict.trim();
            }
        }, (error) => {});
    return userData;
    // consol.log(outp);
}


module.exports = {getData};
