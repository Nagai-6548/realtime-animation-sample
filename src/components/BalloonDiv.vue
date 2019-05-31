<template>
  <div class="custom-marker">
    <div class="icon" :style="{ transform: `rotate(${this.rotation}deg)` }">
      <img :src="icon.url"/>
    </div>
  </div>
</template>

<script>
const carIcon1 = {
  url: 'alphard.png',
  anchor: new google.maps.Point(16,16)
};
const carIcon2 = {
  url: 'hiace.png',
  anchor: new google.maps.Point(16,16)
};
export default {
  name: 'BalloonDiv',
  data() {
    return {
      icon: carIcon1,
      rotation: 0
    }
  },
  methods: {
    getAngle() {
      return this.rotation;
    },
    setAngle(rotation) {
      this.rotation = rotation;
    },
    getIcon() {
      return this.icon;
    },
    setIcon(icon) {
      this.icon = icon;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.custom-marker {
  position: absolute;
  .icon {
    cursor: pointer;
    width: 32px;
    height: 32px;
    img {
      width: 32px;
      height: 32px;
    }
  }
  .balloon {
    top: -50px;
    position: absolute;
    width: 80px; /* マーカーサイズ32px + 追加分48px */
    left: -24px; /* 追加分の-1/2 */
    height: 30px;
    background-color: #9ac0fc;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    font-weight: 400;
    font-family: sans-serif;
    z-index: 1003;
  }
  .balloon:before {
    content: "";
    position: absolute;
    border-top: 15px solid transparent;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 15px solid transparent;
    z-index: 1005;
    left: calc(50% - 8px);
    top: 30px;
    border-top: 15px solid #9ac0fc;
  }
  .balloon:after {
    content: "";
    position: absolute;
    border-top: 16px solid transparent;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 16px solid transparent;
    z-index: 1004;
    left: calc(50% - 8px);
    top: 31px;
    border-top-color: #000;
  }
}
</style>
