import notifier from 'node-notifier';
import fetch from "node-fetch";

let tokens = [
    {
        "wallet" : 32000000,
        "address" : "5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H",
        "name" : "Fronk",
        "hold_value" : 0.00000010,
        "take_profit" : {
            "type" : "percentage",
            "nominal" : 50,
            "check_time" : 5,
            "count_time" : 1
        },
        "cut_lost" : {
            "type" : "percentage",
            "nominal" : 10,
            "check_time" : 5,
            "count_time" : 1
        },
        "decimal" : 8,
    },

    {
        "wallet" : 2400000,
        "address" : "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        "name" : "Bonk",    
        "hold_value" : 0.00000100,
        "take_profit" : {
            "type" : "percentage",
            "nominal" : 50,
            "check_time" : 5,
            "count_time" : 1
        },
        "cut_lost" : {
            "type" : "percentage",
            "nominal" : 10,
            "check_time" : 5,
            "count_time" : 1
        },
        "decimal" : 8,
    },

    {
        "wallet" : 79000000,
        "address" : "o1Mw5Y3n68o8TakZFuGKLZMGjm72qv4JeoZvGiCLEvK",
        "name" : "Cope",
        "hold_value" : 0.000000010000,
        "take_profit" : {
            "type" : "percentage",
            "nominal" : 50,
            "check_time" : 5,
            "count_time" : 1
        },
        "cut_lost" : {
            "type" : "percentage",
            "nominal" : 10,
            "check_time" : 5,
            "count_time" : 1
        },
        "decimal" : 12,
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

        let response = await fetch("https://public-api.birdeye.so/public/multi_price?list_address=" + list_address)

        let data = await response.json();

        // let data = {
        //     data : {
        //         '5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H': {
        //             value: 4.756218149788346e-8,
        //             updateUnixTime: 1673606178,
        //             updateHumanTime: '2023-01-13T10:36:18',
        //             priceChange24h: -13.026235650153472
        //         }
        //     }
        // }

        Object.keys(data.data).forEach(item  => {
            let index = tokens.findIndex(itemToken => itemToken.address === item);

            if(index >= 0){    
                let fixedNumber =  new Number(data.data[item].value).toFixed(tokens[index].decimal);

                if(
                    tokens[index].take_profit && 
                    tokens[index].take_profit.type === 'percentage'
                ){
                    let take_profit = parseFloat(tokens[index].hold_value) *  (parseFloat(tokens[index].take_profit.nominal) / 100);

                    // console.log(new Number(take_profit).toFixed(tokens[index].decimal));

                    take_profit += parseFloat(tokens[index].hold_value);

                    // console.log(new Number(take_profit).toFixed(tokens[index].decimal));

                    if(fixedNumber >= take_profit){                        
                        if(tokens[index].take_profit.count_time >= tokens[index].take_profit.check_time){
                            notifier.notify({
                                title: 'Token ' + tokens[index].name,
                                message: 'Price ' + fixedNumber.toString() +  ' Profit ' + ( parseFloat(fixedNumber) * parseFloat(tokens[index].wallet) ).toString()
                            });
                        }else{                            
                            tokens[index].take_profit.count_time += 1;
                        }
                    }else{
                        tokens[index].take_profit.count_time = 0;
                    }                   
                }


                if(
                    tokens[index].cut_lost && 
                    tokens[index].cut_lost.type === 'percentage'
                ){
                    let cut_lost = parseFloat(tokens[index].hold_value) * (parseFloat(tokens[index].cut_lost.nominal / 100))

                    // console.log(new Number(cut_lost).toFixed(tokens[index].decimal));

                    cut_lost = parseFloat(tokens[index].hold_value) - parseFloat(cut_lost);

                    // console.log(new Number(cut_lost).toFixed(tokens[index].decimal));

                    if(fixedNumber <= cut_lost){                        
                        let modal =  tokens[index].hold_value * parseFloat(tokens[index].wallet);
                        let lost = cut_lost * parseFloat(tokens[index].wallet); 

                        if(tokens[index].cut_lost.count_time >= tokens[index].cut_lost.check_time){
                            notifier.notify({
                                title: 'Token ' + tokens[index].name,
                                message: 'Price ' + fixedNumber.toString() +  ' Lost ' + (modal - lost).toString()
                            });
                        }else{                            
                            tokens[index].cut_lost.count_time += 1;
                        }
                    }else{
                        tokens[index].cut_lost.count_time = 0;
                    }     
                }

                console.log('Token : ' + tokens[index].name + " " + fixedNumber.toString() + " " + new Date());

                // let margin = parseFloat(fixedNumber) / parseFloat(tokens[index].hold_value);

                // if(Math.floor(margin) >= tokens[index].exponand){
                //     notifier.notify({
                //         title: 'Token ' + tokens[index].name,
                //         message: 'Price ' + fixedNumber.toString()
                //     });
                // }else{
                //     console.log('Token : ' + tokens[index].name + " " + fixedNumber.toString() + " " + new Date());
                // }        
            }
        })

        console.log("Done Request");    
    }catch(err){
        console.log(err);
        console.log("Error Request");
    }
},60000);
