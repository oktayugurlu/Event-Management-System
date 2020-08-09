import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
    height: "80vh",
    width: "60vw",
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const center = {
    lat: 39.9334,
    lng: 32.8597,
};

export default function Map(props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const [marker, setMarker] = React.useState({});

    const extractMarkerToParentComponent = props.onClick;
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
        extractMarkerToParentComponent(location);
    }, [extractMarkerToParentComponent]);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);


    const selectedMarkPlacer = ()=>{
         if(!isEmpty(marker))
             return (<Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}

                     />);
         if(!isEmpty(props.updatedMarker) && !props.isStatic)
             return (
                 <Marker
                     key={`${marker.lat}-${marker.lng}`}
                     position={{ lat: props.updatedMarker.lat, lng: props.updatedMarker.lng }}


                 />
             );
         if(props.isStatic){
             return (
                 <Marker
                     key={`${marker.lat}-${marker.lng}`}
                     position={{ lat: props.staticMarker.lat, lng: props.staticMarker.lng }}


                 />
             );
         }
    }

    const renderMapByCheckIsMapStaticOrNot= ()=>{
        if(props.isStatic){
            const mapContainerStyleForStatic={
                height: "50vh",
                width: "35vw",
            };
            return(<div>
                <GoogleMap
                    id="map"
                    mapContainerStyle={mapContainerStyleForStatic}
                    zoom={16}
                    center={{
                        lat: props.staticMarker.lat,
                        lng: props.staticMarker.lng,
                    }}
                    options={options}
                    onLoad={onMapLoad}
                >
                    {selectedMarkPlacer()}
                </GoogleMap>
            </div>)
        }
        else{
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
                        {selectedMarkPlacer()}
                    </GoogleMap>
                </div>
            );
        }
    }


    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return(
        renderMapByCheckIsMapStaticOrNot()
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