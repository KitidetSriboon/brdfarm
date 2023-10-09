import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GlobalConstants } from 'src/app/global-constants';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-for-test',
  templateUrl: './for-test.page.html',
  styleUrls: ['./for-test.page.scss'],
})
export class ForTestPage implements OnInit {

  yearCr?: string = GlobalConstants.yearCr
  upos = { lat: 15.228581111646495, lng: 103.07182686761979 };  // พิกัด BRR
  polygon: any;
  markerList?: any = [];
  triangleCoords?: any = [];
  center = { lat: 15.228581111646495, lng: 103.07182686761979 }
  loader = new Loader({
    apiKey: environment.mapkey,
    version: 'weekly',
    // libraries: ["places"],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private firebase: FirebaseService,
    private geosv: GeolocationService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getGeolocation()
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
      this.loadmap()
      // this.testMap()
    })
  }

  // แสดงแผนที่แปลงอ้อย
  async loadmap() {

    await this.loader.load().then(() => {

      let upos = this.upos
      // let maxZoomService: google.maps.MaxZoomService;
      let markerlist = this.markerList
      let triangleCoords = this.triangleCoords
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;
      let markers: google.maps.Marker[] = [];
      let bermudaTriangle: google.maps.Polygon
      // maxZoomService = new google.maps.MaxZoomService();

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

      map.addListener("click", (mapsMouseEvent: any) => {
        let x: any;
        x = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        x = JSON.parse(x)
        // console.log('JSON.parse(x)', x)

        // let myLatLng: any = x;
        let lat = x.lat;
        let lng = x.lng;
        markerlist.push({ lat: lat, lng: lng })
        console.log('markerlist', markerlist)
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          label: labels[labelIndex++ % labels.length],
          // zIndex: i,
        });

      })

      // map.addListener("click", (event: google.maps.MapMouseEvent) => {
      //   console.log('event.latlng ', event.latLng!)
      //   addMarker(event.latLng!);
      // });

      // Adds a marker at the center of the map.
      // addMarker(upos);

      // Adds a marker to the map and push to the array.
      function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
        console.log('addMarker')
        console.log('position lat', position.lat)
        const marker = new google.maps.Marker({
          position,
          map,
          label: labels[labelIndex++ % labels.length],
        });

        console.log('markers ', markers)
        markers.push(marker);

        triangleCoords.push(position)
        console.log('triangleCoords ', triangleCoords)
        if (triangleCoords.length > 2) {
          bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            editable: true,
            strokeColor: '#7FB5FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FC5951',
            fillOpacity: 0.35,
          });
          // คำนวณพื้นที่จาก ตรม. เป็นไร่
          let area = google.maps.geometry.spherical.computeArea(bermudaTriangle.getPath()) / 1600
          console.log('area: ', area)
          console.log('area rai: ', area.toFixed(2) + ' ไร่')
          bermudaTriangle.setMap(map);
        }
      }

      // add event listeners for the buttons
      document
        .getElementById("show-polygon")!
        .addEventListener("click", showPolygon);
      document
        .getElementById("show-markers")!
        .addEventListener("click", showMarkers);
      document
        .getElementById("hide-markers")!
        .addEventListener("click", hideMarkers);
      document
        .getElementById("delete-markers")!
        .addEventListener("click", deleteMarkers);

      // แสดงขอบเขตแปลงที่วัด และคำนวณพื้นที่
      function showPolygon() {
        let plg = markerlist
        console.log('markerlist :', plg)

        bermudaTriangle = new google.maps.Polygon({
          paths: plg,
          // editable: true,
          strokeColor: '#7FB5FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FC5951',
          fillOpacity: 0.35,
        });
        bermudaTriangle.setMap(map);
        // calarea(bermudaTriangle)
        setTimeout(() => {
          let area = google.maps.geometry.spherical.computeArea(bermudaTriangle.getPath())
          console.log('area: ', area)
          area = area / 1600
          console.log('area rai : ', area)
        }, 500);

      }

      function calarea(polygon: any) {
        console.log('polygon : ', polygon)
        // คำนวณพื้นที่จาก ตรม. เป็นไร่
        // var area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
        let area = google.maps.geometry.spherical.computeArea(polygon.getPath())
        console.log('area: ', area)
        // area = area  / 1600
        // console.log('area rai: ', area.toFixed(2) + ' ไร่')
      }

      // Sets the map on all markers in the array.
      function setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
        // for (let i = 0; i < markerlist.length; i++) {
        //   markerlist[i].setMap(map);
        // }
      }

      // Removes the markers from the map, but keeps them in the array.
      function hideMarkers(): void {
        console.log('hideMarkers')
        setMapOnAll(null);
        bermudaTriangle.setMap(null);
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
        triangleCoords = [];
        bermudaTriangle.setMap(null);
      }

    });
  }

  // test from web
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

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      icon: icon,
    });
    toast.present();
  }




}
