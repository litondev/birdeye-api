import puppeteer from 'puppeteer';

// setInterval(async () => {
    const browser = await puppeteer.launch({
        headless : false,
        args: ['--disable-dev-shm-usage']
    });

    let page = await browser.newPage();
    await page.goto("https://birdeye.so",{
        waitUntil: 'domcontentloaded',
        timeout: 0
    });                   

    await page.waitForSelector("div[class='sc-iUKqMP bVmqz']", {
        visible: true,
        timeout: 0
    });

    console.log(await page.$$("div[class='sc-iUKqMP bVmqz']"));

    // await page.waitForTimeout(240000)


    // let url = [
    //     [
    //         "https://www.youtube.com/watch?v=pZ1UTRE_jmA",
    //         "https://www.youtube.com/watch?v=i2mF9DsjOZI",
    //         "https://www.youtube.com/watch?v=jJyD6Md6Dfs",
    //     ],
    //     [
    //         "https://www.youtube.com/watch?v=tVDtj0hD7Ms",
    //         "https://www.youtube.com/watch?v=LurlNwa-uJo",
    //         "https://www.youtube.com/watch?v=WuKolk-p3nQ",
    //     ],
    //     [
    //         "https://www.youtube.com/watch?v=TxICB8YGJmU",
    //         "https://www.youtube.com/watch?v=NNWEqMXnP68",
    //         "https://www.youtube.com/watch?v=8NRc6RuFtaw&t=41s"
    //     ]    
    // ];

    // for(let i=0;i<url.length;i++){                              
    //     for(let ri=0;ri<url[i].length;ri++){              
    //         try{      
    //             let page = await browser.newPage();
    //             await page.goto(url[i][ri]);                   
                
    //             await page.waitForSelector("button[aria-label='Play (k)']", {
    //                 visible: true,
    //             });

    //             await page.click("button[aria-label='Play (k)']");

    //             await page.waitForTimeout(240000)
            
    //             await page.bringToFront();

    //             await page.close() 
    //             console.log("Done "+ri);            
    //         }catch(e){
    //             console.log("Failed")
    //         }  
    //     }        

    //     console.log(" ");
    // }


    // await browser.close();
// },60000);
