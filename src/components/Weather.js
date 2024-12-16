import React, {useEffect, useState} from 'react'
import clear_icon from '../assets/clear.png'
import humidity_icon from '../assets/humidity.png'
import search_icon from '../assets/search.png'
import wind_icon from '../assets/wind.png'
import './Weather.css'

const API_KEY = '95256c102297fc10c26b6bf4ed2e636a'

const Weather = () => {
    const [temp, setTemp] = useState('');
    const [windSpeed, setWindSpeed] = useState('');
    const [humidity, setHumidity] = useState('');
    const [city, setCity] = useState('St. Louis');
    const [citySearch, setCitySearch] = useState('St. Louis');

    const search = async () => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            setCity(citySearch);
            setTemp(data.main.temp);
            setHumidity(data.main.humidity);
            setWindSpeed(data.wind.speed);
            console.log(data);
        } catch (error) {
            console.error('Error fetching weather data: ', error);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(); // Trigger the search function when "Enter" is pressed
        }
    };

    useEffect(() => {
        search()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="weather">
            <div className='search-bar'>
                <input type='text' placeholder='search' value={citySearch} onChange={(e) => setCitySearch(e.target.value)}
                onKeyDown={handleKeyDown}
                />
                <img src={search_icon} alt='search' onClick={search} />
            </div>
        <img src={clear_icon} alt="" className='weather-icon'/>
        <p className='temperature'>{temp}°F</p>
        <p className='location'>{city}</p>
        <div className="weather-data">
            <div className='col'>
                <img src={humidity_icon} alt="" />
                <div>
                    <p>{humidity}%</p>
                    <p>Humidity</p>
                </div>
            </div>
            <div className='col'>
                <img src={wind_icon} alt="" />
                <div>
                    <p>{windSpeed} mph</p>
                    <p>Wind Speed</p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Weather