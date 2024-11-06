async function getWeatherData(coords) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current=temperature_2m,is_day,rain,cloud_cover,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`;


    let resp = await axios.get(url);
    let data = resp.data;
    console.log(data);

    let is_day = data.current.is_day;

    if (is_day === 0) {
        $("body").css("background-image", "url('bg2.jpg')")
        let imgWeather = "";
        if (data.current.rain > 0) {
            imgWeather = "rain-cloud.png"
        }
        else if (data.current.cloud_cover != 0) {
            imgWeather = "cloudy-night.png"
        } else {
            imgWeather = "moon1.png"
        }

        $(".img_weather").html(`<img width="150px" src="${imgWeather}" alt="">`);

    } else {
        $("body").css("background-image", "url('bg1.jpg')")
        let imgWeather = "";
        if (data.current.rain > 0) {
            imgWeather = "rain-cloud.png"
        }
        else if (data.current.cloud_cover != 0) {
            imgWeather = "cloudy.png"
        } else {
            imgWeather = "sun2.png"
        }

        $(".img_weather").html(`<img width="150px" src="${imgWeather}" alt="">`);
    }

    let temperature = data.current.temperature_2m;

    $(".temperature").text(`${temperature} °C`);
    $(".description").text(
        data.current.rain > 0 ? "Rainy" :
            data.current.cloud_cover === 0 ? "Clear" : "Cloudy"
    );



    let cityName = $("#cities option:selected").text();
    $(".city_name").text(cityName);
    $(".date").text(new Date().toLocaleDateString());


    $(".week_weather .days").each((index, element) => {
        let day = new Date(data.daily.time[index]).toLocaleString('en', { weekday: 'long' });
        let maxTemp = data.daily.temperature_2m_max[index];
        let minTemp = data.daily.temperature_2m_min[index];
        let rainSum = data.daily.rain_sum[index];

        let iconSrc = "";
        if (rainSum > 0) {
            iconSrc = "rain-cloud.png"
        }
        else if (maxTemp < 20) {
            iconSrc = "cloudy.png"
        }
        else {
            iconSrc = "sun2.png"
        }

        $(element).find(".day").text(day);
        $(element).find(".day_img").html(`<img width="50px" src="${iconSrc}" alt="">`);
        $(element).find(".day_temp").text(`${maxTemp}°C / ${minTemp}°C`);

    });
}

$("#cities").on("change", async function () {
    let coords = $(this).val().split(",");
    getWeatherData(coords);
});


// $("#my_position").on("click", function() {
//     navigator.geolocation.getCurrentPosition((position) => {
//         getWeatherData([position.coords.latitude, position.coords.longitude]);
//     });
// });
