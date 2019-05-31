import { AnimationOverlay } from './AnimationOverlay';
import Vue from 'vue';
import BalloonDiv from '../components/BalloonDiv';

export default class CustomMarker extends google.maps.OverlayView {
  constructor(latlng, angle, map) {
    super();
    this.first = true;
    this.path = [];
    this.latlng = latlng;
    this.angle = angle;
    this.map = map;
    this.orders = [];
    this.setMap(map);
  }
  onAdd() {
    var divWrapper = document.createElement('div');
    divWrapper.style.position = 'absolute';
    if (this.first) {
      divWrapper.style.animation = 'fadein 1s linear 0s 1 normal';
      this.vm_ = new Vue(BalloonDiv);
      this.vm_.setAngle(this.angle);
      this.vm_.$mount();
    }
    this.first = false;
    const div = this.vm_.$el;
    divWrapper.appendChild(div);
    this.div_ = divWrapper;
    this.divInner_ = div;
    // 要素を追加する子を取得
    const panes = this.getPanes();
    // 要素追加
    panes.overlayMouseTarget.appendChild(this.div_);
  }
  draw() {
    if (this.div_ && this.divInner_) {
      var prj = this.getProjection();
      if (prj) {
        var point = prj.fromLatLngToDivPixel(this.latlng);
        this.div_.style.left = (point.x - 16) + 'px';
        this.div_.style.top = (point.y - 16) + 'px';
      }
    }
  }
  remove() {
    if (this.div_.parentNode) {
      this.div_.parentNode.removeChild(this.div_);
    }
  }
  removeWithAnimation(callback) {
    if (this.div_) {
      this.div_.style.animation = 'fadeout 1s linear 0s 1 normal';
      this.div_.addEventListener("animationend", () => {
        this.setMap(null);
        callback();
      });
    }
  }
  setVisible(flg) {
    this.div_.style.opacity = flg ? "1" : "0";
  }
  getPosition() {
    return this.latlng;
  }
  getIcon() {
    return this.icon;
  }
  setIcon(icon) {
    this.icon = icon;
  }
  setPosition(pos) {
    this.latlng = pos;
    this.draw();
  }
  go(nextPosition, callback) {
    let animation = new AnimationOverlay(this, nextPosition, this.getMap(), () => {
      if (animation) {
        animation.setMap(null);
        animation = null;
      }
      if (callback) {
        callback.apply(this);
      }
    });
  }
  setPath(path) {
    path.shift();
    this.path = path;
    this.goNext();
  }
  goNext() {
    var nextPosition = this.path.shift();
    if (nextPosition) {
      this.go(nextPosition, () => this.goNext());
    }
  }
  getMap() {
    return this.map;
  }
  setStatus(status) {
    if (this.vm_) {
      this.vm_.setStatus(status);
    }
  }
  getColor() {
    if (this.vm_) {
      return this.vm_.getColor();
    }
    return null;
  }
  setIcon(type) {
    if (this.vm_) {
      this.vm_.setIcon(type);
    }
  }
  setOrders(orders) {
    if (this.vm_) {
      this.vm_.setOrders(orders);
    }
    this.orders = orders;
  }
}