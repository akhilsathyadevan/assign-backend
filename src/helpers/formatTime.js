const moment = require('moment');
exports.formattedStartDate = async(startDate)=>{
 return moment().format('YYYY-MM-DD hh:mm A')
}