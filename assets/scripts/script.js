window.onload = function () {
    function getWeather(city){
    let url = "https://api.openweathermap.org/data/2.5/forecast?q="
    let appid = "&appid=ca120aa4d95679fffa136b2266aec98a"
    let fullURL = url + city + appid
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + appid,
        method: "GET"
    }).then(function(response){
        console.log(response)
        
    })
    $.ajax({
        url: fullURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        let uv = "http://api.openweathermap.org/data/2.5/uvi?";
        let cor = "lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon;
        let uvURL = uv + cor + appid;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            
        })
        
    })};
    getWeather("tucson");

}