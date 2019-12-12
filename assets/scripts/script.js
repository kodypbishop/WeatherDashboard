window.onload = function () {
    function getWeather(city) {
        $("#current").html("");
        $("#forecast").html("");
        let url = "https://api.openweathermap.org/data/2.5/forecast?q="
        let appid = "&appid=ca120aa4d95679fffa136b2266aec98a"
        let fullURL = url + city + appid
        // ajax call for current weather
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + appid,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let card = $("<div>").attr("class", "card col-12");
            let cardBody = $("<div>").attr("class", "card-body currentWeather");
            let cityDate = $("<h2>").text(response.name + " (" + moment().format("L") + ")");
            let currentImg = $("<img>");
            currentImg.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            cityDate.append(currentImg);
            let temp = $("<p>").text("Tempature: " + fahrenheit(response.main.temp).toFixed(1) + " " + String.fromCharCode(176) + "F");
            let humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
            let wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
            cardBody.append(cityDate, temp, humid, wind)
            card.append(cardBody)
            $("#current").append(card)


        })
        // ajax call for 5 day forecast
        $.ajax({
            url: fullURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            // creating an object to with the highs ,lows ,humidity and icons for each day of the 5 day forecast
            let forecasts = response.list
            let fiveDay = [];
            let day;

            for (let i = 0; i < forecasts.length; i++) {
                if ((new Date(forecasts[i].dt * 1000)).toLocaleString().includes(day)) {
                    fiveDay[fiveDay.length - 1].clouds.push(forecasts[i].clouds.all);
                    fiveDay[fiveDay.length - 1].icon.push(forecasts[i].weather[0].icon);
                    fiveDay[fiveDay.length - 1].humidity.push(forecasts[i].main.humidity);
                    fiveDay[fiveDay.length - 1].highTemp.push(forecasts[i].main.temp_max);
                    fiveDay[fiveDay.length - 1].lowTemp.push(forecasts[i].main.temp_min);
                } else {

                    day = (new Date(forecasts[i].dt * 1000)).toLocaleString().slice(0, 10);
                    let obj = {
                        day: day,
                        "clouds": [forecasts[i].clouds.all],
                        "icon": [forecasts[i].weather[0].icon],
                        "humidity": [forecasts[i].main.humidity],
                        "highTemp": [forecasts[i].main.temp_max],
                        "lowTemp": [forecasts[i].main.temp_min],

                    }
                    fiveDay.push(obj);
                }

            }
            // using 5 day forecast object to create html elements 
            for (let i = 0; i < 5; i++) {
                let chosenIcon = Math.ceil(fiveDay[i].icon.length / 2) - 1;
                let card = $("<div>").attr("class", "card col-lg-2 p-1 card text-white bg-primary")
                let cardBody = $("<div>").attr("class", "card-body p-0 text-center")
                let date = $("<h5>").text(fiveDay[i].day);
                date.attr("class", "card-title")
                let icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + fiveDay[i].icon[chosenIcon] + ".png");
                let high = $("<div>").text("High: " + fahrenheit(Math.max(...fiveDay[i].highTemp)).toFixed(1) + " " + String.fromCharCode(176) + "F");
                let low = $("<div>").text("Low: " + fahrenheit(Math.min(...fiveDay[i].lowTemp)).toFixed(1) + String.fromCharCode(176) + " " + "F");
                let humidity = $("<div>").text("Humidity: " + (fiveDay[i].humidity.reduce((a, b) => a + b, 0) / fiveDay[i].humidity.length).toFixed(0) + "%");
                cardBody.append(date, icon, high, low, humidity);
                card.append(cardBody)
                $("#forecast").append(card);
            }

            let uv = "http://api.openweathermap.org/data/2.5/uvi?";
            let cor = "lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon;
            let uvURL = uv + cor + appid;
            // ajax call for current uv index
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {
                let index = $("<mark>").text(response.value)
                index.attr("class", indexColor(response.value))
                let UV = $("<div>").text("UV Index: ")
                UV.append(index)
                $(".currentWeather").append(UV)

            })

        })
    };
    function fahrenheit(temp) {
        temp = temp * 9 / 5;
        temp -= 459.67
        return temp;
    };
    function indexColor(i) {
        let indexClass = ""
        if (i < 4) {
            indexClass = "badge badge-success"
        } else if (i < 8) {
            indexClass = "badge badge-warning"
        } else {
            indexClass = "badge badge-danger"
        }
        return indexClass
    }
    if (JSON.parse(localStorage.getItem("searches")) == undefined) {
        localStorage.setItem("searches", JSON.stringify([]));
    }
    else {
        let storage = JSON.parse(localStorage.getItem("searches"));
        for (let i = 0; i < storage.length; i++) {
            let newList = $("<li>").text(storage[i]);
            newList.attr("class", "list-group-item");
            $("#citiesList").append(newList);
        }
        getWeather(storage[0]);
    }
    console.log(localStorage.length)
    $("li").on("click", function () {
        getWeather($(this).text());
    })
    $("#search").on("click", function (event) {
        event.preventDefault();
        let searchVal = $("#citySearch").val();
        let newList = $("<li>").text(searchVal);
        newList.attr("class", "list-group-item");
        let storage = JSON.parse(localStorage.getItem("searches"));
        if (storage.includes(searchVal)) {
            getWeather(searchVal);
        } else {
            storage.unshift(searchVal);
            localStorage.setItem("searches", JSON.stringify(storage));
            $("#citiesList").prepend(newList);
            getWeather(searchVal);
        }
    })
}