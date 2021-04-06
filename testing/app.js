const axios = require('axios');
const assert = require('chai').assert;
//let url = 'https://r1mse841y7.execute-api.us-east-1.amazonaws.com/dev/searchHotel?checkin=2020-04-15&&checkout=2020-04-18&&guests=1&&location=SanJose'
/*let res = async function getUser(url){
    const response = await axios.get(url);
    console.log('getuser',response);
}*/
module.exports = {
    
    search: function(res){
        
        console.log(res)
        return res
    },

    book: function(res){
        return res
    },

    cancel: function(res){
        return res
    }

}


