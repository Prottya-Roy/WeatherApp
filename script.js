const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const inputText = inputPart.querySelector(".input-text");
const input = inputPart.querySelector("input");
const locationButton = inputPart.querySelector("button");
const weatherPart = wrapper.querySelector(".weather-part");
const weatherIcon = weatherPart.querySelector("img");
const arrowBack = wrapper.querySelector("header i");

let api;

input.addEventListener("keyup", e => {
    if (e.key == "Enter" && input.value != "") {
        requestAPI(input.value);
    }
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Browser does not support geolocation");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;

    api= "https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=25f0b1fe1d7bc22315edcdee566254dd";
    
    fetchData();
}

function onError(error) {
    inputText.innerText = error.message;
    inputText.classList.add("error");
}

function requestAPI(city) {

    api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=25f0b1fe1d7bc22315edcdee566254dd";

    fetchData();
}

function fetchData(){
    inputText.innerText = "Getting weather details...";
    inputText.classList.add("pending");

    fetch(api).then(response=> response.json()).then(result => weatherDetails(result));


    // fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() => {
    //     inputText.innerText = "something went wrong";
    //     inputText.classList.replace("pending", "error");
    // });
}

function weatherDetails(info) {

    console.log(info);
    if (info.cod == "404") {
        inputText.classList.replace("pending", "error");
        inputText.innerText = "${input.value} isn't a valid city name";
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;
        const {speed}= info.wind;

        if(id == 800){
            weatherIcon.src = "./weather-app-icons/Weather Icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            weatherIcon.src = "./weather-app-icons/Weather Icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            weatherIcon.src = "./weather-app-icons/Weather Icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            weatherIcon.src = "./weather-app-icons/Weather Icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            weatherIcon.src = "./weather-app-icons/Weather Icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            weatherIcon.src = "./weather-app-icons/Weather Icons/rain.svg";
        }

        weatherPart.querySelector(".temp .number").innerText= Math.floor(temp/10);
        weatherPart.querySelector(".weather").innerText= description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .number-2").innerText= Math.floor(feels_like/10);
        weatherPart.querySelector(".humidity span").innerText= `${humidity}%`;
        weatherPart.querySelector(".wind span").innerText= speed;

        inputText.classList.remove("pending","error");
        inputText.innerText="";
        input.value="";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click",()=>{
    wrapper.classList.remove("active");
})

