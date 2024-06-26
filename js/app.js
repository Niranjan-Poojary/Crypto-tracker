const options = {
    method: "GET" ,
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key" : "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },

};
 let coins = [];
//fetching the data from api
const fetchCoins = async () => {
    try{
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1" ,
            options
        );
        const coinsData=await response.json();
        return coinsData;
    }catch (error){
        console.error("Error while fetching app",error);
    }
};

//display the data on the page


const display = (coins) =>{
    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = "";
    coins.forEach(coin,index => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td></td> 
        <td><img src="https://assets.coingecko.com/coins/images/1/bitcoin.png?1547033579" alt="bitcoin" width="24" height="24"/></td>
        <td>Bitcoin</td> 
        <td>$ 45,000</td> 
        <td>1,000,000</td> 
        <td>$1,000,000,000</td> 
        <td><i class="fa-solid fa-star">,</i></td> 
        `;
        tableBody.appendChild(row);
        
    });
}

document.addEventListener("DOMContentLoaded",async()=>{
    coins = await fetchCoins();
})