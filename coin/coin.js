const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector(".shimmer-container");

const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDescription = document.getElementById("coin-description");
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const ctx = document.getElementById("coinChart");

const buttonContainer = document.querySelectorAll(".button-container button");


const options = {
    method: "GET" ,
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key" : "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },

}; 
const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get("id");

const fetchCoinData = async () => {
    try {
        const response = await fetch(
       `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        const coinData = await response.json();
        displayCoinData(coinData);
    }catch(error) {
        console.log("Error while fetching coin data",error);
    }
};

const displayCoinData = (coinData)=>{
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split(".")[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinName.textContent = coinData.name;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocalString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocalString()}`;
};

//chart

const coinChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],//x axis
      datasets: [{
        label: 'Price in (USD)',
        data: [],//y axis
        borderWidth: 1,
        borderColor:"#eebc1d",
        fill:false,
      },
    ],
    },
});
//fetch the chart data from api

const fetchChartData = async(days) => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
            options
        );
        const chartData = await response.json();
    }catch(error){
        console.error("Error while fetching chart data" , error);
    }
};

//to display the chart data

const updateChart = (prices) =>{
//prices=[{timestamp ,price},{timestamp,price}]
//y-axis:data=>price, x axis => labels => timestamp
const data = prices.map((price)=>price[1]);
const labels = prices.map((price)=>{
    let date = new Date(price[0]);
    return data.toLocaleDataString();
});

coinChart.data.labels = labels;
coinChart.data.datasets[0].data = data;
coinChart.update();
};

//on btn click fetch the chart data and display it

buttonContainer.forEach((button)=>{
    button.addEventListener("click" , (event)=>{
        const days =
        event.target.id ==="24hr" ? 1 : event.target.id ==="30d" ? 30:90;
        fetchChartData(days);
    });
});

document.addEventListener("DOMContentLoaded",async()=>{
 await fetchCoinData();
});