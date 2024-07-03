const shimmerContainer = document.querySelector(".shimmer-container");


const options = {
    method: "GET" ,
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key" : "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },

}; 
 let coins = [];
 let itemsPerPage = 15;
 let currentPage = 1;
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
        console.error("Error while fetching coin",error);
    }
};
const handleFavClick = (coinId) => {};

const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};

const getCoinsToDisplay = (coins,page) => {
    const start = (page-1) * itemsPerPage;
    const end = start + itemsPerPage;
    return coins.slice(start, end);
};
//display the data on the page


const displayCoins = (coins) =>{
    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = "";
    coins.forEach((coin,index )=> {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${index}</td> 
        <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"/></td>
        <td>$${coin.name}</td> 
        <td>$${coin.current_price}</td> 
        <td>$${coin.total_volume}</td> 
        <td>$${coin.market_cap}</td> 
        <td><i class="fa-solid fa-star favourite-icon" data-id="${coin.id}></i></td> 
        `;
        tableBody.appendChild(row);
        
    });
}

document.addEventListener("DOMContentLoaded",async()=>{
    try{
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins,currentPage));
        hideShimmer();  
    }catch(error){
        console.log(error);
        hideShimmer();
    } 
});