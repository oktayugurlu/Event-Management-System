import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
    height: "50vh",
    width: "50vw",
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const center = {
    lat: 39.9334,
    lng: 32.8597,
};

export default function ShowMap(props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const [marker, setMarker] = React.useState({});
    const [selected, setSelected] = React.useState(null);

    const onMapClick = React.useCallback((e) => {
        setMarker(
            {
                lat: parseFloat(e.latLng.lat()),
                lng: parseFloat(e.latLng.lng()),
                time: new Date(),
            }
        );
        //The information send to parent component
        const location = {
            lat: parseFloat(e.latLng.lat()),
            lng: parseFloat(e.latLng.lng()),
        };
        props.onClick(location);
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {(!isEmpty(marker)) ? <Marker
                    key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => {
                        setSelected(marker);
                    }}
                /> :''}
            </GoogleMap>
        </div>
    );
}

function isEmpty(obj) {
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}