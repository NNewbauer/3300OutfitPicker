import React, { useEffect } from 'react'
import clear_icon from '../assets/clear.png'
import humidity_icon from '../assets/humidity.png'
import search_icon from '../assets/search.png'
import wind_icon from '../assets/wind.png'
import './Weather.css'

const Weather = () => {

    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
            
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching weather data: ', error);
        }
    }

    useEffect(() => {
        search('')
    }, [])

    return (
        <div className="weather">
            <div className='search-bar'>
                <input type='text' placeholder='search'/>
                <img src={search_icon} alt='search'/>
            </div>
        <img src={clear_icon} alt="" className='weather-icon'/>
        <p className='temperature'>51°F</p>
        <p className='location'>St. Louis</p>
        <div className="weather-data">
            <div className='col'>
                <img src={humidity_icon} alt="" />
                <div>
                    <p>91%</p>
                    <p>Humidity</p>
                </div>
            </div>
            <div className='col'>
                <img src={wind_icon} alt="" />
                <div>
                    <p>3.6 Km/h</p>
                    <p>Wind Speed</p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Weather