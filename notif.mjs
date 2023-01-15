import notifier from 'node-notifier';
import fetch from "node-fetch";

/*
    BEST SEKENARIO : 
    10 dollar dibagi 10 coin 
    artinya jika mulus maka 10 kali saja sudah cukup
*/
let tokens = [
    {
        "address" : "5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H",
        "name" : "Fronk",          
        "decimal" : 12,
        "wallet" : 22000000,
        "hold_usd" : 1
    },

    {    
        "address" : "o1Mw5Y3n68o8TakZFuGKLZMGjm72qv4JeoZvGiCLEvK",
        "name" : "Cope",          
        "decimal" : 12,
        "wallet" : 140000000,
        "hold_usd" : 1
    },     


    {    
        "address" : "G7ShEqeEmPogtqEWs8CLG2t6dj1vo6geDzokpckEg7Fj",
        "name" : "Bumpp",          
        "decimal" : 10,
        "wallet" : 2000000,
        "hold_usd" : 1
    },  

     
    {    
        "address" : "GPyzPHuFFGvN4yWWixt6TYUtDG49gfMdFFi2iniTmCkh",
        "name" : "Chili",          
        "decimal" : 12,
        "wallet" : 24000000,
        "hold_usd" : 1
    },

    // {
    //     "address" : "EVwSh47k8GEuVGbVohtTe1dhAaxoUoyV53m5Qi6APu3F",
    //     "name" : "Magic",          
    //     "decimal" : 10,
    //     "wallet" : 24000000,
    //     "hold_usd" : 1
    // }

    // {
    //     "address" : "Doggoyb1uHFJGFdHhJf8FKEBUMv58qo98CisWgeD7Ftk",
    //     "name" : "Doggo",          
    //     "decimal" : 12,
    //     "wallet" : 8000000,
    //     "hold_usd" : 1
    // },

  

    // {    
    //     "address" : "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    //     "name" : "Bonk",          
    //     "decimal" : 10,
    //     "wallet" : 4000000,
    //     "hold_usd" : 1
    // },
];

setInterval(async () => {
    try{    
        console.log("Request");

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
        //         'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
        //             value: 5000e-10,
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
            
                let money_now = ( parseFloat(fixedNumber) * parseFloat(tokens[index].wallet) ).toFixed(2) 

                let profit = 0;
                let lose = 0;

                if(money_now > tokens[index].hold_usd){    
                    profit = (parseFloat(money_now) - parseFloat(tokens[index].hold_usd)).toFixed(2);
                }   
                
                if(money_now < tokens[index].hold_usd){                
                    lose = (parseFloat(tokens[index].hold_usd) - parseFloat(money_now)).toFixed(2);
                }            

                if(profit >= 1.10 || lose >= 0.50){
                    notifier.notify({
                        title: 'Token : ' + tokens[index].name,
                        message: 'Price : ' + fixedNumber.toString() + '\nProfit : ' + profit.toString() + '\nLost : ' + lose.toString() + "\nMoney : " + money_now,
                        time: 30000,
                    });
                }
            }
        })
    }catch(err){
        console.log(err);
        console.log("Error Request");
    }
},120000);
