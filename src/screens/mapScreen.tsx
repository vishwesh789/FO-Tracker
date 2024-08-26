import React, {useState, useEffect, useRef, memo, useMemo} from 'react';
import {Alert} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from 'react-native';
import {DealerLocation, Location} from '../types/foTypes';
import {useSelector} from 'react-redux';
import {IRootState} from '../store/reducers';
import {getTodaysDealers, updateDealers} from '../db/dbMethods';
import {
  MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER,
  MINIMUM_RADIUS_TO_REGISTER_CHEKOUT_IN_METER,
} from '../utils/constants';

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [dealerLocations, setDealerLocations] = useState<DealerLocation[]>([]);

  const map = useRef<MapView | null>(null);
  const arrowImage = require('../assets/arrow.png');
  const pinImage = require('../assets/checkedin.png');
  const position = useSelector((state: IRootState) => state.fo.currentPosition);
  const isPresent = useSelector((state: IRootState) => state.fo.isClockedIn);
  console.log(' map scrrrrrrrnn');
  useEffect(() => {
    if (position) {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading,
      };
      setCurrentLocation(newLocation);
      fitToCoordinates(true);
    }
  }, [position]);

  useEffect(() => {
    if (currentLocation && isPresent) {
      checkProximity(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    const initialiseDealears = async () => {
      let d = await getTodaysDealers();
      setDealerLocations(d);
    };
    initialiseDealears();
  }, []);

  useEffect(() => {
    const updateDealerStatus = async () => {
      if (dealerLocations.length !== 0) {
        updateDealers(dealerLocations);
      }
    };
    updateDealerStatus();
  }, [dealerLocations]);

  const fitToCoordinates = (animated: boolean) => {
    const coordinates = dealerLocations.map(d => {
      return {latitude: d.latitude, longitude: d.longitude};
    });

    if (currentLocation) {
      coordinates.push({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }

    if (coordinates.length > 0 && map.current) {
      map.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 30, right: 30, bottom: 10, left: 30},
      });
    }
  };

  const checkProximity = (userLocation: Location) => {
    setDealerLocations(prevDealerLocations =>
      prevDealerLocations.map(dealer => {
        const distance = getDistanceFromLatLonInMeters(
          userLocation.latitude,
          userLocation.longitude,
          dealer.latitude,
          dealer.longitude,
        );

        const time = new Date().toISOString();
        let updatedDealer = {...dealer};

        if (
          distance <= MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER &&
          !dealer.checkedIn
        ) {
          if (!dealer.checkInTime) {
            Alert.alert(
              'Check-in Alert',
              `You have checked in at dealer ${dealer.id}`,
            );
            updatedDealer = {
              ...updatedDealer,
              checkedIn: true,
              isVisited: true,
              checkInTime: time,
            };
          }
        }

        if (
          dealer.checkedIn &&
          distance <= MINIMUM_RADIUS_TO_REGISTER_CHEKOUT_IN_METER
        ) {
          updatedDealer = {...updatedDealer, isReadyForCheckout: true};
        }

        if (
          dealer.checkedIn &&
          dealer.isReadyForCheckout &&
          !dealer.checkOutTime &&
          distance > MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER
        ) {
          Alert.alert(
            'Check-out Alert',
            `You have checked out from dealer ${dealer.id}`,
          );
          updatedDealer = {
            ...updatedDealer,
            checkedIn: false,
            checkOutTime: time,
            isReadyForCheckout: false,
          };
        }

        return updatedDealer;
      }),
    );
  };

  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const renderDealerLocations = useMemo(() => {
    return dealerLocations.map(location => (
      <React.Fragment key={location.id}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={`Dealer ${location.id}`}>
          {location.isVisited && (
            <Image source={pinImage} style={styles.pinImage} />
          )}
        </Marker>
        <Circle
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER}
          strokeWidth={2}
          strokeColor={
            location.isVisited ? 'rgba(0,128,0,0.6)' : 'rgba(255,0,0,0.5)'
          }
          fillColor={
            location.isVisited ? 'rgba(0,128,0,0.2)' : 'rgba(255,0,0,0.2)'
          }
        />
      </React.Fragment>
    ));
  }, [dealerLocations]);

  return (
    <MapView
      ref={map}
      style={styles.mapView}
      initialRegion={{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={false}>
      {currentLocation && (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Your Location"
          rotation={currentLocation.heading || 0}
          anchor={{x: 0.5, y: 0.5}}
          flat={true}>
          <Image
            source={arrowImage}
            style={[
              styles.arrowImage,
              {transform: [{rotate: `${currentLocation.heading || 0}deg`}]},
            ]}
          />
        </Marker>
      )}
      {renderDealerLocations}
    </MapView>
  );
};

export default MapScreen;
const styles = {
  mapView: {
    flex: 1,
  },
  arrowImage: {
    width: 30,
    height: 45,
  },
  pinImage: {
    width: 50,
    height: 50,
  },
};
