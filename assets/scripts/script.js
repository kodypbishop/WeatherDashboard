window.onload = function () {
    function getWeather(city) {
        let url = "https://api.openweathermap.org/data/2.5/forecast?q="
        let appid = "&appid=ca120aa4d95679fffa136b2266aec98a"
        let fullURL = url + city + appid
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + appid,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            let cityDate = $("<div>").text(response.name + " (" + moment().format("L") + ")")
            let currentImg = $("<img>")
            currentImg.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon +"@2x.png")
            cityDate.append(currentImg)
            let temp = $("<div>").text("Tempature:" + fahrenheit(response.main.temp).toFixed(1) + String.fromCharCode(176) + "F")
            let humid = $("<div>").text("Humidity:" + response.main.humidity + "%")
            let wind = $("<div>").text("Wind:" + response.wind.speed + "MPH")
            $("#current").append(cityDate, temp, humid, wind)

        })
        $.ajax({
            url: fullURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            let forecasts = response.list
            let fiveDay = [];
            let day;
            for (let i = 0; i < forecasts.length; i++) {
                if (forecasts[i].dt_txt.includes(day)) {
                    fiveDay[fiveDay.length - 1].clouds.push(forecasts[i].clouds.all);
                    fiveDay[fiveDay.length - 1].icon.push(forecasts[i].weather[0].icon);
                    fiveDay[fiveDay.length - 1].humidity.push(forecasts[i].main.humidity);
                    fiveDay[fiveDay.length - 1].highTemp.push(forecasts[i].main.temp_max);
                    fiveDay[fiveDay.length - 1].lowTemp.push(forecasts[i].main.temp_min);
                    console.log(day)
                } else {
                    day = forecasts[i].dt_txt.slice(0, 10);
                    let obj = {
                        day: day,
                        "clouds": [forecasts[i].clouds.all],
                        "icon":[forecasts[i].weather[0].icon],
                        "humidity": [forecasts[i].main.humidity],
                        "highTemp": [forecasts[i].main.temp_max],
                        "lowTemp": [forecasts[i].main.temp_min],

                    }
                    fiveDay.push(obj);
                    console.log(fiveDay)
                }

            }

            for (let i = 0; i< 5; i++) {
                let card = $("<div>")
                let date = $("<div>").text(fiveDay[i].day);
                let icon = $("<img>").attr("src","http://openweathermap.org/img/wn/" +fiveDay[i].icon[5]+"@2x.png");
                let high = $("<div>").text("High Tempature:" + fahrenheit(Math.max(...fiveDay[i].highTemp)).toFixed(1) + String.fromCharCode(176) + "F");
                let low = $("<div>").text("Low Tempature:" + fahrenheit(Math.min(...fiveDay[i].lowTemp)).toFixed(1) + String.fromCharCode(176) + "F");
                let humidity = $("<div>").text("Humidity:" +(fiveDay[i].humidity.reduce((a,b) => a + b, 0) /fiveDay[i].humidity.length).toFixed(0)+ "%");
                card.append(date, icon, high, low, humidity);
                $("#forecast").append(card);
            }

            let uv = "http://api.openweathermap.org/data/2.5/uvi?";
            let cor = "lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon;
            let uvURL = uv + cor + appid;
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {
                console.log(response)
                let UV = $("<div>").text("UV Index:" + response.value)
                $("#current").append(UV)

            })

        })
    };
    function fahrenheit(temp) {
        temp = temp * 9 / 5;
        temp -= 459.67
        return temp;
    };
    getWeather("tucson");

}