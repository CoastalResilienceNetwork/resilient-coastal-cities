// #########################################################
// // main js file for the Hudson River web mapping application
// // ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// // esri api calls
require([
      "esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/renderers/UniqueValueRenderer","esri/symbols/SimpleFillSymbol",
      "esri/Graphic","esri/layers/GraphicsLayer","esri/tasks/QueryTask","esri/tasks/support/Query","esri/widgets/BasemapToggle","dojo/dom",
      "esri/widgets/Search","esri/views/SceneView","dojo/domReady!"
    ], function(
      Map,MapView,FeatureLayer,UniqueValueRenderer,SimpleFillSymbol,Graphic,GraphicsLayer,QueryTask,
      Query,BasemapToggle,dom, Search, SceneView
    ) { 
        // global variables 
        // admin units feature layer
        var layer = new FeatureLayer({
            url: "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer/70",
            outFields: ["*"]
        });
         // create map object
        var map = new Map({
            basemap: "streets",
            layers: [layer]
        });
        let app = {} // main object for the application
        // init config 
        // app.config = {
        //     mapView: null,
        //     sceneView: null,
        //     activeView: null,
        //     container: "map" // use same container for views
        // };
        // // init params
        // app.initialViewParams = {
        //         zoom: 12,
        //         center: [110.41, -7.0],
        //         container: app.config.container,
        //         map:map
        // };
        // // create 2D view and and set active
        // app.config.mapView = createView(app.initialViewParams, "2d");
        // // app.config.mapView.map = webmap;
        // app.config.activeView = app.config.mapView;

        // // create 3D view, won't initialize until container is set
        // app.initialViewParams.container = null;
        // // app.initialViewParams.map = scene;
        // app.config.sceneView = createView(app.initialViewParams, "3d");
        // // convenience function for creating a 2D or 3D view
        // function createView(params, type) {
        //     var view;
        //     var is2D = type === "2d";
        //     if (is2D) {
        //       view = new MapView(params);
        //       return view;
        //     } else {
        //       view = new SceneView(params);
        //     }
        //     return view;
        // }
        // apdaptaions solutions button click
        $('#yn2').on('click', function(evt){
            $('#adaptationContentWrapper').show()
            $('#floodRiskContentWrapper').hide()
            // switchView('3d')
        })
        // flood risk button click
        $('#yn1').on('click', function(evt){
            $('#floodRiskContentWrapper').show()
            $('#adaptationContentWrapper').hide()
            // switchView('2d')
        })
        // // swithc view from 2d to 3d and vice versa
        // function switchView(type){
        //     console.log(type);
        //     // remove the reference to the container for the previous view
        //     app.config.activeView.container = null;
        //     if(type === '2d'){
        //         app.config.mapView.viewpoint = app.config.activeView.viewpoint.clone();
        //         app.config.mapView.container = app.config.container;
        //         app.config.activeView = app.config.mapView;
        //         app.viewMode = "2d";
        //     }else{
        //         app.config.sceneView.viewpoint = app.config.activeView.viewpoint.clone();
        //         app.config.sceneView.container = app.config.container;
        //         app.config.activeView = app.config.sceneView;
        //         app.viewMode = "3d";
        //     }
        // }





        // map view, new in js 4x api
        var view = new MapView({
            container: "map",
            map: map,
            center: [110.41, -7.0],
            zoom: 12
        });
        //search widget
        var searchWidget = new Search({
            view: view
        });
        // Add the search widget to the top right corner of the view
        view.ui.add(searchWidget, {
            position: "top-right"
        });
         // basemap toggle
        var basemapToggle = new BasemapToggle({
          view: view,  // The view that provides access to the map's "streets" basemap
          nextBasemap: "hybrid"  // Allows for toggling to the "hybrid" basemap
        });
        view.ui.add(basemapToggle, "top-right");
        // call the other functions once the esri objects have been created
        query();
        onClick();
        https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&filterSource=northern-java
        var url = ' https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&filterSource=northern-java&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
        var startDate = '2018-02-01'
        var endDate = '2018-05-20'
        getFloodEvents(url, startDate, endDate);
        function getFloodEvents(url,startDate, endDate){
            $.get( url, function( data ) {
                $.each(data.events, function(i,v){
                    if(v.location.geonameid == '1627893'){
                        // console.log(v);
                        // var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
                    }
                })
            })
        }
        var tagsJson = getTagsFromEvents('1627893')
        function getTagsFromEvents(parentGeonameid){
            // console.log(parentGeonameid);
            var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
            $.get(url, function(data) {
                app.finalAdminUnitTags = []
                var defer = $.Deferred(),
                filtered = defer.then(function(){
                    return data;
                })
                defer.resolve();
                filtered.done(function(data){
                    // loop through tags geojson and match to our admin unit ID's
                    $.each(data.features, function(i,v){
                        var id = v.properties.geonameid;
                        var index = app.adminUnitId.indexOf(id);
                        if(index > 0){
                            pos = app.adminUnit.map(function(e) { return e.attributes.geonameid; }).indexOf("(1:" + id +")");
                            if(pos > -1){
                                // var geom = app.adminUnit[pos]['geometry']
                                var geom = app.adminUnit[pos].geometry
                                var atts = app.adminUnit[pos].attributes
                                var total = v.properties.total
                                buildGraphic(geom,atts, total)

                            }else{
                                ''
                            }
                            
                        }else{
                            // there was no match
                        }

                    })
                })
            })

        }
        // build polygon graphics of admin units symbolized by color based on the num of total tags
        function buildGraphic(geom,atts, total){
            console.log(atts)
            atts.total = total;
            geom.type = 'polygon'
            var polygon = {
                type: "polygon",
                rings: geom.rings
            }
            var color;
            var color1 = [115, 255, 222,0.6]
            var color2 = [82, 227, 217,0.6]
            var color3 = [54, 182, 199,0.6]
            var color4 = [13, 80, 143,0.6]
            if(total == 1){
                color = color1
            }else if(total > 1 && total <= 5){
                color = color2
            }else if(total > 5 && total <= 10){
                color = color3
            }else if(total > 10){
                color = color4
            }
            // Create a symbol for rendering the graphic
            var fillSymbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: color,
                outline: { // autocasts as new SimpleLineSymbol()
                  color: [13, 80, 143],
                  width: .5
                }
            };
            app.graphic2 = new Graphic({
                //gotta set a defined geometry for the symbol to draw
                geometry: geom,
                symbol: fillSymbol,
                attributes: atts
            });
            app.layer = new GraphicsLayer({
                graphics: [app.graphic2]
            });
            console.log(app.layer)

            map.add(app.layer);
            app.layer.on('click', function(evt){
                console.log(evt);
            })
            // view.graphics.add(app.graphic2);
        }
        // query //////////////////////////////////////////////////////
        function query(){
            //  // query task
            // var qt = new QueryTask({
            //     url: "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer/70"
            // })
            // // query all the features in the admin units feature class
            // var query = new Query({
            //     where: "OBJECTID > 0",
            //     outFields: ["*"],
            //     returnGeometry: true,
            // });
            // // execute function to return object of all admin units
            // qt.execute(query).then(function(result){
            //     console.log(result)
            //     app.allAdminAtts = result.features;
            //     app.atts = result.features[13]["geometry"]
            //     buildGraphic()
            // })
            // function buildGraphic(){
            //     var graphic = new Graphic({
            //     //gotta set a defined geometry for the symbol to draw
            //     geometry: app.atts,
            //     symbol: new SimpleFillSymbol({
            //         color: [255,255,0,0.3],
            //         style: "solid",
            //         outline: {
            //             color: [102,0,204],
            //             width: 4
            //             }
            //         })
            //     });
            //     view.graphics.add(graphic);
            // }
        }
        // on map/view click function ////////////////////////////////////////////////
        function onClick(){
            //let's get a popup graphic on click:'
            view.on("click", function(evt) {
                var screenPoint = {
                    x: evt.x,
                    y: evt.y
                };
                view.hitTest(screenPoint)
                    .then(getGraphics);
            });
            function getGraphics(response){
                view.graphics.removeAll(graphic);
                var graphic = new Graphic({
                  //gotta set a defined geometry for the symbol to draw
                  geometry: response.results[0].graphic.geometry,
                  symbol: new SimpleFillSymbol({
                     color: [255,255,0,0.0],
                     style: "solid",
                     outline: {
                          color: [102,0,204],
                          width: 2
                         }
                    })
                });
               view.graphics.add(graphic);
            }
        }

        // get js utm time
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var newdate = year + "-" + month + "-" + day;
        app.eventsGeoId = [];
        app.adminUnitId = [];
        app.adminUnit = [];
        $.each(adminUnits, function(i,v){
            app.adminUnit.push(v);
            let id = String(v.attributes.geonameid.split(':')[1].split(')')[0])
            let n = id.includes(",");
            if(n){
                id = id.split(',')
                $.each(id, function(i,v){
                    id =v;
                    app.adminUnitId.push(String(id));
                })
            }else{
                app.adminUnitId.push(id)
            }
        })

        // var url = "https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        var url = "https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        $.get( url, function( data ) {
            var defer = $.Deferred(),
                filtered = defer.then(function() {
                    $.each(data.features, function(i,v){
                        try{
                            if(v.properties.geonameid){
                                app.eventsGeoId.push(String(v.properties.geonameid));
                            }
                        }catch(e){
                        }
                    })
                    return app.eventsGeoId
                });
                defer.resolve();
            filtered.done(function( value ) {
                var duplicates = app.adminUnitId.filter(function(val) {
                  return app.eventsGeoId.indexOf(val) != -1;
                });
            });
        })


        
        
        // // console.log(app.eventsGeoId);
        // // console.log(app.adminUnitId);
        // $.each(app.adminUnitId, function(i,v){
        //     let index = app.eventsGeoId.indexOf(v)
        //     // console.log(index, v);
        //     if(index > 0){
        //         // console.log('yes', v);
        //     }
        // })

        // var duplicates = app.adminUnitId.filter(function(val) {
        //   return app.eventsGeoId.indexOf(val) != -1;
        // });

        // console.log(duplicates, 'yyyyy');
        // var duplicates = app.eventsGeoId.filter(function(val) {
        //   return app.adminUnitId.indexOf(val) != -1;
        // });

        // console.log(duplicates, 'xxxxx');
        // use this url with the parent id for tag querying
        //var url = https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe
        

        // console.log(app.allAdminAtts);
        // var url = "https://api.floodtags.com/v1/tags/fews-world/geojson?until=" + newdate + "&since=2018-03-06&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        var url = "https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        // $.get( url, function( data ) {
        //     app.matchArray = [];

        //     // loop through events
        //     $.each(data.events, function(i,v){
        //         // use filter source to only get data from norther-java, indo
        //         let index = v.filterSources.indexOf('northern-java')
        //         if (index>-1) {
        //             app.matchArray.push(v.location.geonameid);
        //         }
        //     })
      
}) // end of the require function /////////////////////////////////////








// // #########################################################
// // main js file for the Hudson River web mapping application
// // ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// // esri api calls
// var app = {}; // main app object
// app.visibleLayers = [0,1];
// app.layerDefinitions  = [];
// app.appMode = 'main';
// require(["esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/TextSymbol",
//     "esri/symbols/Font", "esri/Color", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol",
//         "esri/renderers/SimpleRenderer", "esri/graphic","esri/geometry/Point","esri/SpatialReference", "esri/dijit/Search", "esri/dijit/Legend", "esri/dijit/BasemapToggle","esri/tasks/locator","esri/geometry/webMercatorUtils","dojo/domReady!"], 
// function(Map, ArcGISDynamicMapServiceLayer, Query, QueryTask, TextSymbol, Font, Color, Extent, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,SimpleMarkerSymbol,
//         SimpleRenderer, Graphic,Point, SpatialReference, Search, Legend, BasemapToggle, Locator, webMercatorUtils) {
//     // esri map  //////////////////////////////////////////////////////////////////////////////////////////////////////
//      var map = new Map("map", {
//         basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
//         center: [-73.9, 42.05], // lon, lat
//         zoom: 8,
//         sliderPosition: "top-right"
//      });

//      // code for ESRI search/////////////////////////////////////////
//      var search = new Search({
//         map: map
//      }, "search");
//      search.startup();
//      // code for ESRI basemap //////////////////////////////
//      var toggle = new BasemapToggle({
//         map: map,
//         basemap: "satellite"
//       }, "BasemapToggle");
//       toggle.startup();
//       //add the legend ////////////////////////////////////////////////////////////////////////////////////////
//       var legendLayers =[];
//       legendLayers.push({title: ' ' });

//       var legend = new Legend({
//         map: map,
//         // layerInfos: legendLayers
//         // layerInfos: legendLayers
//       }, "legendDiv");
//       legend.startup();
//       // geolocator startup
//       var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
//         // add feature layer for add own layers
//         // app.addOwnProjectLayerURL = 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/addNewProject_hudsonRiver_1/FeatureServer/0?token=zi4R08fm5788FKE9BizJSJIthDevbPfaMlIneRqZQg3hYkQzyEjVmDolEeV4qhsxLrRtWTXGJT8m8jjgXvBwmKZJ8-IPg5PwVybeGHd08_mfwBZF2isJXD9FHSnZXN4d-1UwIMo-k3XYR51cjIADIBYyEVXrJh0e7AxFK2csMMRex2eIV8eslxp_Ukt7jRwYgdimiSAwT4S6EGq3kWGJ4VzNJ1WXcJEZdetO2k1Ucy29j1-18z-VQ7lWOXJ8RPBP'
//         // app.addOwnProjectLayer = new FeatureLayer(app.addOwnProjectLayerURL, {
//         //       mode: FeatureLayer.MODE_ONDEMAND,
//         //       outFields: ["*"]
//         // });
//         // map.addLayer(app.addOwnProjectLayer);
//         // app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes'");


//     // Add dynamic map service
//     app.url = "https://cumulus.tnc.org/arcgis/rest/services/nascience/HudsonRiverMapService/MapServer"
//     var dynamicLayer = new ArcGISDynamicMapServiceLayer(app.url, {opacity:0.7});

//     // on dynamic layer load ////////////////////////////////////////////////////////////////////////////////////////////////
//     dynamicLayer.on("load", function () {
//         dynamicLayer.setVisibleLayers(app.visibleLayers);
//         map.addLayer(dynamicLayer); // add dynamic layer
//     });

//     // on map load ////////////////////////////////////////////////////////////////////////////////////////////
//      map.on("load", function() {
//         // $('#legendDiv').children().first().find('.esriLegendServiceLabel').html('change the title');
//         // console.log('hey')
//         map.enableScrollWheel();
//         map.on("mouse-over", function(e){
//             map.setMapCursor("pointer");
//         })
//         map.on("mouse-out", function(e){
//         })
//         // on map click /////////////////////////////////////////////////////////
//         map.on("click", function(e){
//             // when in main map mode //////////////////
//             if(app.appMode == 'main'){
//                 // query the map for features
//                 var pnt = e.mapPoint;
//                 app.pnt = e.mapPoint;
//                 console.log(pnt)
//                 var centerPoint = new esri.geometry.Point(pnt.x,pnt.y,pnt.spatialReference);
//                 var mapWidth = map.extent.getWidth();
//                 var mapWidthPixels = map.width;
//                 var pixelWidth = mapWidth/mapWidthPixels;
//                 var tolerance = 10 * pixelWidth;
//                 var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, pnt.spatialReference);
//                 var p = ext.centerAt(centerPoint);
//                 //start of query ///////////////////////////////////////////////////////////////////////
//                 var q = new Query();
//                 var qt = new QueryTask(app.url + "/0");
//                 q.geometry = p;
//                 q.returnGeometry = true;
//                 q.outFields = ["*"];
//                 // execute query ///////////////////
//                 // test to see if the project layers is being displayed. if it is execute query
//                 var index = app.visibleLayers.indexOf(0)
//                 if (index > -1) {
//                     qt.execute(q);
//                 }
//                 // query on complete
//                 qt.on('complete', function(evt){
//                     map.graphics.clear();
//                     // new markey symbol used for selected features
//                     var markerSymbol = new SimpleMarkerSymbol();
//                     markerSymbol.setColor(new Color("#00FFFF"));
//                     markerSymbol.setSize(12);
//                      // if info returned from query
//                     if(evt.featureSet.features.length > 0){
//                         app.atts = evt.featureSet.features[0].attributes;
//                         app.items = $("#bottomPopupWrapper").find(".popupItems")
//                         // add the selected feature graphic
//                         map.graphics.add(new Graphic(evt.featureSet.features[0].geometry, markerSymbol));
//                         // slide down bottom popup
//                         $("#bottomPopupWrapper").slideDown();
//                         // clean attributes function
//                         var cleanAtts = function(val){
//                             if (val.length <= 1 ) {
//                                 val = "N/A"
//                                 return val
//                             }else{
//                                 return val;
//                             }
//                         }
//                         // populate the html with the correct attributes 
//                         var title = evt.featureSet.features[0].attributes.Project_Title
//                         $("#popupHeaderTitle").html(title);
//                         // set the attributes for each attribute span
//                         $(app.items[0]).find('span').html(cleanAtts(app.atts.Project_Type))
//                         $(app.items[1]).find('span').html(cleanAtts(app.atts.Project_Description))
//                         $(app.items[2]).find('span').html(cleanAtts(app.atts.Stakeholder))
//                         $(app.items[3]).find('span').html(cleanAtts(app.atts.Name))
//                         $(app.items[4]).find('span').html(cleanAtts(app.atts.Jurisdiction))
//                         $(app.items[5]).find('span').html(cleanAtts(app.atts.County))
//                         $(app.items[6]).find('span').html(cleanAtts(app.atts.Location))
//                     }else{
//                         // slide up bottom popup
//                         $("#bottomPopupWrapper").slideUp();
//                     }
//                 })
//             // when in submit your own project mode /////////////////
//             } else if(app.appMode == 'submit'){
//                 console.log('submit');
//                 // use the loc var below to geolocate sddresses on map click. use that to populate some of the form.
//                 var loc = locator.locationToAddress(e.mapPoint, 100, function(t){
//                     console.log(t);
//                     var mp = webMercatorUtils.webMercatorToGeographic(e.mapPoint);
//                     var lat_long = mp.x + ' ' + mp.y;
//                     $('#formItem6').val(lat_long);
//                     $('#formItem7').val(t.address.City);
//                     // $('#formItem8').val(t.address.Type);
//                     $('#formItem9').val(t.address.Subregion);
//                 });
//                 // map.on("location-to-address-complete"){}
//                 // console.log(loc)
//                 // console.log(loc[results])
//                 // console.log(loc.results[0]);
//                 // console.log(loc.results[0].type);
                
//             }else{
//                 console.log('there is a problem with the map mode variable')
//             }
            
//         })
//      })

//     // when document is ready //////////////////////////////////////////////////////////////////////////////////////////////////
//     // html code goes here
//     $( document ).ready(function() {
//         // build opacity slider and on slide change map opacity //////
//         $("#sldr").slider({ min: 0, max: 100, range: false, values: [30], slide: function(e, ui){
//             dynamicLayer.setOpacity(1 - ui.value/100);
//         } })
//         // on cb clicks add and remoce layers /////////////////
//         $('.cbWrapper input').click(function(c){
//             var layerId = parseInt(c.currentTarget.id.split('-')[1]);
//             // click on all projects cb and slide down filter cb's
//             if(layerId == 0){
//                 // test if cb is checked
//                 if (c.currentTarget.checked) {
//                     $(".cb_wrapper_indent").slideDown();
//                     app.layerDefinitions[0] =  app.finalDeff;
//                     dynamicLayer.setLayerDefinitions(app.layerDefinitions);
//                 }else{
//                     $(".cb_wrapper_indent").slideUp();
//                     app.layerDefinitions[0] =  "projectType_web = 'null'"
//                     dynamicLayer.setLayerDefinitions(app.layerDefinitions);
//                 }
//             }
//             // if cb checked push viz layers into viz layers array
//             if(c.currentTarget.checked){
//                 app.visibleLayers.push(layerId)
//             }else{
//                 var index = app.visibleLayers.indexOf(layerId)
//                 if (index !== -1) app.visibleLayers.splice(index, 1);
//             }
//             // call the legend refresh to add or remove layers from the legend.
//             legend.refresh();
//             // remove legend if there are no layers checked
//             if (app.visibleLayers.length >=1) {
//                 $('.legendDivWrapper').show();
//             }else{
//                 $('.legendDivWrapper').hide();
//                 $('.dummyLegendHeader').hide();

//             }
//             // update the viz layers showing on the map
//             dynamicLayer.setVisibleLayers(app.visibleLayers);
//         })
//         // all project filter check boxes /////////////////////////////////////////////////////////////////////////////////////////
//         $('.cb_wrapper_indent input').click(function(c){
//             var id  = c.currentTarget.id
//             app.layerDeffs = ["projectType_web = 'Habitat'","projectType_web = 'Recreation and Access'", "projectType_web = 'Community Infrastructure'", "projectType_web = 'Multiple'"]
//             app.finalDeff = ''
//             // find out which cb's are checked
//             $.each($('.cb_wrapper_indent input'), function(i,v){
//                 if(!$(v)[0].checked){
//                     id  = "projectType_web = '" + $(v)[0].id + "'"
//                     var index =  app.layerDeffs.indexOf(id)
//                     if (index > -1) {
//                         app.layerDeffs.splice(index, 1)
//                     }
//                     // loop through layer defs and build the final def string
//                     $.each(app.layerDeffs, function(i,v){
//                         if (i < 1) {
//                             app.finalDeff = app.layerDeffs[0]
//                         }else{
//                             app.finalDeff += " OR " + app.layerDeffs[i]
//                         }
//                     })
//                 }
//             })
//             // set layer def to null to display no layers if all cb's are unchecked
//             if(app.layerDeffs.length < 1){
//                 app.finalDeff = "projectType_web = 'null'";
//             }
//             // set layer defs and update the mask layer /////////////////////
//             app.layerDefinitions = [];
//             app.layerDefinitions[0] =  app.finalDeff
//             dynamicLayer.setLayerDefinitions(app.layerDefinitions);
//         })
//         // on add new project button click ///////////////////////////////////////////////////
//         $('#addOwnProject').click(function(c){
//             $(".mainContentWrapper").slideUp();
//             $(".addNewContentWrapper").slideDown();
//             app.appMode = 'submit' // change app mode to submit
//         })
//         // on add new project button click ///////////////////////////////////////////////////
//         $('#backToMain').click(function(c){
//             $(".mainContentWrapper").slideDown();
//             $(".addNewContentWrapper").slideUp();
//             app.appMode = 'main' // change app mode to submit
//         })
//         // on new project submit button click //////////////////////////////////////////////
//         $("#submitButton").click(function(c){
//             var formArray = [];
//             // collect all the inputs from the form
//             var item1 = $( "#formItem1" ).val();
//             var item2 = $( "#formItem2" ).val();
//             var item3 = $( "#formItem3" ).val();
//             var item3 = "Community Infrastructure"

//             var item4 = $( "#formItem4" ).val();
//             var item5 = $( "#formItem5" ).val();
//             var item6 = $( "#formItem6" ).val();
//             var item7 = $( "#formItem7" ).val();
//             var item8 = $( "#formItem8" ).val();
//             var item9 = $( "#formItem9" ).val();
//             formArray.push(item1, item2)
//             // split item 6 to get the lat long values
//             item6 = item6.split(' ')
//             var lat = parseFloat(5275704.371526124)
//             var long = parseFloat(-8429816.546952119)
//             // use this code while on the S3 bucket
//             // var lat = parseFloat(item6[1])
//             // var long = parseFloat(item6[0])

//             // use this code below to add attributes and geometry to the projects layer when adding new porokects
//             var obj = { user_name:item1, project_name:item2, project_type:item3, project_desc:item4, stakeholder: item5, jur_name:item7, county: item9, lat:lat, long:long, display_on_web:'no'}
//             var spatialReference = new SpatialReference ({spatialReference:{wkid: 102100, latestWkid: 3857}})
//             var pt = new Point({x:long,y:lat,spatialReference:{wkid: 102100, latestWkid: 3857}})
//             var sms = new SimpleMarkerSymbol().setStyle(
//                 SimpleMarkerSymbol.STYLE_SQUARE).setColor(
//                 new Color([255,0,0,0.5]));

//             var incidentGraphic = new Graphic(pt,sms, obj);
//             // apply a def query to the add own project layer feature layer
//             // app.addOwnProjectLayer.setDefinitionExpression("user_name<>'mark'");
//             // app.addOwnProjectLayer.setDefinitionExpression("user_name='mark'");
//             // app.addOwnProjectLayer.setDefinitionExpression("Project_Type='Habitat'");
//             // app.addOwnProjectLayer.setDefinitionExpression("display_on_web='yes'");

//             // apply edits to the feature layer here
//             app.addOwnProjectLayer.applyEdits([incidentGraphic], null, null, function(e){
//                 console.log(e);
//                 // console.log('There was an error adding the data!! Please check field data types')
//             });
//         })

//         // header collapse functionality
//         $('.cbHeader').on('click', function(e){
//             // check to see the height of the next cbWrapper
//             // if its open close it, change text to show
//             if($(e.currentTarget).next().is(':visible')){
//                 $(e.currentTarget).next().slideUp();
//                 $(e.currentTarget).find('span').html('Show')
//             }else{ // else open it, chnage text to collapse
//                 $(e.currentTarget).next().slideDown();
//                 $(e.currentTarget).find('span').html('Collapse')
//             }
//         })
//         // close attribute popup on close click and clear map graphics
//         $('.popupHeaderCloseWrapper').on('click', function(e){
//              map.graphics.clear();
//             $("#bottomPopupWrapper").slideUp();
//         })
//         // minimize attribute and legend popup on click
//         $('.popupMinWrapper').on('click', function(e){
//             var elem = $(e.currentTarget).parent().next();
//             var tar = $(e.currentTarget)
//             var h = $(elem).is(":visible");
//             if(elem[0].id != 'legendDiv'){
//                 if(h){
//                     $(elem).slideUp();
//                     $(tar).show();
//                     $(tar).css('transform', 'rotate(180deg)')
//                 }else{
//                     $(elem).slideDown();
//                     $(tar).css('transform', 'rotate(360deg)')
//                 }
//             }else{
//                 if(h){
//                     $(e.currentTarget).parent().parent().slideUp()
//                     $('.dummyLegendHeader').show();
//                 }
//             }
//         })
//          // header mouse over functionality
//         $('.cbHeader').on('mouseover', function(e){
//             // add blue font class to span
//             $(e.currentTarget).find('span').css('color', '#2F6384')
//         })
//         $('.cbHeader').on('mouseout', function(e){
//             $(e.currentTarget).find('span').css('color', '#f3f3f3')
//             // remove blue font class to span
//         })
//         // on doc click
//         $(document).on('click', function (e) {
//         // Do whatever you want; the event that'd fire if the "special" element has been clicked on has been cancelled.
//             var c = $(e.target).attr('class')
//             if(c){
//                  var i = c.indexOf('hamburgerClick')
//             }
//             if(i > -1){
//                 $('.dropdownMenu').slideDown();
//             }else{
//                 $('.dropdownMenu').slideUp();
//             }
//         });
//     });

// }); // end of main require function
