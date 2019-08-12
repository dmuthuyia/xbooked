/**
 developer: Dennis Muthuyia  
 email:  dmuthuyia@gmail.com
 */

import React, { Component } from "react";

import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  CheckBox,
  Button,
  PixelRatio,
  Modal,
  Alert,
  TouchableHighlight
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
//import Moment from "react-moment";
//import "moment-timezone";
import moment from "moment";
//import { format } from "date-fns";
import CountryPicker, {
  getAllCountries
} from "react-native-country-picker-modal";

import { CountrySelection } from "react-native-country-list";
import Select from "react-select";

import Logo from "../components/logo";
import { latitude, longitude } from "geolib";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const point3H = (40 * HEIGHT) / 100;
const controlsContHeight = (10 * HEIGHT) / 100;
const point3W = (50 * WIDTH) / 100;
const point3W2 = (33.3 * WIDTH) / 100;
const section1H = (25 * HEIGHT) / 100;
const section2H = (30 * HEIGHT) / 100;
const section3H = (30 * HEIGHT) / 100;
const section4H = (8 * HEIGHT) / 100;

export default class Booking extends Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      // from props
      userName: "",
      dp: "",
      // To be passed to server
      eventName: "",
      description: "",
      userPassword: "",
      acceptedTerms: false,
      //time picker
      isDateTimePickerVisibleSD: false,
      isDateTimePickerVisibleED: false,
      isDateTimePickerVisibleST: false,
      isDateTimePickerVisibleET: false,

      // react-native-country-list
      selected: null,

      // react-native-country-list modal
      modalVisible: false,

      //device location
      location: null,
      lat: null,
      lng: null,

      // reverse geocode

      googleApiLocation: null,
      country: null,
      county: null,
      city: null,
      location: null,
      street: null,

      // dropdown
      eventType: []
    };
  }
  componentDidMount() {
    var dp = this.props.navigation.getParam("dp", "Nothing");
    var userName = this.props.navigation.getParam("userName", "Nothing");

    this.setState({
      userName: userName,
      dp: dp
    });

    /*navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: coordinatesLtd,
          longitude: coordinatesLng,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );*/

    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        var myApiKey = "AIzaSyAb1PAAzq8TyNB-VVf3q_woxYnr-q3W8G8";
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;

        fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            myLat +
            "," +
            myLng +
            "&key=" +
            myApiKey
        )
          .then(response => response.json())
          .then(responseJson => {
            this.setState({
              //googleApiLocation: JSON.stringify(responseJson)
              country: JSON.stringify(
                responseJson.results[0].address_components[4].long_name
              ).replace(/\"/g, ""), //mystring.replace('/r','/');
              county: JSON.stringify(
                responseJson.results[0].address_components[3].long_name
              ).replace(/\"/g, ""),
              city: JSON.stringify(
                responseJson.results[0].address_components[2].long_name
              ).replace(/\"/g, ""),
              location: JSON.stringify(
                responseJson.results[0].address_components[1].long_name
              ).replace(/\"/g, ""),
              street: JSON.stringify(
                responseJson.results[0].address_components[0].long_name
              ).replace(/\"/g, "")
            });

            /*alert(
            "ADDRESS GEOCODE is BACK!! => " + JSON.stringify(responseJson)
            ); */
            /*alert(
              JSON.stringify(
                responseJson.results[0].address_components[4].long_name
              )
            );*/
          });

        /*var pos = {
            lat: 40.7809261,
            lng: -73.9637594
          };
          
          Geocoder.geocodePosition(pos).then(res => {
              alert(res[0].formattedAddress);
          })
          .catch(error => alert(error));*/
        this.setState({
          location: location,
          lat: myLat,
          lng: myLng
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 2000 }
    );
  }

  //Date picker functions
  showDateTimePickerStartDate = () => {
    this.setState({ isDateTimePickerVisibleSD: true });
  };

  showDateTimePickerEndDate = () => {
    this.setState({ isDateTimePickerVisibleED: true });
  };

  showDateTimePickerStartTime = () => {
    this.setState({ isDateTimePickerVisibleST: true });
  };

  showDateTimePickerEndTime = () => {
    this.setState({ isDateTimePickerVisibleET: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisibleSD: false });
    this.setState({ isDateTimePickerVisibleED: false });
    this.setState({ isDateTimePickerVisibleST: false });
    this.setState({ isDateTimePickerVisibleET: false });
  };

  handleDatePicked = date => {
    var newDate = moment(date).format("DD/MM/YYYY");
    //newDate = format(date, "DD/MM/YYYY"); // using date-fns
    //alert(newDate);
    this.hideDateTimePicker();
  };

  handleTimePicked = time => {
    //newTime = time.toLocaleTimeString("en-US");
    var newTime = moment(time).format("HH:mm");
    //alert(newTime);
    this.hideDateTimePicker();
  };

  onCountrySelection = country => {
    this.setState({ selected: country });
    //alert(country["name"]);
    //alert(country.name);
    //dispObject = JSON.stringify(country);
    //alert(dispObject);

    this.toggleModal(!this.state.modalVisible);
  };

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  // send data to booking table

  registerBooking = () => {
    //alert("yo");
    const { eventName } = this.state;
    const { description } = this.state;
    const { userPassword } = this.state;
    fetch("https://infohtechict.co.ke/apps/boukd/p-booking.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        UserName: eventName,
        email: description,
        password: userPassword
      })
    })
      .then(response => response.json())
      .then(responseJsonFromServer => {
        if (responseJsonFromServer == "User Registered Successfully") {
          alert(responseJsonFromServer);
          this.props.navigation.navigate("Login");
        } else {
          alert("Something went wrong");
        }
      })
      .catch(error => {
        console.error(error);
      });

    //onButtonPress = () => this.props.navigation.navigate("Login");
  };

  render() {
    const { selected } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.section1}>
            <View style={styles.col1}>
              <View style={styles.avatar}>
                <Image
                  style={{ flex: 1, borderRadius: 10 }}
                  resizeMode="cover"
                  source={{
                    uri:
                      "https://infohtechict.co.ke/apps/boukd/images/profile/" +
                      this.state.dp
                  }}
                />
              </View>
            </View>

            <View style={styles.col1}>
              <Text style={styles.pTextMajor}>
                Name:
                <Text style={styles.pTextMinor}> {this.state.userName}</Text>
              </Text>
              <Text style={styles.pTextMajor}>Performance</Text>
              <Text style={styles.pTextMajor}>Punctuality</Text>
              <Text style={styles.pTextMajor}>Professionalism</Text>
            </View>
          </View>

          <View style={styles.section2}>
            <TextInput
              style={styles.inputBox}
              placeholder="Event name"
              placeholderTextColor="gray"
              returnKeyType="next"
              autoCorrect={false}
              onChangeText={eventName => this.setState({ eventName })}
            />
            <TextInput
              style={styles.inputBoxDes}
              placeholder="description"
              placeholderTextColor="gray"
              returnKeyType="next"
              autoCorrect={true}
              multiline={true}
              onChangeText={description => this.setState({ description })}
            />
          </View>
          <View style={styles.section3}>
            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="Event type"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              />
            </View>

            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="$ amount"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              />
            </View>
          </View>

          <View style={styles.section3}>
            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => {
                  this.toggleModal(true);
                }}
              >
                <Text>{this.state.country}</Text>
              </TouchableOpacity>

              <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  console.log("Modal has been closed.");
                }}
              >
                <View style={styles.modal}>
                  <View style={{ width: "100%", height: "90%" }}>
                    <ScrollView>
                      <CountrySelection
                        action={item => this.onCountrySelection(item)}
                        selected={selected}
                        style={{ width: 500 }}
                      />
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="State/county"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              >
                {this.state.county}
              </TextInput>
            </View>
          </View>
          <View style={styles.section3}>
            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="City"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              >
                {this.state.city}
              </TextInput>
            </View>

            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="Location/street/address"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              >
                {this.state.street}
              </TextInput>
            </View>
          </View>

          <View style={styles.section3}>
            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="Latitude"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              >
                {this.state.lat}
              </TextInput>
            </View>

            <View style={styles.col1}>
              <TextInput
                style={styles.inputBox}
                placeholder="Longitude"
                placeholderTextColor="gray"
                returnKeyType="next"
                autoCorrect={false}
                onChangeText={eventName => this.setState({ eventName })}
              >
                {this.state.lng}
              </TextInput>
            </View>
          </View>
          <View style={styles.section3}>
            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={this.showDateTimePickerStartDate}
              >
                <Text>Start date</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisibleSD}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
            </View>

            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={this.showDateTimePickerEndDate}
              >
                <Text>End date</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisibleED}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
            </View>
          </View>

          <View style={styles.section3}>
            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={this.showDateTimePickerStartTime}
              >
                <Text>Start time</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisibleST}
                onConfirm={this.handleTimePicked}
                onCancel={this.hideDateTimePicker}
                mode="time"
              />
            </View>

            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={this.showDateTimePickerEndTime}
              >
                <Text>End time</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisibleET}
                onConfirm={this.handleTimePicked}
                onCancel={this.hideDateTimePicker}
                mode="time"
              />
            </View>
          </View>

          <View style={styles.section3}>
            <View style={styles.col1}>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    value={this.state.acceptedTerms}
                    onValueChange={() =>
                      this.setState({
                        acceptedTerms: !this.state.acceptedTerms
                      })
                    }
                    testID="boukdTBox"
                  />
                  <Text style={{ marginTop: 5, fontSize: 12 }}>
                    {" "}
                    Accept Boukd terms
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.col1}>
              <Text>Location: {this.state.location}</Text>
            </View>
          </View>

          <View style={styles.section3}>
            <View style={styles.col1}>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText}>
                  <Text style={{ color: "gray" }}>Message</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.col1}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={this.registerBooking}
              >
                <Text style={styles.buttonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,

    alignItems: "center"
  },

  inputBox: {
    width: "80%",
    height: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "black",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 12
  },
  inputBoxDes: {
    width: "98%",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#000000",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingRight: 10,

    textAlignVertical: "top"
  },

  bookBtnContainer: {
    width: 100,
    backgroundColor: "blue",
    paddingVertical: 5,
    borderColor: "#4c1037",
    borderWidth: 1,
    justifyContent: "center",
    textAlign: "center"
  },
  buttonText: {
    textAlign: "center",
    color: "rgb(32, 53, 70)",
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    paddingVertical: 5
  },
  signupTextCont: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row"
  },
  pTextMajor: {
    color: "#4c1037",
    fontSize: 12,
    fontFamily: "sans-serif"
  },
  pTextMinor: {
    color: "blue",
    fontSize: 12,
    fontFamily: "sans-serif-condensed"
  },
  signupButton: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "500"
  },

  section1: {
    width: WIDTH,
    flexDirection: "row",

    padding: 2
  },
  col1: {
    width: point3W
  },
  section2: {
    marginBottom: 20,
    width: WIDTH,

    padding: 4
  },
  section3: {
    width: WIDTH,
    flexDirection: "row",

    padding: 4
  },
  section4: {
    width: WIDTH,
    flexDirection: "row",
    height: section4H,
    justifyContent: "center",
    padding: 2
  },
  avatar: {
    width: 80,
    height: 80,
    //alignSelf: "flex-end",
    padding: 2,
    borderRadius: 10
  },
  buttonContainer: {
    width: "80%",
    height: 40,
    backgroundColor: "#92ca2c",

    borderRadius: 10,
    borderColor: "#ffffff",
    borderWidth: 2
  },
  instructions: {
    fontSize: 12,
    textAlign: "center",
    color: "#888",
    marginBottom: 5
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: "#ddd",
    borderColor: "#888",
    borderWidth: 1 / PixelRatio.get(),
    color: "#777"
  },
  modal: {
    flex: 1,

    backgroundColor: "white"
  },
  text: {
    color: "#3f2949",
    marginTop: 10
  }
});
