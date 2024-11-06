async function getWeatherData(coords) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    
    try {
        let resp = await axios.get(url);
        let data = resp.data;
        console.log(data);

        let temperature = data.current_weather.temperature;
        
        $(".temperature").text(`${temperature} °C`);
        $(".description").text(data.current_weather.weathercode === 0 ? "Clear" : "Cloudy");

        let imgWeather = "";
        if(temperature>25){
            imgWeather = "sun2.png"
        }
        else{
            imgWeather = "cloudy.png"
        }
        $(".img_weather").html(`<img width="150px" src="${imgWeather}" alt="">`);

        let cityName = $("#cities option:selected").text();
        $(".city_name").text(cityName);
        $(".date").text(new Date().toLocaleDateString());

    
        $(".week_weather .days").each((index, element) => {
            let day = new Date(data.daily.time[index]).toLocaleString('en', { weekday: 'long' });
            let maxTemp = data.daily.temperature_2m_max[index];
            let minTemp = data.daily.temperature_2m_min[index];

            let iconSrc = "";
            if(maxTemp<25 && minTemp<15){
                iconSrc = "cloudy.png"
            }
            else{
                iconSrc = "sun2.png"
            }

            $(element).find(".day").text(day);
            $(element).find(".day_temp").text(`${maxTemp}°C / ${minTemp}°C`);
            $(element).find(".day_img").html(`<img width="50px" src="${iconSrc}" alt="">`);
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

$("#cities").on("change", async function() {
    let coords = $(this).val().split(",");
    getWeatherData(coords);
});


// $("#my_position").on("click", function() {
//     navigator.geolocation.getCurrentPosition((position) => {
//         getWeatherData([position.coords.latitude, position.coords.longitude]);
//     });
// });
