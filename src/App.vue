<template>
  <div id="app">
    <GoogleMap/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GoogleMap from './components/GoogleMap.vue';

@Component({
  components: {
    GoogleMap,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  height: 100%;
}
</style>
