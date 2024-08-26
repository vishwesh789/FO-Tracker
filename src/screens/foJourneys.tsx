import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import {COLORS} from '../assets/colors';
import {getAllJourneys} from '../db/dbMethods';
import {DealerLocation, FoJourney, LatLong} from '../types/foTypes';
import {extractTime, formatDateToDDMMYYYY} from '../utils/timeConversions';
import {useSelector} from 'react-redux';
import {IRootState} from '../store/reducers';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import { MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER } from '../utils/constants';

const pinImage = require('../assets/checkedin.png');
const startImage = require('../assets/start2.png');
const endImage = require('../assets/end.png');

const FoJourneys = () => {
  const [journeys, setJourneys] = useState<FoJourney[]>([]);
  const {currentPosition, isClockedIn} = useSelector(
    (state: IRootState) => state.fo,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPathCoordinates, setSelectedPathCoordinates] = useState<
    LatLong[]
  >([]);
  const [selectedDealers, setSelectedDealers] = useState<DealerLocation[]>([]);

  useEffect(() => {
    const loadJourneys = async () => {
      const journeys = await getAllJourneys();
      setJourneys(journeys);
    };
    loadJourneys();
  }, [isClockedIn]);

  const fitToBounds = useCallback(
    (
      mapRef: React.MutableRefObject<MapView | null>,
      coordinates: LatLong[],
      dealers: DealerLocation[],
    ) => {
      if (!mapRef.current || coordinates.length === 0) return;

      const dealerLocations = dealers.map(({latitude, longitude}) => ({
        latitude,
        longitude,
      }));
      const latitudes = coordinates.map(({latitude}) => latitude);
      const longitudes = coordinates.map(({longitude}) => longitude);

      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);

      const totalCoord = [
        ...dealerLocations,
        {latitude: minLatitude, longitude: minLongitude},
        {latitude: maxLatitude, longitude: maxLongitude},
      ];

      const edgePadding = {top: 50, right: 50, bottom: 50, left: 50};

      mapRef.current.fitToCoordinates(totalCoord, {
        edgePadding,
        animated: true,
      });
    },
    [],
  );
  const ModalMapView = useCallback(() => {
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
      if (selectedPathCoordinates.length > 0) {
        const timer = setTimeout(() => {
          fitToBounds(mapRef, selectedPathCoordinates, selectedDealers);
        }, 500);

        return () => clearTimeout(timer);
      }
    }, [selectedPathCoordinates, selectedDealers, fitToBounds]);

    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: currentPosition.coords.latitude,
              longitude: currentPosition.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Polyline
              coordinates={selectedPathCoordinates}
              strokeColor="green"
              strokeWidth={8}
            />
            {selectedPathCoordinates.length > 0 && (
              <>
                <Marker coordinate={selectedPathCoordinates[0]} title="Start">
                  <Image source={startImage} style={styles.startEnd} />
                </Marker>
                <Marker
                  coordinate={
                    selectedPathCoordinates[selectedPathCoordinates.length - 1]
                  }
                  title="End">
                  <Image source={endImage} style={styles.startEnd} />
                </Marker>
              </>
            )}
            {selectedDealers.map(d => (
              <React.Fragment key={d.id}>
                <Marker
                  coordinate={{latitude: d.latitude, longitude: d.longitude}}
                  title={`Dealer ${d.id}`}>
                  {d.isVisited && (
                    <Image source={pinImage} style={styles.pinImage} />
                  )}
                </Marker>
                <Circle
                  center={{latitude: d.latitude, longitude: d.longitude}}
                  radius={MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER}
                  strokeWidth={2}
                  strokeColor={
                    d.isVisited ? 'rgba(0,128,0,0.6)' : 'rgba(255,0,0,0.5)'
                  }
                  fillColor={
                    d.isVisited ? 'rgba(0,128,0,0.2)' : 'rgba(255,0,0,0.2)'
                  }
                />
              </React.Fragment>
            ))}
          </MapView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.textStyle}>Close Map</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }, [modalVisible, selectedPathCoordinates, selectedDealers, fitToBounds]);

  const renderItem = useCallback(
    ({item}: {item: FoJourney}) => (
      <View style={styles.headlineContainer}>
        <Text style={styles.date}>{formatDateToDDMMYYYY(item.date)}</Text>
        <View style={styles.row}>
          <Pressable style={styles.flex1}>
            <Text style={styles.name}>
              Clocked In: {extractTime(item.clockIn)}
            </Text>
            <Text style={styles.name}>
              {isClockedIn
                ? 'Clocked Out: Pending ...'
                : `Clocked Out: ${extractTime(item.clockOut)}`}
            </Text>
            {item.dealers.map(d => (
              <View key={d.id}>
                <Text style={styles.name}>
                  Dealer {d.id}:{' '}
                  <Text
                    style={d.isVisited ? styles.visited : styles.notVisited}>
                    {d.isVisited
                      ? `Visited (from ${extractTime(d.checkInTime)} to ${
                          d.checkOutTime
                            ? extractTime(d.checkOutTime)
                            : 'still there'
                        })`
                      : 'Visit Pending'}
                  </Text>
                </Text>
              </View>
            ))}
          </Pressable>
          <View>
            <Pressable
              style={styles.buttonn}
              onPress={() => {
                setSelectedPathCoordinates(item.locations);
                setSelectedDealers(item.dealers);
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText}>View Journey</Text>
            </Pressable>
          </View>
        </View>
        <ModalMapView />
      </View>
    ),
    [isClockedIn, ModalMapView],
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={journeys}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headlineContainer: {
    backgroundColor: COLORS.black,
    marginBottom: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    marginTop: 20,
  },
  name: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 5,
  },
  date: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    zIndex: 2,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonn: {
    padding: 8,
    backgroundColor: '#fdd380',
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'rgb(40, 0, 66)',
    fontSize: 15,
    fontWeight: '600',
  },
  startEnd: {
    width: 45,
    height: 45,
  },
  pinImage: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  flex1: {
    flex: 1,
  },
  visited: {
    color: 'green',
  },
  notVisited: {
    color: 'red',
  },
});

export default FoJourneys;
