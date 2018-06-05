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
            url: "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer/73",
            outFields: ["*"]
        });
         // create map object
        var map = new Map({
            basemap: "streets",
            layers: [layer]
        });
        var app = {} // main object for the application
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
        // // apdaptaions solutions button click
        // $('#yn2').on('click', function(evt){
        //     $('#adaptationContentWrapper').show()
        //     $('#floodRiskContentWrapper').hide()
        //     // switchView('3d')
        // })
        // // flood risk button click
        // $('#yn1').on('click', function(evt){
        //     $('#floodRiskContentWrapper').show()
        //     $('#adaptationContentWrapper').hide()
        //     // switchView('2d')
        // })
        // // // swithc view from 2d to 3d and vice versa
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
        getEvents();
        query();
        onClick();
        // onEventClick();

        
        // https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&filterSource=northern-java
        // var url = ' https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&filterSource=northern-java&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
        // var startDate = '2018-02-01'
        // var endDate = '2018-05-20'
        // getFloodEvents(url, startDate, endDate);
        // function getFloodEvents(url,startDate, endDate){
        //     $.get( url, function( data ) {
        //         $.each(data.events, function(i,v){
        //             if(v.location.geonameid == '1627893'){
        //                 // console.log(v);
        //                 // var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
        //             }
        //         })
        //     })
        // }


        // var tagsJson = getTagsFromEvents('1627893')
        // function getTagsFromEvents(parentGeonameid){
        //     // console.log(parentGeonameid);
        //     var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
        //     $.get(url, function(data) {
        //         app.finalAdminUnitTags = []
        //         var defer = $.Deferred(),
        //         filtered = defer.then(function(){
        //             return data;
        //         })
        //         defer.resolve();
        //         filtered.done(function(data){
        //             // loop through tags geojson and match to our admin unit ID's
        //             $.each(data.features, function(i,v){
        //                 var id = v.properties.geonameid;
        //                 var index = app.adminUnitId.indexOf(id);
        //                 if(index > 0){
        //                     pos = app.adminUnit.map(function(e) { return e.attributes.geonameid; }).indexOf("(1:" + id +")");
        //                     if(pos > -1){
        //                         // var geom = app.adminUnit[pos]['geometry']
        //                         var geom = app.adminUnit[pos].geometry
        //                         var atts = app.adminUnit[pos].attributes
        //                         var total = v.properties.total
        //                         buildGraphic(geom,atts, total)

        //                     }else{
        //                         ''
        //                     }
                            
        //                 }else{
        //                     // there was no match
        //                 }

        //             })
        //         })
        //     })

        // }
        // // build polygon graphics of admin units symbolized by color based on the num of total tags
        // function buildGraphic(geom,atts, total){
        //     atts.total = total;
        //     geom.type = 'polygon'
        //     var polygon = {
        //         type: "polygon",
        //         rings: geom.rings
        //     }
        //     var color;
        //     var color1 = [115, 255, 222,0.6]
        //     var color2 = [82, 227, 217,0.6]
        //     var color3 = [54, 182, 199,0.6]
        //     var color4 = [13, 80, 143,0.6]
        //     if(total == 1){
        //         color = color1
        //     }else if(total > 1 && total <= 5){
        //         color = color2
        //     }else if(total > 5 && total <= 10){
        //         color = color3
        //     }else if(total > 10){
        //         color = color4
        //     }
        //     // Create a symbol for rendering the graphic
        //     var fillSymbol = {
        //         type: "simple-fill", // autocasts as new SimpleFillSymbol()
        //         color: color,
        //         outline: { // autocasts as new SimpleLineSymbol()
        //           color: [13, 80, 143],
        //           width: .5
        //         }
        //     };
        //     app.graphic2 = new Graphic({
        //         //gotta set a defined geometry for the symbol to draw
        //         geometry: geom,
        //         symbol: fillSymbol,
        //         attributes: atts
        //     });
        //     app.layer = new GraphicsLayer({
        //         graphics: [app.graphic2]
        //     });

        //     map.add(app.layer);
        //     app.layer.on('click', function(evt){
        //         console.log(evt);
        //     })
        //     // view.graphics.add(app.graphic2);
        // }
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
                // buildCharts(app);
                // console.log(app.myChart3.data.datasets);
                app.myChart3.data.datasets.forEach((dataset) => {
                    console.log(dataset);
                    console.log(dataset.data[0]);
                    dataset.data[0] = dataset.data[0] + 10;
                    // dataset.data.pop();
                });
                app.myChart3.update();

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
        function getEvents(){
            // get todays date and figure out which dates to query for each timeframe
             // get js utm time
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var todaysDate = year + "-" + month + "-" + day;
            // format = 2018-02-01 year, month, day
            Date.fromDayofYear= function(n, y){
                if(!y) y= new Date().getFullYear();
                var d= new Date(y, 0, 1);
                return new Date(d.setMonth(0, n));
            }
            Date.prototype.dayofYear= function(){
                var d= new Date(this.getFullYear(), 0, 0);
                return Math.floor((this-d)/8.64e+7);
            }
            var d=new Date().dayofYear();
            // get date function to convert todays date to a format thats understood by the api
            function getDate (d,time){
                var newDay = (d - time);
                if (newDay >=0) {
                     var newDate = String(Date.fromDayofYear(newDay).toLocaleDateString())
                     newDate = newDate.split('/');
                     newDate = newDate[2] + '-' + newDate[0] + '-' + newDate[1]
                     return newDate
                }else{
                    var newDate = newDay + 365;
                    newDate = Date.fromDayofYear(newDate).toLocaleDateString()
                    newYear = (newDate.substring(newDate.length-1,newDate.length) - 1)
                    newDate = newDate.slice(0,-1) + newYear
                    newDate = newDate.split('/');
                    newDate = newDate[2] + '-' + newDate[0] + '-' + newDate[1]
                    return String(newDate)
                }
            }

            // var lastMonth = getFloodEvents(getDate(d, 30))
            // call get flood events for the past year
            getFloodEvents(getDate(d, 365))
            function getFloodEvents(endDate){
                var url = ' https://api.floodtags.com/v1/events/index?until='+ todaysDate + '&since=' + endDate +'&upperLimit=10000&filterSource=northern-java&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
                app.eventList = []
                $.get( url, function( data ) {
                     var defer = $.Deferred(),
                        filtered = defer.then(function() {
                    $.each(data.events, function(i,v){
                        if(v.location.geonameid == '1627893'){
                            app.eventList.push(v);
                            // return app.eventList;
                        }
                    })
                })
                defer.resolve();
                filtered.done(function( value ) {
                   if(app.eventList.length > 0){
                        // call create event button function
                        buildEventButtons(app.eventList)

                   }
                });
            })
           }

           function buildEventButtons(array){
                // divide up array into past 7 days, 30, 180 and 365
                var pastYearEvents = array;
                $.each(array, function(i,v){
                    // let end = v.end.split('T')[0]
                    // let start = v.start.split('T')[0]
                    let date = v.start.split('T')[0] + ' - ' + v.end.split('T')[0]
                    console.log(date)
                    // var html = "<div class='event' id='" +v.location.geonameid +"'><span class='floodEventText'>Flood event: </span><div>  " 
                    // + v.start.split('T')[0] + " - " + v.end.split('T')[0] + '</div>'
                    // +'<div class="numOfTags"><span class="floodEventText">Num. of tags: </span>' +v.tags+'</div></div>' 
                    var html = "<div data-date='"+ date +"' class='event' id='" +v.location.geonameid +"'><span class='floodEventText'>Flood event: </span><div>  " 
                    + v.start.split('T')[0] + " - " + v.end.split('T')[0] + '</div></div>'
                    // append html to events wrapper
                    $('.eventsWrapper').append(html);
                    onEventClick();
                })

           }
        }
        // on event click function
        function onEventClick(){
            $('.event').on('click', function(evt){
                // set the html of the date field
                // $('#mainDate').html(evt.currentTarget.dataset.date)
                // create vars with a count of 0
                app.popWomen =0;
                app.popMen =0;
                app.popTotal =0;
                app.hospTotal =0;
                app.worshipTotal =0;
                app.cultToltal =0;
                app.eduTotal =0;
                app.roadsTotal =0;
                app.agTotal =0;
                app.riceTotal =0;
                app.tourTotal =0;
                app.totalTweets = 0;

                // query tags endpoint with parent geoname id
                getTagsFromEvents(evt.currentTarget.id)
                function getTagsFromEvents(parentGeonameid){
                    var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=' + parentGeonameid+ '&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
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
                                    pos = app.adminUnit.map(function(e) { return e.attributes.id1; }).indexOf(id);
                                    if(pos > -1){
                                        app.totalTweets += v.properties.total;
                                        var geom = app.adminUnit[pos].geometry
                                        var atts = app.adminUnit[pos].attributes
                                        var total = v.properties.total
                                        buildGraphic(geom,atts, total);
                                        buildStats(atts);
                                        // console.log(atts.POP_TOTAL)
                                    }else{
                                        ''
                                         pos = app.adminUnit.map(function(e) { return e.attributes.id2; }).indexOf(id);
                                         if (pos > -1) {
                                            var geom = app.adminUnit[pos].geometry
                                            var atts = app.adminUnit[pos].attributes
                                            var total = v.properties.total
                                            buildGraphic(geom,atts, total);
                                            buildStats(atts);
                                         }
                                    }
                                    
                                }else{
                                    // there was no match
                                }
                            })
                            // populate charts with stats from match admin units
                            buildCharts(app);
                            // manipulate the DOM
                            // slide up the flooding events wrapper
                            $('.eventsWrapper').slideUp();
                            // slide down the flood tags wrapper
                            $('.floodTagsWrapper').slideDown();
                            // slide up the header sections
                            $('.introTextWrapper').slideUp()
                            $('.mainToggleWrapper').slideUp()

                            // back button to get back to the events section
                            // also some dom manipulation
                            $('.backToEvents').on('click', function(evt){
                                // slide up the flooding events wrapper
                                $('.eventsWrapper').slideDown();
                                 // slide down the header sections
                                $('.introTextWrapper').slideDown()
                                $('.mainToggleWrapper').slideDown()
                                // slide down the flood tags wrapper
                                $('.floodTagsWrapper').slideUp();
                                map.removeAll()
                                map.add(layer)
                            })

                        })
                    })

                }
                // build polygon graphics of admin units symbolized by color based on the num of total tags
                // create graphics for each match admin unit
                function buildGraphic(geom,atts, total){
                    // console.log(atts, 'mmmmmmmmmmmmmmmmm')
                    // app.layer ='';
                    // app.layer.removeAll();
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
                    if(total <= 2){
                        color = color1
                    }else if(total > 2 && total <= 5){
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
                    // add graphics to map
                    map.add(app.layer);
                }
                function buildStats(atts){
                    // calculate stats for all the matched admin units
                    app.popWomen +=atts.POP_WOMEN;
                    app.popMen +=atts.POP_MEN;
                    app.popTotal +=atts.POP_TOTAL;
                    app.hospTotal +=atts.PLACE_HOSP;
                    app.worshipTotal +=atts.PLACE_WSHP;
                    // app.cultToltal +=atts.;
                    app.eduTotal +=atts.PLACE_EDU;
                    app.roadsTotal +=atts.LIVE_RDS_KM;
                    app.agTotal +=atts.LIVE_AG_HA;
                    app.riceTotal +=atts.LIVE_RICE_HA;
                    app.tourTotal +=atts.LIVE_TOUR;
                }
            })
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
            let id = String(v.attributes.geonameid.split(':')[1].split(')')[0])
            let n = id.includes(",");
            if(n){
                id = id.split(',')
                v.attributes.id1 = id[0]
                v.attributes.id2 = id[1]
                app.adminUnit.push(v);
                $.each(id, function(i,v){
                    id =v;
                    app.adminUnitId.push(String(id));
                })
            }else{
                app.adminUnitId.push(id)
                v.attributes.id1 = String(v.attributes.geonameid.split(':')[1].split(')')[0])
                app.adminUnit.push(v);
            }
        })

        var url = "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer"
        var hospital = new FeatureLayer({url: url + '/38'});
        var schools = new FeatureLayer({url: url+ '/36'});
        var worship = new FeatureLayer({url: url+ '/53'});
        var roads = new FeatureLayer({url: url+ '/46'});
        var govBuildings = new FeatureLayer({url: url+ '/37'});
        // on ref layers cb click
        $('.floodCBWrappers input').on('click', function(evt){
            var id  = evt.currentTarget.id
            console.log(id)
            // check if the cb was checked or unchecked
            // if checked turn on that layer
            if (evt.currentTarget.checked) {
                if (id == 'schools') {
                    map.add(schools);
                }else if(id == 'worship'){
                    map.add(worship);
                }else if(id == 'hospitals'){
                    map.add(hospital);
                }else if(id == 'buildings'){
                    map.add(govBuildings);
                }else if(id == 'roads'){
                    map.add(roads);
                }
            }else{// if unchecked turn off that layer 
                 if (id == 'schools') {
                    map.remove(schools);
                }else if(id == 'worship'){
                    map.remove(worship);
                }else if(id == 'hospitals'){
                    map.remove(hospital);
                }else if(id == 'buildings'){
                    map.remove(govBuildings);
                }else if(id == 'roads'){
                    map.remove(roads);
                }
            }
        })

        // // var url = "https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        // var url = "https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=2018-02-01T11:31:22.000Z&until=2018-04-28T14:50:28.000Z&parentGeonameid=1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
        // $.get( url, function( data ) {
        //     var defer = $.Deferred(),
        //         filtered = defer.then(function() {
        //             $.each(data.features, function(i,v){
        //                 try{
        //                     if(v.properties.geonameid){
        //                         app.eventsGeoId.push(String(v.properties.geonameid));
        //                     }
        //                 }catch(e){
        //                 }
        //             })
        //             return app.eventsGeoId
        //         });
        //         defer.resolve();
        //     filtered.done(function( value ) {
        //         var duplicates = app.adminUnitId.filter(function(val) {
        //           return app.eventsGeoId.indexOf(val) != -1;
        //         });
        //     });
        // })


        
        
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
        // var url = "https://api.floodtags.com/v1/events/index?until=2018-05-20&since=2018-02-01&upperLimit=10000&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe"
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

// add commas to numbers
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}







