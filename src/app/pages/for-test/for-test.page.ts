import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GlobalConstants } from 'src/app/global-constants';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
// import { Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import { Storage } from '@ionic/storage';
import { Position } from '@capacitor/geolocation';
import Swiper from 'swiper';

@Component({
  selector: 'app-for-test',
  templateUrl: './for-test.page.html',
  styleUrls: ['./for-test.page.scss'],
})
export class ForTestPage implements OnInit {

  walkP = true;  // เดินมาร์ครอบแปลง
  markP = false;  // มาร์คจุดบนแผนที่

  yearCr?: string = GlobalConstants.yearCr
  upos = { lat: 15.228581111646495, lng: 103.07182686761979 };  // พิกัด BRR
  polygon: any;
  markerList?: any = [];
  marker?: any = []
  triangleCoords?: any = [];
  center = { lat: 15.228581111646495, lng: 103.07182686761979 }
  loader = new Loader({
    apiKey: environment.mapkey,
    version: 'weekly',
    // libraries: ["places"],
  });
  measureMethod?: string = "mark";   // วิธีการวัดแปลง
  mesureStatus?: string = "stop"  // สถานะการวัดแปลง wait start stop
  areacal? = 0;

  isTracking = false;
  currentMapTrack = null;
  trackedRoute = [];
  previousTracks = [];
  latLng?: any;
  // positionSubscription?: Subscription;
  watch?: any
  // map = new google.maps.Map(document.getElementById('map') as HTMLElement);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private firebase: FirebaseService,
    private geosv: GeolocationService,
    private toastCtrl: ToastController,
    // private plt: Platform,
    // private geolocation: Geolocation,
    // private storage: Storage,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.getGeolocation()
  }

  ionViewWillEnter() {
    this.getGeolocation();
    // this.startTracking();
    // this.measurePlot()
  }

  goBack() {
    // this.navCtrl.back();
    this.navCtrl.navigateBack('/tab3');
  }

  // get user location
  async getGeolocation() {
    this.presentToast('middle', 'กำลังเรียกพิกัดของคุณ...', 'locate')
    this.geosv.getCurrentCoordinate().then((res: any) => {
      this.upos.lat = res.coords.latitude
      this.upos.lng = res.coords.longitude
    }).catch((e: any) => {
      console.log('error :', e)
    }).finally(() => {
      console.log('finally getGeolocation')
      this.loadmap1()
      // this.measurePlot()
    })
  }

  // get user location now
  async getlocation() {
    this.presentToast('middle', 'กำลังเรียกพิกัดของคุณ...', 'locate')
    this.geosv.getCurrentCoordinate().then((res: any) => {
      this.upos.lat = res.coords.latitude
      this.upos.lng = res.coords.longitude
    }).catch((e: any) => {
      console.log('error :', e)
    }).finally(() => {
      // console.log('finally getGeolocation')
      // this.loadmap()
      // this.measurePlot()
    })
  }

  // watch position
  async startTracking() {
    this.isTracking = true
    await this.geosv.watchPosition().then((res: any) => {
      console.log('res watch ', res)
      if (res) {
        this.upos.lat = res.coords.latitude
        this.upos.lng = res.coords.longitude
        // let x = new google.maps.LatLng(res.coords.latitude, res.coords.latitude);
        console.log('x', this.upos)
        // this.latLng.push(x)
        // console.log('position change: ' + this.latLng);
        this.updateMarker();
      }
    })
  }

  updateMarker() {
    this.marker = this.upos
    console.log('marker now ', this.marker)
    // this.getGeolocation();
    // this.marker = new google.maps.Marker({
    //   position: this.latLng,
    //   title: "คุณ!"
    // });
    // marker.setMap(this.map);
  }

  // // stop watch position
  async stopTracking() {
    this.isTracking = false
    this.geosv.clearWatch()
  }

  // For test
  async loadmap1() {
    // add marker from https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    await this.loader.load().then(() => {
      let upos = { lat: 15.092554245899915, lng: 103.1328318432994 }
      let markers: google.maps.Marker[] = [];
      let markerlist = this.markerList
      let bermudaTriangle: google.maps.Polygon
      let areax = this.areacal
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;
      // let upos = this.upos
      // 1. create map
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: upos,
        zoom: 18,
        mapTypeId: 'satellite',
        // mapId: "test_map_id",
      });

      // 2. Create InfoWindow.
      let label: string = "<ion-icon name='person-outline' color='danger'></ion-icon> <ion-label color='primary'> คุณอยู่ที่นี่ </ion-label>"
      let infoWindow = new google.maps.InfoWindow({
        content: label,
        position: upos,
      });
      infoWindow.open(map);

      // 3 add marker
      // const marker = new google.maps.Marker({
      //   map,
      //   position: upos,
      //   title: 'KTD'
      // })

      document
        .getElementById("delete-markers")!
        .addEventListener("click", deleteMarkers);
      document
        .getElementById("show-markers")!
        .addEventListener("click", showMarkers);
      document
        .getElementById("hide-markers")!
        .addEventListener("click", hideMarkers);
      document
        .getElementById("show-polygon")!
        .addEventListener("click", showPolygon);

      // This event listener will call addMarker() when the map is clicked.
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        // console.log('event :', event.latLng)
        let x = JSON.stringify(event.latLng!.toJSON(), null, 2)
        x = JSON.parse(x)
        markerlist.push(x)
        console.log('markerlist :', markerlist)
        addMarker(event.latLng!);
      });

      // Adds a marker to the map and push to the array.
      function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
        const marker = new google.maps.Marker({
          position,
          map,
          // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          // icon: { url: 'assets/icon/fm64.png' }
          // id: 'marker_' + markerId
          label: labels[labelIndex++ % labels.length],
        });
        markers.push(marker);
      }

      // Sets the map on all markers in the array.
      function setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function hideMarkers(): void {
        setMapOnAll(null);
        hidePolygon()
      }

      // Shows any markers currently in the array.
      function showMarkers(): void {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers(): void {
        hideMarkers();
        markers = [];
        markerlist = []
        labelIndex = 0;
        console.log('markers', markers)
        console.log('markerlist', markerlist)
        console.log('labelIndex', labelIndex)
      }

      // แสดงขอบเขตแปลงที่วัด และคำนวณพื้นที่
      function showPolygon() {
        if (markerlist.length > 3) {
          // mesureStatus = 'stop'
          bermudaTriangle = new google.maps.Polygon({
            paths: markerlist,
            // editable: true,
            strokeColor: '#7FB5FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FEA49F',
            fillOpacity: 0.35,
            // draggable: true,
            // geodesic: false,
          });
          bermudaTriangle.setMap(map);
          setTimeout(() => {
            // mesureStatus = 'stop'
            let area = google.maps.geometry.spherical.computeArea(bermudaTriangle.getPath())
            console.log('area: ', area)
            area = area / 1600
            areax = area
            console.log('area rai : ', areax)
            alert('area rai:' + areax.toFixed(2))
            // return area;
          }, 500);
        } else {
          alert('กรุณาปักหมุดอย่างน้อย 3 ตำแหน่ง ก่อน')
        }
      }

      function hidePolygon() {
        bermudaTriangle.setMap(null);
      }


    })
  }

  // แสดงแผนที่แปลงอ้อย
  async loadmap() {

    console.log('markerlist before', this.markerList)

    await this.loader.load().then(() => {

      let upos = this.upos
      // let maxZoomService: google.maps.MaxZoomService;
      let markerlist = this.markerList
      let areax = this.areacal
      console.log('areax loader ', areax)
      let triangleCoords = this.triangleCoords
      let mesureStatus = this.mesureStatus
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;
      let markers: google.maps.Marker[] = [];
      let bermudaTriangle: google.maps.Polygon

      // 1. create map
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: upos,
        zoom: 16,
        mapTypeId: 'roadmap',
      });

      // 2. Create InfoWindow.
      let label: string = "<ion-icon name='person-outline' color='danger'></ion-icon> <ion-label color='primary'> คุณอยู่ที่นี่ </ion-label>"
      let infoWindow = new google.maps.InfoWindow({
        content: label,
        position: upos,
      });
      infoWindow.open(map);

      // form https://www.youtube.com/watch?v=Zxf1mnP5zcw
      map.addListener("click", function (event: any) {
        console.log('event.latlng ', event.latLng!)
        addMarker(event.latLng!);
      })

      function addMarker(props: any) {
        const marker = new google.maps.Marker({
          position: props,
          map,
        });
        markers.push(marker);
      }

      // map.addListener("click", (c) => {
      //   console.log('event.latlng ', event.latLng!)
      //   addMarker1(event.latLng!, event);
      // });

      // map.addListener("dblclick", deleteMarkers)

      // Adds a marker at the center of the map.
      // addMarker(upos);

      // add event listeners for the buttons
      // document
      //   .getElementById("show-markers")!
      //   .addEventListener("click", showMarkers);
      // document
      //   .getElementById("hide-markers")!
      //   .addEventListener("click", hideMarkers);
      document
        .getElementById("delete-markers")!
        .addEventListener("click", deleteMarkers1);
      document
        .getElementById("show-polygon")!
        .addEventListener("click", showPolygon1);

      // Adds a marker to the map and push to the array.
      function addMarker1(position: google.maps.LatLng | google.maps.LatLngLiteral, e: any) {
        const marker = new google.maps.Marker({
          position,
          map,
          label: labels[labelIndex++ % labels.length],
        });
        markers.push(marker);
        let x = JSON.stringify(e.latLng.toJSON(), null, 2)
        x = JSON.parse(x)
        markerlist.push(x)
      }

      // แสดงขอบเขตแปลงที่วัด และคำนวณพื้นที่
      function showPolygon1(markerlist: any) {
        if (markerlist.length > 2) {
          mesureStatus = 'stop'
          bermudaTriangle = new google.maps.Polygon({
            paths: markerlist,
            // editable: true,
            strokeColor: '#7FB5FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FEA49F',
            fillOpacity: 0.35,
          });
          bermudaTriangle.setMap(map);
          setTimeout(() => {
            mesureStatus = 'stop'
            let area = google.maps.geometry.spherical.computeArea(bermudaTriangle.getPath())
            console.log('area: ', area)
            area = area / 1600
            areax = area
            console.log('area rai : ', areax)
            alert('area rai:' + areax.toFixed(2))
            // return area;
          }, 500);
        } else {
          alert('กรุณาปักหมุดอย่างน้อย 3 ตำแหน่ง ก่อน')
        }
      }

      // Sets the map on all markers in the array.
      function setMapOnAll1(map: google.maps.Map | null) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function hideMarkers1(): void {
        console.log('hideMarkers')
        setMapOnAll1(null);
        // bermudaTriangle.setMap(null);
      }

      // Shows any markers currently in the array.
      function showMarkers1(): void {
        console.log('showMarkers')
        setMapOnAll1(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers1(): void {
        console.log('deleteMarkers')
        hideMarkers1();
        markers = [];
        markerlist = [];
        // triangleCoords = [];
        bermudaTriangle.setMap(null);
        console.log('marker..', markers, markerlist)
      }
    });

  }

  // วัดแปลงแบบ เดินมาร์คจุด
  async measurePlot() {

    // this.startTracking()

    await this.loader.load().then(() => {

      let upos = this.upos
      let markerlist = this.markerList
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;
      let mesureStatus = this.mesureStatus
      let markers: google.maps.Marker[] = [];
      let bermudaTriangle: google.maps.Polygon
      let areax = this.areacal
      let nowposition = this.marker
      console.log('nowposition on loader', nowposition)

      // 1. create map
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: upos,
        zoom: 16,
        mapTypeId: 'roadmap',
      });

      // Create the initial InfoWindow.
      let infoWindow = new google.maps.InfoWindow({
        content: "คุณอยู่ที่นี่",
        position: upos,
      });
      infoWindow.open(map);

      document
        .getElementById("addMarker")!
        .addEventListener("click", addMarker);
      document
        .getElementById("show-polygon")!
        .addEventListener("click", showPolygon);
      document
        .getElementById("delete-markers")!
        .addEventListener("click", deleteMarkers);

      // Adds a marker to the map and push to the array.
      function addMarker() {
        console.log('addMarker on measurePlot')
        console.log('nowposition addmarker', nowposition)
        const marker = new google.maps.Marker({
          position: upos,
          map,
          label: labels[labelIndex++ % labels.length],
        });
        // let x = JSON.stringify(e.latLng.toJSON(), null, 2)
        // x = JSON.parse(x)
        markerlist.push(upos)
        console.log('markerlist ', markerlist)
      }

      // แสดงขอบเขตแปลงที่วัด และคำนวณพื้นที่
      function showPolygon() {
        if (markerlist.length > 2) {
          mesureStatus = 'stop'
          bermudaTriangle = new google.maps.Polygon({
            paths: markerlist,
            // editable: true,
            strokeColor: '#7FB5FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FEA49F',
            fillOpacity: 0.35,
          });
          bermudaTriangle.setMap(map);
          setTimeout(() => {
            mesureStatus = 'stop'
            let area = google.maps.geometry.spherical.computeArea(bermudaTriangle.getPath())
            console.log('area: ', area)
            area = area / 1600
            areax = area
            console.log('area rai : ', areax)
            alert('area rai:' + areax.toFixed(2))
            // return area;
          }, 500);
        } else {
          alert('กรุณาปักหมุดอย่างน้อย 3 ตำแหน่ง ก่อน')
        }
      }

      // Sets the map on all markers in the array.
      function setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < markerlist.length; i++) {
          markerlist[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function hideMarkers(): void {
        console.log('hideMarkers')
        setMapOnAll(null);
        // bermudaTriangle.setMap(null);
      }

      // Shows any markers currently in the array.
      function showMarkers(): void {
        console.log('showMarkers')
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers(): void {
        console.log('deleteMarkers')
        hideMarkers();
        markers = [];
        markerlist = [];
        // triangleCoords = [];
        bermudaTriangle.setMap(null);
        console.log('marker..', markers, markerlist)
      }

    });

    // Configure the click listener.
    // map.addListener("click", (mapsMouseEvent: any) => {
    //   // Close the current InfoWindow.
    //   infoWindow.close();

    //   // Create a new InfoWindow.
    //   infoWindow = new google.maps.InfoWindow({
    //     position: mapsMouseEvent.latLng,
    //   });
    //   infoWindow.setContent(
    //     JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    //   );
    //   infoWindow.open(map);
    // });

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      icon: icon,
    });
    toast.present();
  }

  msMethod(t: string) {
    this.measureMethod = t;
  }

  setmesure(s: string) {
    this.mesureStatus = s
  }

  showMarkerList() {
    console.log('markerList', this.markerList)
    console.log('areacal ', this.areacal)
  }

  // test from web with drawing tool
  testMap() {

    let upos = this.upos
    var drawingManager: any;
    var selectedShape: any;
    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
    var selectedColor;
    var colorButtons: any = {};

    function clearSelection() {
      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
      }
    }

    function setSelection(shape: any) {
      clearSelection();
      selectedShape = shape;
      shape.setEditable(true);
      selectColor(shape.get('fillColor') || shape.get('strokeColor'));
      google.maps.event.addListener(shape.getPath(), 'set_at', calcar);
      google.maps.event.addListener(shape.getPath(), 'insert_at', calcar);
    }

    function calcar() {
      let showarea = document.getElementById("area") as HTMLElement
      var area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
      showarea.innerHTML = "Area =" + area;
    }

    function deleteSelectedShape() {
      if (selectedShape) {
        selectedShape.setMap(null);
      }
    }

    function selectColor(color: any) {
      selectedColor = color;
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
      }

      // Retrieves the current options from the drawing manager and replaces the
      // stroke or fill color as appropriate.
      var polylineOptions = drawingManager.get('polylineOptions');
      polylineOptions.strokeColor = color;
      drawingManager.set('polylineOptions', polylineOptions);

      var rectangleOptions = drawingManager.get('rectangleOptions');
      rectangleOptions.fillColor = color;
      drawingManager.set('rectangleOptions', rectangleOptions);

      var circleOptions = drawingManager.get('circleOptions');
      circleOptions.fillColor = color;
      drawingManager.set('circleOptions', circleOptions);

      var polygonOptions = drawingManager.get('polygonOptions');
      polygonOptions.fillColor = color;
      drawingManager.set('polygonOptions', polygonOptions);
    }

    function setSelectedShapeColor(color: any) {
      if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShape.set('strokeColor', color);
        } else {
          selectedShape.set('fillColor', color);
        }
      }
    }

    function makeColorButton(color: any) {
      var button = document.createElement('span');
      button.className = 'color-button';
      button.style.backgroundColor = color;
      google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color);
        setSelectedShapeColor(color);
      });

      return button;
    }

    function buildColorPalette() {
      var colorPalette = document.getElementById('color-palette') as HTMLElement;
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        var colorButton = makeColorButton(currColor);
        colorPalette.appendChild(colorButton);
        colorButtons[currColor] = colorButton;
      }
      selectColor(colors[0]);
    }

    function initialize() {
      var map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 10,
        center: upos,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true
      });

      var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
      };
      // Creates a drawing manager attached to the map that allows the user to draw
      // markers, lines, and shapes.
      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        markerOptions: {
          draggable: true
        },
        polylineOptions: {
          editable: true
        },
        rectangleOptions: polyOptions,
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: map
      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e: any) {
        if (e.type != google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          drawingManager.setDrawingMode(null);

          // Add an event listener that selects the newly-drawn shape when the user
          // mouses down on it.
          var newShape = e.overlay;
          newShape.type = e.type;
          google.maps.event.addListener(newShape, 'click', function () {
            setSelection(newShape);
          });
          let showarea = document.getElementById("area") as HTMLElement
          var area = google.maps.geometry.spherical.computeArea(newShape.getPath());
          showarea.innerHTML = "Area =" + area;
          setSelection(newShape);
        }
      });

      // Clear the current selection when the drawing mode is changed, or when the
      // map is clicked.
      google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
      google.maps.event.addListener(map, 'click', clearSelection);
      google.maps.event.addDomListener(document.getElementById('delete-button') as HTMLElement, 'click', deleteSelectedShape);

      buildColorPalette();
    }
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'walk') {
      this.walkP = true;
      this.markP = false;
    } else if (event.detail.value === 'mark') {
      this.markP = true;
      this.walkP = false;
    }
    // setTimeout(() => {
    //   this.loadmap1();
    // }, 1000);
  }

}
