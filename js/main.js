// #########################################################
// // main js file for the Hudson River web mapping application
// // ESRI api functions ///////////////////////////////////////////////////////////////////////////////////////////////////
// // esri api calls
require([
      "esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/renderers/UniqueValueRenderer","esri/symbols/SimpleFillSymbol",
      "esri/Graphic","esri/layers/GraphicsLayer","esri/tasks/QueryTask","esri/tasks/support/Query","esri/widgets/BasemapToggle","dojo/dom",
      "esri/widgets/Search","esri/views/SceneView","esri/WebScene","esri/layers/SceneLayer","esri/Camera","esri/geometry/Point","dojo/domReady!"
    ], function(
      Map,MapView,FeatureLayer,UniqueValueRenderer,SimpleFillSymbol,Graphic,GraphicsLayer,QueryTask,
      Query,BasemapToggle,dom, Search, SceneView, WebScene, SceneLayer, Camera, Point
    ) { 
        // global variables 
        // admin units feature layer
        var layer = new FeatureLayer({
            url: "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer/73",
            outFields: ["*"]
        });
         // create map object
        var map = new Map({
            basemap: "hybrid",
            ground: "world-elevation",
            layers: [layer]
        });
        var app = {} // main object for the application
        app.sedVal = 3
        app.orVal = 120
        // init config 
        app.config = {
            mapView: null,
            sceneView: null,
            activeView: null,
            container: "map" // use same container for views
        };
        // init params
        app.initialViewParams = {
                zoom: 12,
                center: [110.41, -7.0],
                container: app.config.container,
                map:map
        };
        // create 2D view and and set active
        app.config.mapView = createView(app.initialViewParams, "2d");
        // app.config.mapView.map = webmap;
        app.config.activeView = app.config.mapView;

        // create 3D view, won't initialize until container is set
        app.initialViewParams.container = null;
        // app.initialViewParams.map = scene;
        app.config.sceneView = createView(app.initialViewParams, "3d");
        // convenience function for creating a 2D or 3D view
        function createView(params, type) {
            var view;
            var is2D = type === "2d";
            if (is2D) {
              view = new MapView(params);
              return view;
            } else {
              view = new SceneView(params);
            }
            return view;
        }

        // apdaptaions solutions button click
        $('#yn2').on('click', function(evt){
            $('#adaptationContentWrapper').show()
            $('#floodRiskContentWrapper').hide()
            switchView('3d')
            
        })
        // flood risk button click
        $('#yn1').on('click', function(evt){
            $('#floodRiskContentWrapper').show()
            $('#adaptationContentWrapper').hide()
            switchView('2d')

        })
        // // swithc view from 2d to 3d and vice versa
        function switchView(type){
            // remove the reference to the container for the previous view
            app.config.activeView.container = null;
            if(type === '2d'){
                app.config.mapView.viewpoint = app.config.activeView.viewpoint.clone();
                app.config.mapView.container = app.config.container;
                app.config.activeView = app.config.mapView;
                app.viewMode = "2d";
                map.remove(app.adminFeature)
                app.config.activeView.when(function(){
                    // console.log(app.config.activeView)
                    // if(app.config.activeView){
                    //     var pt = new Point({
                    //       latitude: 49,
                    //       longitude: -126
                    //     });

                    //     // // go to the given point
                    //     // view.goTo(pt);
                    //     console.log('done')
                    //     app.config.activeView.goTo({
                    //         pt
                    //     })
                    // }
                    
                })
            }else{
                app.config.sceneView.viewpoint = app.config.activeView.viewpoint.clone();
                app.config.sceneView.container = app.config.container;
                app.config.activeView = app.config.sceneView;
                app.viewMode = "3d";
                // Create SceneLayer and add to the map
                app.sceneLayer = new SceneLayer({
                    portalItem: {
                      id: "e9ae17b00a914b7ab00b65c9e8caa358"
                    },
                });
                map.add(app.sceneLayer);
                
                // on scene view click
                app.config.activeView.when(function(){
                    // create feature layer with admin extruding based on a val
                    var adminUrl = "http://tncmaps.eastus.cloudapp.azure.com/arcgis/rest/services/Indonesia/Resilient_Coastal_Cities/MapServer/74"
                    var renderer = {
                        type: "simple", // autocasts as new SimpleRenderer()
                        symbol: {
                          type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                          symbolLayers: [{
                            type: "extrude" // autocasts as new ExtrudeSymbol3DLayer()
                          }]
                        },
                        visualVariables: [{
                          type: "size",
                          field: "MNG_COMBINED_HA",
                          stops: [
                          {
                            value: 1,
                            size: 0,
                            label: "1,000"
                          },
                          {
                            value: 60,
                            size: 500,
                            label: "1,000"
                          },
                          {
                            value: 140,
                            size: 1000,
                            label: "1,000"
                          },
                          {
                            value: 280,
                            size: 1500,
                            label: ">150,000"
                          },
                          {
                            value: 445,
                            size: 3000,
                            label: ">150,000"
                          }]
                        },
                        {
                            type: "color",
                            field: "MNG_COMBINED_HA",
                            // normalizationField: "TOTPOP_CY",
                            legendOptions: {
                                title: "% population with income below poverty level"
                            },
                            stops: [
                               {
                                value: 0,
                                color: [0,0,0,0],
                                outline: {
                                  width: 0.5,
                                  color: "white"
                                },
                                label: "<15%"
                              },
                              {
                                value: 1,
                                color: [220,245,233,.7],
                                outline: {
                                  width: 0.5,
                                  color: "white"
                                },
                                label: "<15%"
                              },
                              {
                                value: 60,
                                color: [162,207,180,.7],
                                outline: {
                                  width: 0.5,
                                  color: "black"
                                },
                                label: "<15%"
                              },
                              {
                                value: 140,
                                color: [118,168,130,.7],
                                outline: {
                                  width: 0.5,
                                  color: "black"
                                },
                                label: "<15%"
                              },
                              {
                                value: 280,
                                color: [74,135,88,.7],
                                outline: {
                                  width: 0.5,
                                  color: "black"
                                },
                                label: "<15%"
                              },
                              {
                                value: 445,
                                color: [34, 102, 51, .7],
                                outline: {
                                  width: 0.5,
                                  color: "white"
                                },
                                label: ">35%"
                              }]
                        }],
                    }
                    app.adminFeature = new FeatureLayer({
                        url:adminUrl,
                        renderer: renderer,
                        popupTemplate: { // autocasts as new PopupTemplate()
                          title: "Resilient Coastal Cities",
                          content: "{MNG_COMBINED_HA} ha of Potentially Restorable Mangrove Areas or Rice Fields that can be Converted to Mangroves",
                          fieldInfos: [
                          {
                            fieldName: "MNG_COMBINED_HA",
                            format: {
                              digitSeparator: true,
                              places: 0
                            }
                          }]
                        },
                    })
                    map.add(app.adminFeature);


                    app.config.activeView.goTo({
                        position: {
                          x: 110.39623509996582,
                          y: -6.940453915619568,
                          z: 231,
                          spatialReference: {
                            wkid: 4326
                          }
                        },
                        heading: 160,
                        tilt: 58.33
                        // tilt: 0
                      })
                })
                // based on slider change show the approriate scene
                var sceneIds = {
                    h1or120:"2a051943782546dda70750bdad76e1f9",
                    h2or120:"59d3783d77ef40dfaaa818ed0e05d0ee",
                    h3or120:"e9ae17b00a914b7ab00b65c9e8caa358",
                    h1or200:"64a4c31bb53642d9bf738c6a903bc872",
                    h2or200:"14b32cc9c296496dafa5c24e5bcb84ec",
                    h3or200:"539b141d34d342d48ecf0e5b0f47d3f6",
                    h1or250:"cff4b49a71344e029ce123d880a3a14a",
                    h2or250:"93faac0e1c284b20a4b892da7954e1c7",
                    h3or250:"72b102ebd30c4aeabab4d9bf10e507cf"
                }
                app.sldr.on('slidechange', function(evt, ui){
                    var val;
                    if(ui.value == 1){
                        val = 3;
                    }else if(ui.value == 3){
                        val = 1;
                    }else{
                        val = 2;
                    }
                    app.sedVal = val;
                    sliderBarChange()
                })
                app.sldr2.on('slidechange', function(evt, ui){
                    if(ui.value == 1){
                        val = 120;
                    }else if(ui.value == 3){
                        val = 250;
                    }else{
                        val = 200;
                    }
                    app.orVal = val
                    sliderBarChange()
                })

                function sliderBarChange(){
                    var id = 'h' + app.sedVal + 'or' + app.orVal;
                     map.remove(app.sceneLayer)
                     app.sceneLayer = new SceneLayer({
                        portalItem: {
                          id: sceneIds[id]
                        },
                      });
                      map.add(app.sceneLayer);
                }
            }
        }
   
      
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
          nextBasemap: "streets"  // Allows for toggling to the "hybrid" basemap
        });
        view.ui.add(basemapToggle, "top-right");
        // call the other functions once the esri objects have been created
        getEvents();
        query();
        onClick();
        // onEventClick();

        
        
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
            //on view click
            view.on("click", function(evt) {
                var screenPoint = {
                    x: evt.x,
                    y: evt.y
                };
                view.hitTest(screenPoint)
                    .then(getGraphics);
            });
            app.config.activeView.on("click", function(evt) {
                var screenPoint = {
                    x: evt.x,
                    y: evt.y
                };
                app.config.activeView.hitTest(screenPoint)
                    .then(getGraphics);
            });
            function getGraphics(response){
                if(response.results.length > 1){
                    var atts = response.results[0].graphic.attributes;
                    // update all the charts and text on app pane when click on admin unit
                    // update the header text with the name of the admin unit
                    String.prototype.toProperCase = function () {
                        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    };
                    $('.floodTagsMainHeader span').html(atts.name.toProperCase());
                    // update the number of flood related tweets
                    $('#numOfTweetsInAdmin').html(atts.total)
                    // update the number of people affected chart
                    $('.peopleAffectedWrapper span').html(numberWithCommas(atts.POP_TOTAL))
                    app.myChart.data.datasets[0].data[0] = atts.POP_MEN
                    app.myChart.data.datasets[0].data[1] = atts.POP_WOMEN
                    app.myChart.update();
                    // update tje number of places affected chart
                    $('.placesAffectedWrapper span').html(numberWithCommas(atts.PLACE_EDU + atts.PLACE_HOSP + atts.PLACE_WSHP))
                    // slide down text area instead of chart
                    $('.placesText').slideDown()

                    // slide up chart area
                    $('#Chart3').slideUp();
                    // populate each span with the appriate value
                     $($('.placesText').find('span')[0]).html(atts.PLACE_EDU + ' ')
                     $($('.placesText').find('span')[1]).html(atts.PLACE_HOSP + ' ')
                     $($('.placesText').find('span')[2]).html(atts.PLACE_WSHP + ' ')
                     $('.placesAffectedWrapper h3').css('text-align', 'left')

                    // app.myChart3.data.datasets[0].data[0] = atts.PLACE_EDU;
                    // app.myChart3.data.datasets[1].data[0] = atts.PLACE_HOSP;
                    // app.myChart3.data.datasets[2].data[0] = atts.PLACE_WSHP;
                    // app.myChart3.update();

                    // update the livelihoods affected chart
                    $($('.liveAffectedWrapper').find('span')[0]).html(atts.LIVE_TOUR + ' ')
                    $($('.liveAffectedWrapper').find('span')[1]).html(atts.LIVE_RDS_KM + ' km ')
                    $($('.liveAffectedWrapper').find('span')[2]).html(atts.LIVE_AG_HA + ' ha ')
                    $($('.liveAffectedWrapper').find('span')[3]).html(atts.LIVE_RICE_HA + ' ha ')

                    view.graphics.removeAll(app.graphic); // remove all current graphics
                    app.config.activeView.graphics.removeAll(app.graphic); // remove all current graphics
                    // create and add a selection graphic on flooded admin unit click
                    app.graphic = new Graphic({
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
                       app.config.activeView.graphics.add(app.graphic);
                       view.graphics.add(app.graphic);
                }else{
                    app.config.activeView.graphics.removeAll(app.graphic); // remove all current graphics
                    view.graphics.removeAll(app.graphic); // remove all current graphics
                    // reset back to semarang when any specific admin unit is unselected
                    // update the header text with the name of the admin unit
                    $('.floodTagsMainHeader span').html("Semarang")
                     // update the number of flood related tweets
                    $('#numOfTweetsInAdmin').html(app.totalTweets)
                    // update the number of people affected chart
                    $('.peopleAffectedWrapper span').html(numberWithCommas(app.popTotal))
                    // slide down text area instead of chart
                    $('.placesText').slideUp()
                    // slide up chart area
                    $('#Chart3').slideDown();
                    // update chart
                    app.myChart.data.datasets[0].data[0] = app.popMen
                    app.myChart.data.datasets[0].data[1] = app.popWomen
                    app.myChart.update();
                    // update tje number of places affected chart
                    $('.placesAffectedWrapper span').html(numberWithCommas(app.eduTotal + app.hospTotal + app.worshipTotal))
                    $('.placesAffectedWrapper h3').css('text-align', 'center')
                    app.myChart3.data.datasets[0].data[0] = app.eduTotal;
                    app.myChart3.data.datasets[1].data[0] = app.hospTotal;
                    app.myChart3.data.datasets[2].data[0] = app.worshipTotal;
                    app.myChart3.update();
                     // update the livelihoods affected chart
                    $($('.liveAffectedWrapper').find('span')[0]).html(app.tourTotal + ' ')
                    $($('.liveAffectedWrapper').find('span')[1]).html(app.roadsTotal + ' km ')
                    $($('.liveAffectedWrapper').find('span')[2]).html(app.agTotal + ' ha ')
                    $($('.liveAffectedWrapper').find('span')[3]).html(app.riceTotal + ' ha ')
                }
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
                var url = 'https://api.floodtags.com/v1/events/index?until='+ todaysDate + '&since=' + endDate +'&upperLimit=10000&filterSource=northern-java&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
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
                                // remove the selection graphics
                                view.graphics.removeAll(app.graphic); // remove all current graphics
                                // uncheck all ref layers
                                $.each($('.floodCBWrappers').find('input'), function(i,v){
                                    $(v).prop('checked', false);
                                })
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

        // setup some jquery ui items
        // $("#sldr").slider({ min: 3, max: 1, range: false, step:1, values: [1] })
        //     .slider("pips", { rest: "label"})
        //     .slider("float");
        $(function() {
            console.log('hey')
          app.sldr = $("#sldr").slider({ min: 1, max: 3, range: false, values: [1] })
          
            // .slider("pips", { rest: "label"})
            // .slider("float");
           app.sldr2 = $("#sldr2").slider({ min: 1, max: 3, range: false, values: [1] })
            // .slider("pips", { rest: "label"})
            // .slider("float");
        });




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







