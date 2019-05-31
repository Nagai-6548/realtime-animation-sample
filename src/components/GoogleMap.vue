<template>
  <div id="google-map-wrapper">
    <div id="google-map"></div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import CustomMarker from '../google-map/CustomMarker.js';
const carIcon = {
  url: 'alphard.png',
  anchor: new google.maps.Point(16,16)
};
// Initialize Firebase
var config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};
firebase.initializeApp(config);

export default {
  data() {
    return {
      map: null,
      markers: [],
      car: null
    }
  },
  /**
   * 初期化時の処理
   */
  mounted() {
    const that = this;
    const el = document.getElementById("google-map");
    this.map = this.initMap(el);
    // firebaseから車両データを取得
    firebase.database().ref("cars").once("value").then(snapshot => {
      snapshot.val().forEach((car, i) => {
        if (!car) return;
        const pos = new google.maps.LatLng(car.lat, car.lng);
        const marker = new CustomMarker(pos, car.angle, that.map);
        that.markers[i] = marker;
        firebase.database().ref(`cars`).on("child_changed", car => {
          if (!car || car.key === null) return;
          const nextPos = new google.maps.LatLng(car.val().lat, car.val().lng);
          this.markers[parseInt(car.key)].go(nextPos);
        })
      });
    });
  },
  methods: {
    /**
     * マップ初期化
     * @param { Element|null } el GoogleMapを表示するエレメント
     * @returns { google.maps.Map } GoogleMap
     */
    initMap(el) {
      const that = this;
      const center = { lat: 35.5, lng: 135.6 };
      const map = new google.maps.Map(el, {
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
        clickableIcons: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        fullscreenControl: false,
      });
      map.addListener('click', (e) => {
        let marker = that.markers[parseInt(that.$route.params.id)];
        let xMove = e.latLng.lng() - marker.getPosition().lng();
        let yMove = e.latLng.lat() - marker.getPosition().lat();
        let angle = Math.atan(xMove / yMove) * 180 / Math.PI;
        if (yMove < 0) {
          angle += 180;
        }
        firebase.database().ref(`cars/${that.$route.params.id}`).update({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          angle: angle
        })
      });
      return map;
    },
    /**
     * 移動処理
     * @param { Element|null } el GoogleMapを表示するエレメント
     */
    move(data) {
      firebase.database().ref("car/")
    },
    onChangeToggle() {
      Object.keys(this.markers).forEach((key) => {
        const marker = this.markers[key];
        if (marker.getMap()) {
          marker.setMap(null);
        } else {
          marker.setMap(this.map)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#google-map-wrapper {
  height: 100%;
  width: 100%;
  #google-map {
    height: 100%;
    width: 100%;
  }
  #flg {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: 200px;
    height: 60px;
    background-color: black;
    color: white;
  }
}
</style>
