const shimmerContainer = document.querySelector(".shimmer-container");
const paginationContainer = document.getElementById("pagination");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");

const searchBox = document.getElementById("search-box");

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

const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};

const saveFavouriteCoins = (favourites)=>{
    localStorage.setItem("favorites" , JSON.stringify(favourites));
};

const handleFavClick = (coinId) => {
    const favourites = fetchFavouriteCoins();
    //if the coinid is already present in favs,then remove it
    if(favourites.includes(coinId)){
        favourites = favourites.filter((id) => id!==coinId);
    }
    favourites.push(coinId);
    saveFavouriteCoins(favourites);
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
};

//sort
const sortCoinsByPrice=(order)=>{
    if(order ==="asc"){
        coins.sort((a,b) =>a.current_price - b.current_price);
    }else if(order ==="desc"){
        coins.sort((a,b)=> b.current_price - a.current_price);
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
    renderPagination(coins);
};

sortPriceAsc.addEventListener("click",()=>{
    sortCoinsByPrice("asc");
});
sortPriceDesc.addEventListener("click",()=>{
    sortCoinsByPrice("desc");
});

const handleSearch = () =>{
    const searchQuery = searchBox.value.trim();
    const filteredCoins = coins.filter((coin)=>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
);
currentPage = 1;
displayCoins(getCoinsToDisplay(filteredCoins,currentPage),currentPage);
renderPagination(filteredCoins);
};
//search

searchBox.addEventListener("input" , handleSearch);

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


const displayCoins = (coins,currentPage) =>{
    const start = (currentPage-1) * itemsPerPage + 1;
    const favourites = fetchFavouriteCoins();

    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = "";
    coins.forEach((coin,index )=> {
        const row = document.createElement("tr");
        const isFavourite = favourites.includes(coin.id);
        console.log(isFavourite);
        row.innerHTML = `
        <td>${start + index}</td> 
        <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"/></td>
        <td>${coin.name}</td> 
        <td>$${coin.current_price.toLocaleString()}</td> 
        <td>$${coin.total_volume.toLocaleString()}</td> 
        <td>$${coin.market_cap.toLocaleString()}</td> 
        <td><i class="fa-solid fa-star favourite-icon"
        ${isFavourite ? "favorite" : ""}"
         data-id="${coin.id}"></i></td> 
        `;
       
        row.addEventListener("click",()=>{
            window.open(`coin/coin.html?id=${coin.id}`,"-blank");
        });
       
        row.querySelector(".favourite-icon").addEventListener("click" , (event) =>{
            event.stopPropagation();
            handleFavClick(coin.id);
        });
        tableBody.appendChild(row);
        
    });
};

const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length /itemsPerPage);
    paginationContainer.innerHTML = "";

    for(let i = 1;i<=totalPage ;i++){
        //create btn of total pages length
        const pageBtn=document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-button");

        if(i===currentPage){
            pageBtn.classList.add("active");
        }

       //allow click over the Btn
       
        pageBtn.addEventListener("click", () =>{
            currentPage = i;
            displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
            
            updatePaginationButtons();
        });
        paginationContainer.appendChild(pageBtn);
    }
} 
const updatePaginationButtons = () =>{
    const pageBtns = document.querySelectorAll(".page-button");
    pageBtns.forEach((button,index) => {
        if(index + 1 === currentPage){
            button.classList.add("active");
        }else{
            button.classList.remove("active");
        }
    });
} 

document.addEventListener("DOMContentLoaded",async()=>{
    try{
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins,currentPage),currentPage);
        renderPagination(coins);
        hideShimmer();  
    }catch(error){
        console.log(error);
        hideShimmer();
    } 
});