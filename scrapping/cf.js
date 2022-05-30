const axios = require('axios');
const {load} = require('cheerio');
const ExpressError = require('../utils/ExpressError.js');

async function getData(handle,rownumber=2) {
	try {
        let userData={};
		const url=`https://codeforces.com/submissions/${handle}`;
        const outp=await axios.get(url)
                    .then((response) => {
                        if(response.status === 200) {
                            const html = response.data;
                            const $ =load(html); 
                            // console.log(Object.keys($('.status-frame-datatable')['0'].children['1'].children['2'].children['']));
                            // console.log($('.status-frame-datatable')['0'].children['1'].children['2'].children['2']);
                            let row=$('.status-frame-datatable')['0'].children['1'].children[`${rownumber}`];
                            // console.log(Object.keys(row));
                            // console.log(row.name);
                            if (row.name === "tr") {
                                // console.log("************************");
                                if(row.children['7']){
                                    let cur=row.children[`${7}`];
                                    // "/n"column""/n"column"\n"column......."\n"column format
                                    if(cur.name === "td"){
                                        // console.log('#################################################');
                                        // console.log(row.children['5'].children['0'].next.children['0'].parent.attribs.href.substring(9));
                                        userData.handle = row.children['5'].children['0'].next.children['0'].parent.attribs.href.substring(9);
                                        // console.log(cur.children['1'].attribs['href']);
                                        userData.problemId= cur.children['1'].attribs['href'];
                                        // console.log(cur.children['1'].children['0'].data.trim());
                                        userData.problemName = cur.children['1'].children['0'].data.trim()
                                        // console.log(row.children['11'].children['0'].next.attribs.submissionverdict);
                                        userData.problemStatus = row.children['11'].children['0'].next.attribs.submissionverdict;
                                        // console.log('#################################################');
                                    }
                                }else{
                                    // throw new ExpressError('Cannot follow the user as they have no submissions');                                    // req.flash('error','');
                                }
                            }      
                            // console.log(userData);
                            //  return userData;
                        }
                    }, (error) => console.log(error));
        return userData;
	} catch (error) {
		console.error(error)
	}
}

// const dat=async (handle)=>{
//     await getData(handle);
// }
// // dat('NitheeshKumarChapala');
// dat('dsf');
module.exports= {getData};