// useWeather.js
import { useState, useEffect, useCallback } from 'react'
import { BsFillSunFill } from "react-icons/bs";
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY || ''

const CONDITION_EMOJI = {
  Thunderstorm: '⛈️',
  Drizzle:      '🌦️',
  Rain:         '🌧️',
  Snow:         '❄️',
  Clear:        '☀️',
  Clouds:       '☁️',
  Mist:         '🌫️',
  Fog:          '🌫️',
  Haze:         '🌫️',
}

function getEmoji(conditionMain) {
  return CONDITION_EMOJI[conditionMain] || '🌤️'
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

async function fetchCurrentWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`
  )
  if (!response.ok) throw new Error(`City "${city}" not found`)
  const data = await response.json()
  return data
}

async function fetchForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${OPENWEATHER_KEY}`
  )
  if (!response.ok) throw new Error('Weather forecast request failed')
  const data = await response.json()
  return data
}

function formatWeatherData(current, forecast) {
  return {
    city:      current.name,
    country:   current.sys.country,
    temp:      Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0].description,
    emoji:     getEmoji(current.weather[0].main),
    humidity:  current.main.humidity,
    windKph:   Math.round(current.wind.speed * 3.6),
    uvIndex:   'N/A',
    forecast:  forecast.list.map(item => ({
      day:   DAY_NAMES[new Date(item.dt * 1000).getDay()],
      temp:  Math.round(item.main.temp),
      emoji: getEmoji(item.weather[0].main),
    })),
  }
}

export function useWeather(city) {
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading,   setIsLoading]   = useState(true)
  const [errorMsg,    setErrorMsg]     = useState(null)

  const fetchWeather = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg(null)

    if (!OPENWEATHER_KEY) {
      setWeatherData(null)
      setErrorMsg('No API key configured')
      setIsLoading(false)
      return
    }

    try {
      const current  = await fetchCurrentWeather(city)
      const forecast = await fetchForecast(city)
      const formatted = formatWeatherData(current, forecast)
      setWeatherData(formatted)
    } catch (err) {
      setErrorMsg(err.message)
      setWeatherData(null)
    } finally {
      setIsLoading(false)
    }
  }, [city])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  return { weatherData, isLoading, errorMsg, refetch: fetchWeather }
}