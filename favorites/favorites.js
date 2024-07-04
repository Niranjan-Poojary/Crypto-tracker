const shimmerContainer = document.querySelector(".shimmer-container");


const options = {
    method: "GET" ,
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key" : "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },

}; 

const getFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};

const fetchFavouriteCoins = async (coinIds) => {
    try{
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
            ",")}`,
            options
        );
        const coinsData=await response.json();
        return coinsData;
    }catch (error){
        console.error("Error while fetching coin",error);
    }
};
const displayFavoriteCoins = (favCoins) =>{
    const tableBody = document.getElementById("favorite-table-body");
    tableBody.innerHTML = "";
    coins.forEach((coin,index )=> {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${index + 1}</td> 
        <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"/></td>
        <td>${coin.name}</td> 
         <td>$${coin.current_price.toLocaleString()}</td> 
        <td>$${coin.total_volume.toLocaleString()}</td> 
        <td>$${coin.market_cap.toLocaleString()}</td> 
      `;
        tableBody.appendChild(row);

        row.addEventListener("click",()=>{
            window.open(`../coin/coin.html?id=${coin.id}`,"-blank");
        });
    });

};
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};


document.addEventListener("DOMContentLoaded",async()=>{
    try{
        showShimmer();
       const favorites = getFavouriteCoins();
       if(favorites.length >0){
        const favouriteCoins = await fetchFavouriteCoins(favorites);
       }else{
        displayFavoriteCoins([])
       }
        hideShimmer();  
    }catch(error){
        console.log(error);
        hideShimmer();
    } 
});