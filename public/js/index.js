// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4Ksps5H1IIJImjvp9VRc9F91KztOLMkg",
  authDomain: "web-project-320622.firebaseapp.com",
  projectId: "web-project-320622",
  storageBucket: "web-project-320622.appspot.com",
  messagingSenderId: "819591939047",
  appId: "1:819591939047:web:52ac633dfd886b7fd4f342",
  measurementId: "G-SNZX1ESTHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createRoomBtn = document.getElementById("createRoom")
const roomSelect = document.getElementById("room")

// function getCurrentPosition(cb){
//   const geo = navigator.geolocation;
//   geo.getCurrentPosition(cb);
// }

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    try {
      const geo = navigator.geolocation;
      geo.getCurrentPosition((geoPosition) => {
        resolve(geoPosition);
      });
    } catch (error) {
      reject(error);
    }
  });
}

createRoomBtn.addEventListener("click", async (event)=>{
  const geo = await getCurrentPosition();
    const lat = geo.coords.latitude;
    const long = geo.coords.longitude;
    console.log(lat,long)
    const newRoom = await addDoc(collection(db,"rooms"), {
      lat,long
    });
    window.location.href = `/chat.html?username=${username.id}&room=${newRoom.id}`
})

function renderRoomButton(roomId){
  const roomButton = document.createElement("option")
  roomButton.textContent = roomId
  roomButton.value = roomId
  roomSelect.appendChild(roomButton)
}

async function renderAllRooms(){
  const roomsData = await getDocs(collection(db, "rooms"));
  roomsData.forEach(async(roomData) => {
    const roomCoords = roomData.data()
    const userCoords = await getCurrentPosition()  
    const lat = userCoords.coords.latitude;
    const long = userCoords.coords.longitude;
    // number  is in kilometers
    if(getDistance({lat,long}, roomCoords) <50){
      renderRoomButton(roomData.id)
    }
  });
}

function getDistance(
  { lat: lat1, long: lon1 },
  { lat: lat2, long: lon2 }
){
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;


  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);


  let c = 2 * Math.asin(Math.sqrt(a));


  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;


  // calculate the result
  return c * r;
}

renderAllRooms();
