// WeatherWidget.jsx
// Displays live weather for the user's city pulled from useWeather()
// Shows: city name, temperature, condition, humidity, wind, UV, 5-day forecast row
// The hottest day in the forecast is automatically highlighted

import { useAppContext } from '../context/AppContext'
import { useWeather }    from '../hooks/useWeather'
import WidgetCard        from '../components/WidgetCard'
import LoadingSpinner    from '../components/LoadingSpinner'
import ErrorBanner       from '../components/ErrorBanner'
import IconButton        from '../components/IconButton'
import AnimatedCounter   from '../components/AnimatedCounter'
import { FiRotateCw, FiCloud,  FiWind, FiSun } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function WeatherWidget() {
  const { state } = useAppContext()
  const { weatherData, isLoading, errorMsg, refetch } = useWeather(state.city)

  const headerActions = (
    <IconButton onClick={refetch} title="Refresh weather">
      <FiRotateCw className="w-4 h-4 text-gray-700" />
    </IconButton>
  )

  if (isLoading) {
    return (
      <WidgetCard title="Weather" actions={headerActions}>
        <LoadingSpinner label="Loading weather data" />
      </WidgetCard>
    )
  }

  if (!weatherData) {
    return (
      <WidgetCard title="Weather" actions={headerActions}>
        <ErrorBanner message={errorMsg} />
        <p>Unable to fetch weather data</p>
      </WidgetCard>
    )
  }

  // Find the hottest day index to highlight it
  const hottestIndex = weatherData.forecast.reduce(
    (maxIdx, day, idx, arr) => (day.temp > arr[maxIdx].temp ? idx : maxIdx),
    0
  )

  return (
    <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 1 }}
    >
     <WidgetCard title="Weather" icon={<FiCloud className="w-5 h-5" />} actions={headerActions}>
      <ErrorBanner message={errorMsg} />

      {/* City and condition */}
      <div className="mb-4 md:mb-6">
        <div className="text-base md:text-lg font-semibold text-gray-900 mb-1">
          {weatherData.city}, {weatherData.country}
        </div>
        <div className="text-sm text-gray-600">
          {weatherData.condition}
        </div>
      </div>

      {/* Big temperature + icon */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="text-4xl md:text-5xl font-bold text-gray-900">
          <AnimatedCounter to={weatherData.temp} duration={0.8} suffix="°" /> <span className="text-2xl md:text-3xl">F</span>
        </div>
        <div className="text-5xl md:text-6xl" aria-hidden="true">
          {weatherData.emoji}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
        {[
          { label: 'Humidity', value: weatherData.humidity, icon: " "     },
          { label: 'Wind',     value: weatherData.windKph, icon: <FiWind className="w-4 h-4 text-gray-500" />, suffix: ' kph'  },
          { label: 'UV Index', value: weatherData.uvIndex, icon: <FiSun className="w-4 h-4 text-yellow-500" />, suffix: ''            },
          { label: 'Feels',    value: weatherData.feelsLike, icon: <FiCloud className="w-4 h-4 text-gray-400" />, suffix: '°'    },
        ].map(stat => (
          <div key={stat.label} className="text-center flex flex-col items-center">
            <div className="mb-1">{stat.icon}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{stat.label}</div>
            <div className="text-sm md:text-base font-semibold text-gray-900">
              {typeof stat.value === 'number' && stat.value !== weatherData.uvIndex ? (
                <AnimatedCounter to={stat.value} duration={0.8} suffix={stat.suffix} />
              ) : (
                `${stat.value}${stat.suffix}`
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5-day forecast strip */}
      <div className="flex justify-between gap-1 md:gap-2">
        {weatherData.forecast.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center py-2 md:py-3 px-1 md:px-2 flex-1 rounded-lg text-xs md:text-sm ${
              index === hottestIndex ? 'bg-orange-50' : ''
            }`}
          >
            <div className="text-xs font-semibold text-gray-600 mb-1">{day.day}</div>
            <div className="text-lg md:text-2xl mb-1" aria-hidden="true">{day.emoji}</div>
            <div className="font-bold text-gray-900">{day.temp}°</div>
          </div>
        ))}
      </div>
    </WidgetCard>
    </motion.div>
  )
}
