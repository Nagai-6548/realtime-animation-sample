export class AnimationOverlay extends google.maps.OverlayView {
  constructor(marker, endPos, map, callback) {
    super();
    this.div_ = null;
    var startPos = marker.getPosition();
    this.endPos = endPos;
    this.marker = marker;
    this.marker.setMap(null);
    this.xMove = endPos.lng() - startPos.lng();
    this.yMove = endPos.lat() - startPos.lat();
    this.move = (this.xMove > 0 ? "r" : "l") + (this.yMove > 0 ? "t" : "b");
    //this.distance = this.getDistance(startPos.lat(), startPos.lng(), endPos.lat(), endPos.lng());
    //this.speed = speed * 10;
    this.angle = Math.atan(this.xMove / this.yMove) * 180 / Math.PI;
    if (this.yMove < 0) {
      this.angle += 180;
    }
    // 横向きアイコン用
    //this.angle += 90; 
    this.callback = callback;
    this.bounds = new google.maps.LatLngBounds();
    this.bounds.extend(startPos);
    this.bounds.extend(endPos);
    this.setMap(map);
  }
  onAdd() {
    var that = this;
    if (!this.marker.vm_) {
      return;
    }
    // animationBoundaryは移動アニメーションの始点から終点の領域
    var animationBoundary = document.createElement('div');
    animationBoundary.style.borderStyle = 'none';
    animationBoundary.style.borderWidth = '0px';
    animationBoundary.style.position = 'absolute';
    animationBoundary.style.backgroundColor = 'transparent';
    // dummyMarkerはanimationBoundary内を移動するマーカー
    var dummyMarker = document.createElement('div');
    dummyMarker.style.width = '32px';
    dummyMarker.style.height = '32px';
    dummyMarker.style.position = 'absolute';
    dummyMarker.style.animation = `slide_${this.move} ${1000}ms linear 1 forwards`;
    // balloonはdummyMarkerと一緒に移動するマーカーの吹き出し
    this.marker.vm_.setAngle(this.angle);
    dummyMarker.appendChild(this.marker.vm_.$el);
    animationBoundary.appendChild(dummyMarker);
    setTimeout(() => {
      that.marker.setPosition(that.endPos);
      that.marker.setMap(that.getMap());
      that.callback.apply(this);
    }, 1000);
    this.div_ = animationBoundary;
    // 要素を追加する子を取得
    const panes = this.getPanes();
    // 要素追加
    panes.overlayMouseTarget.appendChild(this.div_);
  }
  draw() {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
    var div = this.div_;
    if (div) {
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
    }
  }
  remove() {
    if (this.div_) {
      if (this.div_.parentNode) {
        this.div_.parentNode.removeChild(this.div_);
      }
      this.div_ = null;
    }
  }
  getDistance(lat1, lon1, lat2, lon2) {
    // 地球の半径
    const r = 6378.137;
    // 緯度経度の差から距離(キロメートル)を取得
    return (
      r *
      Math.acos(
        Math.sin(this.torad(lat1)) * Math.sin(this.torad(lat2)) +
          Math.cos(this.torad(lat1)) *
            Math.cos(this.torad(lat2)) *
            Math.cos(this.torad(lon2) - this.torad(lon1))
      )
    );
  }
  torad(deg) {
    return deg * (Math.PI / 180);
  }
}
