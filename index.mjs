import notifier from 'node-notifier';
import fetch from "node-fetch";

let tokens = [
    {
        "address" : "5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H",
        "name" : "Fronk",
        "hold_value" : 0.00000010,
        "exponand" : 2,
        "decimal" : 8,
        "last_price" : [],
        "wallet" : 4000000
    },
    {
        "address" : "LUSHqQZX8DxXjGUrEp9Nh3U6ym7U45srgqrQHrE4NX2",
        "name" : "Lush",
        "hold_value" : 0.000000003317,
        "exponand" : 2,
        "decimal" : 12,
        "last_price" : [],
        "wallet" : 100000000 
    }
];

setInterval(async () => {
    try{
        console.log("Request To Birdeye");

        let list_address = tokens.reduce((itemPrev,itemNext) => {
            if(tokens[tokens.length-1].name === itemNext.name){
                return itemPrev + "" + itemNext.address;
            }else{
                return itemPrev + "" + itemNext.address + ",";
            }
        },"")

        let response = await fetch("https://public-api.birdeye.so/public/multi_price?list_address="+list_address)
        let data = await response.json();

        Object.keys(data.data).forEach(item  => {
            let index = tokens.findIndex(itemToken => itemToken.address === item);

            if(index >= 0){                
                let fixedNumber =  new Number(data.data[item].value).toFixed(tokens[index].decimal);
    
                let margin = parseFloat(fixedNumber) / parseFloat(tokens[index].hold_value);

                if(Math.floor(margin) >= tokens[index].exponand){
                    notifier.notify({
                        title: 'Token ' + tokens[index].name,
                        message: 'Price ' + fixedNumber.toString()
                    });
                }else{
                    console.log('Token : ' + tokens[index].name + " " + fixedNumber.toString() + " " + new Date());
                }        
            }
        })

        console.log("Done Request");    
    }catch(err){
        console.log(err);
        console.log("Error Requests");
    }
},60000);
