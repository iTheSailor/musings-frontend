import React from 'react'
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import './Lookup.css'
import PropTypes from 'prop-types'

const LocationLookup = (props) => {
  const GeoKey = process.env.REACT_APP_GEOAPIFY_API_KEY;



  const onPlaceSelect = (location) => {
      // Assuming 'location' is the new value you want to set
      props.setSelectedLocation(location); // Or however you access the prop
      console.log("New location selected:", location);
  };
  

  function onSuggectionChange(value) {

  }

  return <GeoapifyContext apiKey={GeoKey} >
      <GeoapifyGeocoderAutocomplete placeholder="Enter address here"
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggectionChange}
        />
    </GeoapifyContext>
}

LocationLookup.propTypes = {
  setSelectedLocation: PropTypes.func.isRequired
}

export default LocationLookup
