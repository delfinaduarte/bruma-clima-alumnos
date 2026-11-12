// Consultas a Open-Meteo: no requiere claves y funciona en GitHub Pages.
// Este archivo transforma los datos para que app.js pueda mostrarlos.
async function consultarClima(ciudad) {
    let lugar;
    const partes = ciudad.split(',');
    if (partes.length === 2 && partes[0].trim() !== '' && partes[1].trim() !== '' && !isNaN(Number(partes[0])) && !isNaN(Number(partes[1]))) {
        lugar = { latitude: Number(partes[0]), longitude: Number(partes[1]), name: 'Tu ubicación', admin1: '', country: '' };
    } else {
        let url = 'https://geocoding-api.open-meteo.com/v1/search?count=10&language=es&name=' + encodeURIComponent(partes[0].trim());
        if (ciudad.toLowerCase().includes('argentina')) {
            url = url + '&countryCode=AR';
        }
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error('No pudimos buscar la ciudad. Intentá nuevamente.');
        }
        const busqueda = await respuesta.json();
        if (!busqueda.results || busqueda.results.length === 0) {
            throw new Error('No encontramos esa ciudad. Probá con otra ubicación.');
        }
        lugar = busqueda.results[0];
        if (partes.length > 2) {
            for (let i = 0; i < busqueda.results.length; i++) {
                if (busqueda.results[i].admin1 === partes[1].trim()) {
                    lugar = busqueda.results[i];
                }
            }
        }
    }

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lugar.latitude + '&longitude=' + lugar.longitude + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=3';
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error('No pudimos consultar el clima. Intentá nuevamente.');
    }
    const clima = await respuesta.json();
    const dias = [];
    for (let i = 0; i < clima.daily.time.length; i++) {
        const horas = [];
        for (let j = i * 24; j < (i + 1) * 24; j++) {
            horas.push({ temp_c: clima.hourly.temperature_2m[j] });
        }
        dias.push({
            date: clima.daily.time[i],
            day: {
                maxtemp_c: clima.daily.temperature_2m_max[i],
                mintemp_c: clima.daily.temperature_2m_min[i],
                daily_chance_of_rain: clima.daily.precipitation_probability_max[i],
                condition: describirClima(clima.daily.weather_code[i])
            },
            astro: { sunrise: clima.daily.sunrise[i].split('T')[1] },
            hour: horas
        });
    }
    return {
        location: {
            name: lugar.name,
            region: lugar.admin1 || '',
            country: lugar.country || '',
            localtime: clima.current.time.replace('T', ' ')
        },
        current: {
            temp_c: clima.current.temperature_2m,
            feelslike_c: clima.current.apparent_temperature,
            humidity: clima.current.relative_humidity_2m,
            wind_kph: clima.current.wind_speed_10m,
            uv: clima.daily.uv_index_max[0],
            condition: describirClima(clima.current.weather_code),
            last_updated: clima.current.time.replace('T', ' ')
        },
        forecast: { forecastday: dias }
    };
}

function describirClima(codigo) {
    let texto = 'Despejado';
    let simbolo = '☀️';
    if (codigo >= 1 && codigo <= 3) {
        texto = 'Parcialmente nublado';
        simbolo = '⛅';
    } else if (codigo === 45 || codigo === 48) {
        texto = 'Niebla';
        simbolo = '🌫️';
    } else if (codigo >= 51 && codigo <= 67) {
        texto = 'Lluvia';
        simbolo = '🌧️';
    } else if (codigo >= 71 && codigo <= 77) {
        texto = 'Nieve';
        simbolo = '🌨️';
    } else if (codigo >= 80 && codigo <= 82) {
        texto = 'Chaparrones';
        simbolo = '🌧️';
    } else if (codigo === 85 || codigo === 86) {
        texto = 'Chaparrones de nieve';
        simbolo = '🌨️';
    } else if (codigo >= 95) {
        texto = 'Tormenta';
        simbolo = '⛈️';
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="4" y="49" font-size="48">' + simbolo + '</text></svg>';
    return { text: texto, icon: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) };
}
