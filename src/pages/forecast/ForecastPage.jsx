import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import LocationLookup from '../../components/LocationLookup';
import IsButton from '../../components/IsButton';
import axios from 'axios';
import weatherCodes from  './WeatherCode.json'
import { useAuth } from '../../utils/AuthContext';
import IsPortal from '../../components/IsPortal';
import ForecastFavoritesForm from './ForecastFavoritesForm';
import UserSavedLocations from './UserSavedLocations';


const formatDate = (dateTimeStr) => {
    return dateTimeStr.split('T')[0]; // Converts '2024-02-25T05:00:00' to '2024-02-25'
};
const combineData = (supplemental, weather) => {
    const combined = {};
    weather.forEach((day) => {
        const dateKey = formatDate(day.date);
        // Ensure there's at least a default forecast entry for each day
        combined[dateKey] = {
            date: day.date,
            weather: {
                high: day.temperature_2m_max,
                low: day.temperature_2m_min,
                feelsHigh: day.apparent_temperature_max,
                feelsLow: day.apparent_temperature_min,
                precipitationChance: day.precipitation_probability_max,
                precipitationAmount: day.precipitation_sum,
                windSpeed: day.wind_speed_10m_max,
                windGust: day.wind_gusts_10m_max,
                code: day.weather_code,
                is_day: "day",
            },
            forecasts: supplemental[dateKey] || [{ detailedForecast: "Detailed forecast not available for locations outside of the US." }], // Provide a default message
        };
    });
    return Object.values(combined); // Convert the combined object into an array
};


function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}


const ForecastPage = () => {
    const { location } = useParams();
    const [selectedLocation, setSelectedLocation] = useState(location || '');
    const locationDataRef = useRef({});
    const [weatherData, setWeatherData] = useState([]);
    const [supplementalData, setSupplementalData] = useState({});
    const [address, setAddress] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [weatherCardHidden, setWeatherCardHidden] = useState(true);
	const [currentWeather, setCurrentWeather] = useState([]);
    const [isPortalOpen, setIsPortalOpen] = useState(false);

    const { loggedIn } = useAuth();

    const handleSearch = () => {
        console.log("Selected Location:", selectedLocation);
        //clear out previous data
        setWeatherData([]);
        setSupplementalData({});
        setAddress('');
        setCombinedData([]);
        setWeatherCardHidden(true);
        console.log("Searching for:", locationDataRef.current);
        axios.get(`${process.env.REACT_APP_API_URL}/api/weather`, {
            params: {
                lat: locationDataRef.current.coordinates.lat,
                lon: locationDataRef.current.coordinates.lon,
                country_code: locationDataRef.current.country_code,
                formatted: locationDataRef.current.formatted,
                timezone: locationDataRef.current.timezone
            },
        })
        .then((response) => {
            setWeatherData(response.data.weather || []);
            setSupplementalData(response.data.supplemental || {}); // Note: Ensure this matches the key in your response
            setAddress(response.data.address);
            setWeatherCardHidden(false);
			setCurrentWeather(response.data.current);
            console.log((response.data))
            let _address = response.data.address;
            let _address_string = JSON.stringify(_address);
            localStorage.setItem('address', _address_string);
            localStorage.setItem('lat', JSON.stringify(response.data.geodata.lat));
            localStorage.setItem('lon', JSON.stringify(response.data.geodata.lon));
            localStorage.setItem('timezone', JSON.stringify(response.data.timezone));
            localStorage.setItem('country_code', JSON.stringify(response.data.country_code));
            console.log("Fetched Data:", response.data); // Log the fetched data for debugging
            console.log(localStorage.getItem('lat'));
            console.log(localStorage.getItem('lon'));
            handleClose();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };


    const handleFavoriteLoggedout = () => {
        setIsPortalOpen(true);
    };

    const handleLocationSelect = (location) => {
        // Update state with selected location
        setSelectedLocation(location); 
        setIsPortalOpen(false);
        locationDataRef.current = {
            coordinates: {
                lat: location.lat,
                lon: location.lon,
            },
            country_code: location.country_code,
            formatted: location.formatted,
            timezone: location.timezone,
        };
        
        
        handleSearch();
    };
    
    const handleClose = () => {
        setIsPortalOpen(false);
    };



    useEffect(() => {
        if (selectedLocation) {
            setSelectedLocation(selectedLocation);
            locationDataRef.current = {
                coordinates: {
                    lat: selectedLocation.properties?.lat,
                    lon: selectedLocation.properties?.lon,
                },
                country_code: selectedLocation.properties?.country_code,
                formatted: selectedLocation.properties?.formatted,
                timezone: selectedLocation.properties?.timezone.name,
            };
        }
    }, [selectedLocation]);
    useEffect(() => {
        if (weatherData.length > 0 && Object.keys(supplementalData).length > 0){
            const combined = combineData(supplementalData, weatherData);
            setCombinedData(combined);
            console.log("Combined Data:", combined);
  
        }
    }, [weatherData, supplementalData]);
    

    return (
        <Container>
            <Segment textAlign='center' style={{ padding: '2em 0em', margin: 'auto'}} vertical className='flex-column align-items-center'>
                {loggedIn &&
                <Grid columns={2}>
                    <Grid.Column align='left'>
                    <Header as='h2'>Weather Forecast</Header>
                    </Grid.Column>
                    <Grid.Column align='right'>
                        <IsPortal
                            label='Saved Locations'
                            open={isPortalOpen}
                            onClose={() => setIsPortalOpen(false)}
                            header="Saved Locations"
                            
                        >
                            <UserSavedLocations onLocationSelect={handleLocationSelect}/>
                        </IsPortal>
                    </Grid.Column>
                </Grid>

            }
            {!loggedIn &&
                <Header as='h2'>Weather Forecast</Header>}
                <LocationLookup
                setSelectedLocation={setSelectedLocation} 
                />
                <Divider></Divider>
                <IsButton onClick={handleSearch} label="Search" className="searchButton"/>
            </Segment>
			<Segment hidden={weatherCardHidden}>
            <Grid columns={2}>
                <Grid.Column >
			<Header as='h3'>{address}</Header>
                </Grid.Column>
                <Grid.Column  align='right'>
                    {loggedIn && 
                    <IsPortal label='Add to Favorites' open={isPortalOpen} onClose={() => setIsPortalOpen(false)} header="Add to Favorites" >
                        <ForecastFavoritesForm onSubmit={(data) => console.log(data)} address={address}/>
                    </IsPortal>
                    }
                    {!loggedIn && 
                    <IsPortal onClick={handleFavoriteLoggedout} open={isPortalOpen} onClose={() => setIsPortalOpen(false)} header="Login Required" label="Add to Favorites" >
                        <p>You must be logged in to add favorites.</p>
                    </IsPortal>
                    }
                </Grid.Column>

            </Grid>
				<Card fluid className='currentWeatherCard'>
					<Card.Content>
						<Card.Header>Current Weather</Card.Header>
					</Card.Content>
					<Grid centered celled columns={3}>
						<Grid.Column verticalAlign="middle">
					<Card.Content>
						<Card.Description>Temperature: {parseInt(currentWeather.temperature)}°F</Card.Description>
						<Card.Description>Feels Like: {parseInt(currentWeather.feelsLike)}°F</Card.Description>
						<Card.Description>Cloud Coverage: {parseInt(currentWeather.cloud_cover)}%</Card.Description>
						<Card.Description>Humidity: {parseInt(currentWeather.relative_humidity)}%</Card.Description>
					</Card.Content>
					</Grid.Column>
					<Grid.Column verticalAlign="middle">
					<Card.Content>
						<Card.Description>Wind Speed: {parseInt(currentWeather.wind_speed)} mph</Card.Description>
						<Card.Description>Wind Direction: {degToCompass(currentWeather.wind_direction)} </Card.Description>
						<Card.Description>Wind Gust: {parseInt(currentWeather.wind_gusts)} mph</Card.Description>
						</Card.Content>
					</Grid.Column>
					<Grid.Column verticalAlign="middle">
					<Card.Content>
						<Card.Meta>
							<img src={weatherCodes[currentWeather.code]?.[currentWeather.is_day].image || 'default_image_url'} alt="Weather icon" />
							{weatherCodes[currentWeather.code]?.[currentWeather.is_day].description || 'No description available'}
						</Card.Meta>
					</Card.Content>
					</Grid.Column>
					</Grid>
				</Card>
			</Segment>
            <Segment hidden={weatherCardHidden}>
    <Grid padded columns={2} divided>
        {combinedData.map((day, index) => (
            <Grid.Row key={index}>
                <Grid.Column>
                    <Card fluid>
                        <Grid centered celled columns={2}>
                            <Grid.Column verticalAlign="middle">
                                <Card.Content>
                                    <Card.Header className='dailyWeatherCardHeader'>
                                        {new Date(day.date).toLocaleDateString()}
                                    </Card.Header>
                                </Card.Content>
                            </Grid.Column>
                            <Grid.Column verticalAlign="left">
                                <Card.Content>
                                    <Card.Meta>
                                        <img src={weatherCodes[day.weather.code]?.[day.weather.is_day].image || 'default_image_url'} alt="Weather icon" />
                                        {weatherCodes[day.weather.code]?.[day.weather.is_day].description || 'No description available'}
                                    </Card.Meta>
                                </Card.Content>
                            </Grid.Column>
                        </Grid>
                        <Grid centered celled columns={2}>
                            <Grid.Column verticalAlign="middle">
                                <Card.Content>
                                    <Card.Description>Hi: {parseInt(day.weather.high)}°F</Card.Description>
                                    <Card.Description>Lo: {parseInt(day.weather.low)}°F</Card.Description>
                                    <Card.Description>Chance of Precipitation: {day.weather.precipitationChance}%</Card.Description>
                                    <Card.Description>Precipitation Amount: {parseFloat(day.weather.precipitationAmount).toFixed(2)}&ldquo;</Card.Description>
                                </Card.Content>
                            </Grid.Column>
                            <Grid.Column verticalAlign='middle'>
                                <Card.Content>
                                    <Card.Description>Feels Like Hi: {parseInt(day.weather.feelsHigh)}°F</Card.Description>
                                    <Card.Description>Feels Like Lo: {parseInt(day.weather.feelsLow)}°F</Card.Description>
                                    <Card.Description>Wind Speed: {parseInt(day.weather.windSpeed)} mph</Card.Description>
                                    <Card.Description>Wind Gust: {parseInt(day.weather.windGust)} mph</Card.Description>
                                </Card.Content>
                            </Grid.Column>
                        </Grid>
                    </Card>
                </Grid.Column>
                <Grid.Column>
                    {day.forecasts.length > 0 ? day.forecasts.map((forecast, idx) => (
                        <Card fluid key={idx}>
                            <Card.Content>
                                <Card.Description>
                                    {forecast.detailedForecast}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )) : <Card fluid>
                            <Card.Content>
                                <Card.Description>
                                    Detailed forecast is not available for this location.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    }
                </Grid.Column>
                <Divider />
            </Grid.Row>
        ))}
    </Grid>
</Segment>

        </Container>
    );
};

export default ForecastPage;
