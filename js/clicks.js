define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/graphic",
	"esri/layers/GraphicsLayer", "esri/symbols/SimpleFillSymbol", 
	"esri/symbols/SimpleLineSymbol", "esri/Color", "esri/geometry/Polygon"
],
function ( declare, Query, QueryTask, FeatureLayer, ArcGISDynamicMapServiceLayer, Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, Color, Polygon,) {
	"use strict";

	return declare(null, { 
		eventListeners: function(t){
			console.log('test')
			t.url = 'http://services2.coastalresilience.org/arcgis/rest/services/Resilient_Coastal_Cities/Indonesia/MapServer'
			t.obj.visibleLayers = [73]
			t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity: 1 - t.obj.sliderVal/10});
			t.map.addLayer(t.dynamicLayer);
			t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
			t.toggleType = 'flood'
			// on event click function //////////////////////////////////////
			function onEventClick(t,evt){
				// build vars
				t.popWomen =0;
                t.popMen =0; 
                t.popTotal =0;
                t.hospTotal =0;
                t.worshipTotal =0;
                // app.cultToltal +=atts.;
                t.eduTotal =0;
                t.roadsTotal =0;
                t.agTotal =0;
                t.riceTotal =0;
                t.tourTotal =0;
                t.mangTotal = 0;
                t.mangAndRiceTotal = 0;
                t.lowRiceTotal = 0;
                t.convRiceTotal = 0;
                t.tagTotal =0;
				t.obj.customFilter = false;
				t.doneLooping = false;
				t.obj.finalEventFloods = [];
				t.obj.finalFilteredFloods = []
				// create graphics layer
				t.obj.layer = new GraphicsLayer();
				t.obj.layer2 = new GraphicsLayer();

				// on click on graphics layer 
				// t.obj.layer.on('click', function(evt){
				// 	t.graphicsClick(evt);
				// })
				// // on graphics layer 2 click
				// t.obj.layer2.on('click', function(evt){
				// 	t.graphicsClick(evt);
				// })
				t.obj.layer.on('mouse-over', function(evt){
					t.map.setMapCursor("pointer")
				})
				t.obj.layer.on('mouse-out', function(evt){
					t.map.setMapCursor("default")
				})

				t.map.on('click', function(evt){
					if(evt.graphic){
						t.map.graphics.clear();
						var color = [13, 80, 143,0.0]
						var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
						    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						    new Color([255, 123, 37]), 2),new Color(color)
						);
						// add selection graphic
						t.map.graphics.add(new Graphic(evt.graphic.geometry, symbol));
						var atts = evt.graphic.attributes;
						$('.rc-adminNameText').show();
						$('.rc-adminNameText span').html(atts.name)
						// update stats for both flood and adaptation
						// update num of tweets in event
	                	$('#' + t.id +'numOfTweetsInAdmin').html(t.clicks.numberWithCommas(atts.total));
	                	// update num of people affcted
	                	$('#' + t.id +'popWrapperTotal').html(t.clicks.numberWithCommas(atts.POP_TOTAL));
	                	// update people affcetd labels and chart
	                	$('.rc-menPopNum').html(t.clicks.numberWithCommas(atts.POP_MEN))
	                	$('.rc-womenPopNum').html(t.clicks.numberWithCommas(atts.POP_WOMEN))
	                	// chnage male bar width 
	                	var percentOfMale = (atts.POP_MEN/atts.POP_TOTAL)*100;
	                	$('.rc-maleBar').css('width', percentOfMale + '%')
	                	// update places affcted text
	                	atts.placeTotal = atts.PLACE_WSHP + atts.PLACE_EDU + atts.PLACE_HOSP
	                	$('#' + t.id + 'placeTotal').html(atts.placeTotal);
	                	$($('.rc-placesText').find('span')[0]).html(atts.PLACE_EDU)
	                	$($('.rc-placesText').find('span')[1]).html(atts.PLACE_HOSP)
	                	$($('.rc-placesText').find('span')[2]).html(atts.PLACE_WSHP)
	                	// update livelihoods affected
	                	$($('.rc-placesText').find('span')[3]).html(atts.LIVE_TOUR)
	                	$($('.rc-placesText').find('span')[4]).html(t.clicks.numberWithCommas(atts.LIVE_RDS_KM) + ' km')
	                	$($('.rc-placesText').find('span')[5]).html(t.clicks.numberWithCommas(atts.LIVE_AG_HA) + ' ha')
	                	$($('.rc-placesText').find('span')[6]).html(t.clicks.numberWithCommas(atts.LIVE_RICE_HA) + ' ha')
	                	// update adaptation solutions text
	                	if(atts.MNG_POTENTIAL > 0 && atts.MNG_RICECONVERT >0){
	                		atts.mangAndRiceTotal = atts.MNG_POTENTIAL + atts.MNG_RICECONVERT
	                		$('.rc-manResPotenWrapper h2').html('0 Hectares')
	                		$('.rc-ricePotenWrapper h2').html('0 Hectares')
	                	}else{
	                		atts.mangAndRiceTotal = 0;
	                		$('.rc-manResPotenWrapper h2').html(t.clicks.numberWithCommas(atts.MNG_POTENTIAL) + ' Hectares')
	                		$('.rc-ricePotenWrapper h2').html(t.clicks.numberWithCommas(atts.MNG_RICECONVERT) + ' Hectares')
	                	}
	                	$('.rc-lowRicePotenWrapper h2').html(t.clicks.numberWithCommas(atts.MNG_LOWRICEPROD) + ' Field(s)')
	                	$('.rc-restMangAndRice h2').html(t.clicks.numberWithCommas(atts.mangAndRiceTotal) + ' Hectares')
					}else{
						// remove selection graphic
						t.map.graphics.clear();
						// reset stats to all of semarang
						populateData()
						// slide up city text
						$('.rc-adminNameText').hide();
					}
				})
				try{ // try to clear graphics layer if there are graphics pushed into it
            		t.obj.layer.clear()
            	}catch(err){
            		'catch for the try'
            	}
            	// test to see if the user is clicking a single event or the all events button
				if(evt.currentTarget.id === t.id + 'dateRangeGo'){
					 t.obj.customFilter = true;
					 t.obj.filterCustomDateData = function(){
	            		let dupes = []
	            		t.obj.finalFilteredFloods.forEach((item,index) => {
						   dupes[item.atts.name] = dupes[item.atts.name] || [];
						   dupes[item.atts.name].push(index);
						});
	            		let duplicateArray = []
						t.obj.finalFilteredFloods.forEach((item,index) => {
						   if(dupes[item.atts.name].length > 1){
						   	duplicateArray.push(item.atts.name)
						   }
						 });   
						function onlyUnique(value, index, self) { 
						    return self.indexOf(value) === index;
						}
						duplicateArray = duplicateArray.filter( onlyUnique );
						// loop through final flood array and use the duplicate array 
						// to add the total together 
						
						duplicateArray.forEach((v, i) => {
							var j = 0
							var newObj;
							t.obj.finalFilteredFloods.forEach((item,index) => {
							   if(v == item.atts.name){
								   	if(j==0){
								   		newObj = item
								   		t.obj.finalFilteredFloods.splice(index,1);
								   	}else{
								   		newObj.total =newObj.total + item.total;
								   		t.obj.finalFilteredFloods.splice(index,1);
								   	}
							   	    j++
							     }
							 });
							// add back newly updated object
							t.obj.finalFilteredFloods.push(newObj);
						})
	            		// build graphics for the final filtered floods here
	            		$.each(t.obj.finalFilteredFloods, function(i,v){
	            			buildGraphic(v.geom,v.atts,v.total);
	            			buildStats(v.atts)
	            		})
	            		t.obj.finalFilteredFloods = []
	            	}
	            	// set loop counter to 0, this counter is used below in the get tags function
	            	t.loopCounter = 0;
					// this is if selecting a custom date filter
					t.filteredEventList = []
					$.each(t.obj.eventList, function(i,v){
						var newStart = v.start.split('T')[0]
						var newEnd = v.end.split('T')[0]
						if(t.obj.daterangeStartCustom < newEnd && t.obj.daterangeEndCustom > newStart){
							t.filteredEventList.push(v);
						}
						if(i+1 == t.obj.eventList.length){
							t.doneLooping = true;
							t.loopTotal = t.filteredEventList.length;
							$.each(t.filteredEventList, function(i,v){
								var newStart = v.start.split('T')[0]
								var newEnd = v.end.split('T')[0]
								getTagsFromEvents('g-1627893', newStart,newEnd);				
							})
						}
						
						
					})
					t.obj.changeDate(t.obj.daterangeStartCustom, t.obj.daterangeEndCustom);

				}else{
					getTagsFromEvents(evt.currentTarget.id, evt.currentTarget.dataset.date.split(' - ')[0], evt.currentTarget.dataset.date.split(' - ')[1])
				}
				function buildGraphic(geom,atts, total){
                	atts.total = total;
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
                    
                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
					    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
					    new Color([0,0,0]), .5),new Color(color)
					);
                    // // Create a symbol for rendering the graphic
                    var poly = new Polygon(geom)
                    t.graphic2 = new Graphic(poly, sfs, atts);
                     t.obj.layer.add(t.graphic2);
                    // // add graphics to map
                    // t.map.addLayer(t.obj.layer);


                    // build the graphics layer for adaptation solutions //////////////////////////
                    var dontAdd =  false;
                    if(atts.MNG_LOWRICEPROD > 0){
                    	var color = [170, 255, 0, 0.6]
                    }else if(atts.MNG_RICECONVERT > 0 &&  atts.MNG_POTENTIAL > 0){
                    	var color = [0, 89, 89, 0.6]
                    }else if(atts.MNG_POTENTIAL > 0){
                    	var color = [53, 150, 104, 0.6]
                    }else if(atts.MNG_RICECONVERT > 0){
                    	var color = [168, 212, 11, 0.6]
                    }else{
                    	dontAdd = true;
                    }
                    var adapSym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
					    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
					    new Color([0,0,0]), .5),new Color(color)
					 );
                     // // Create a symbol for rendering the graphic
                    var poly2 = new Polygon(geom)

                    t.graphic3 = new Graphic(poly2,adapSym, atts);
                    if(!dontAdd){
                    	 t.obj.layer2.add(t.graphic3);
                    }
                    // // add graphics to map
                    // t.map.addLayer(t.obj.layer2);
                    // figure out which layer to add based on what toggle has been checked
                    if(t.toggleType == 'flood'){
                    	t.map.addLayer(t.obj.layer);
                    }else{
                    	t.map.addLayer(t.obj.layer2);
                    }

                }
                function populateData(){
                	// update num of tweets in event
                	$('#' + t.id +'numOfTweetsInAdmin').html(t.clicks.numberWithCommas(t.tagTotal));
                	// update num of people affcted
                	$('#' + t.id +'popWrapperTotal').html(t.clicks.numberWithCommas(t.popTotal));
                	// update people affcetd labels and chart
                	$('.rc-menPopNum').html(t.clicks.numberWithCommas(t.popMen))
                	$('.rc-womenPopNum').html(t.clicks.numberWithCommas(t.popWomen))
                	// chnage male bar width 
                	var percentOfMale = (t.popMen/t.popTotal)*100;
                	$('.rc-maleBar').css('width', percentOfMale + '%')
                	// update places affcted text
                	$('#' + t.id + 'placeTotal').html(t.placeTotal);
                	$($('.rc-placesText').find('span')[0]).html(t.eduTotal)
                	$($('.rc-placesText').find('span')[1]).html(t.hospTotal)
                	$($('.rc-placesText').find('span')[2]).html(t.worshipTotal)
                	// update livelihoods affected
                	$($('.rc-placesText').find('span')[3]).html(t.tourTotal)
                	$($('.rc-placesText').find('span')[4]).html(t.clicks.numberWithCommas(t.roadsTotal) + ' km')
                	$($('.rc-placesText').find('span')[5]).html(t.clicks.numberWithCommas(t.agTotal) + ' ha')
                	$($('.rc-placesText').find('span')[6]).html(t.clicks.numberWithCommas(t.riceTotal) + ' ha')

                	// update adaptation solutions text
                	$('.rc-manResPotenWrapper h2').html(t.clicks.numberWithCommas(t.mangTotal) + ' Hectares')
                	$('.rc-ricePotenWrapper h2').html(t.clicks.numberWithCommas(t.convRiceTotal) + ' Hectares')
                	$('.rc-lowRicePotenWrapper h2').html(t.clicks.numberWithCommas(t.lowRiceTotal) + ' Field(s)')
                	$('.rc-restMangAndRice h2').html(t.clicks.numberWithCommas(t.mangAndRiceTotal) + ' Hectares')
                }
                function buildStats(atts){
                	 // calculate stats for all the matched admin units
                    t.popWomen +=atts.POP_WOMEN;
                    t.popMen +=atts.POP_MEN;
                    t.popTotal +=atts.POP_TOTAL;
                    t.hospTotal +=atts.PLACE_HOSP;
                    t.worshipTotal +=atts.PLACE_WSHP;
                    // app.cultToltal +=atts.;
                    t.eduTotal +=atts.PLACE_EDU;
                    t.roadsTotal +=atts.LIVE_RDS_KM;
                    t.agTotal +=atts.LIVE_AG_HA;
                    t.riceTotal +=atts.LIVE_RICE_HA; 
                    t.tourTotal +=atts.LIVE_TOUR;  
                    t.tagTotal += atts.total
                    t.placeTotal = t.hospTotal + t.worshipTotal + t.eduTotal;
                    if(atts.MNG_POTENTIAL > 0 && atts.MNG_RICECONVERT > 0){
                    	t.mangAndRiceTotal += (atts.MNG_POTENTIAL + atts.MNG_RICECONVERT);
                    	t.mangTotal +=0
                    	t.convRiceTotal +=0;
                    }else{
                    	t.mangTotal += atts.MNG_POTENTIAL;
                    	t.convRiceTotal += atts.MNG_RICECONVERT;
                    }
	                t.lowRiceTotal += atts.MNG_LOWRICEPROD;
                    populateData();
                }
				// query tags endpoint with parent geoname id
                function getTagsFromEvents(parentGeonameid, startDate, endDate){
                	let date = startDate + ' - ' + endDate
                	let data;
                	$.each(t.obj.filteredTags, function(i,v){
                		if(v.date == date){
                			data = v.data;
                		}
                	})
                	t.obj.dataOnMap = false;
                    // call event click function
                	// loop through tags geojson and match to our admin unit ID's
                    $.each(data.features, function(i,v){
                        var id = v.properties.geonameid.split('g-')[1];
                        var index = t.obj.adminUnitId.indexOf(id);
                        id = v.properties.geonameid
			let pos;
                        if(index > 0){
                            pos = t.obj.adminUnit.map(function(e) {
                            	var val = 'g-' + e.attributes.id1
                                return val
                            }).indexOf(id);
                            if(pos > -1){
                            	t.obj.dataOnMap = true;
                                t.obj.totalTweets += v.properties.total;
                                var geom = t.obj.adminUnit[pos].geometry
                                var atts = t.obj.adminUnit[pos].attributes
                                var total = v.properties.total
                                t.obj.finalFilteredFloods.push({geom, atts, total})

                                t.obj.finalEventFloods.push({geom, atts, total})
                            }else{
                                 pos = t.obj.adminUnit.map(function(e) {
                                 	var val = 'g-' + e.attributes.id2
                                	return val 
                                 }).indexOf(id);
                                 if (pos > -1) {
                                 	t.obj.dataOnMap = true;
                                    var geom = t.obj.adminUnit[pos].geometry
                                    var atts = t.obj.adminUnit[pos].attributes
                                    var total = v.properties.total
                                    t.obj.finalFilteredFloods.push({geom, atts, total})
                                    t.obj.finalEventFloods.push({geom, atts, total})
                                 }
                            }
                        }else{
                            // there was no match
                        }
                    })
                    t.loopCounter++
                    if(t.loopCounter == t.loopTotal){
                    	t.obj.filterCustomDateData();
                    }
                    if(!t.obj.customFilter){
                    	$.each(t.obj.finalEventFloods, function(i,v){
                    		buildGraphic(v.geom,v.atts,v.total);
                    		buildStats(v.atts)
                    	})
                    	t.obj.changeDate(startDate, endDate);
                    }
                    t.obj.handleIfNoTags(); // call this function after custom go button push. to determine html visible.

                	
                 
                }
			} // end of on event click function /////////////////////////////

			// show the correct event boxes based on custom filter or toggle buttons
		    function showEventButtons(val){
		    	// slide up no flood text div
		    	$('.rc-noFloodText').hide();
		    	// show the events wrapper on first click
		    	$('.rc-eventsWrapper').show();
		    	// create new date obj for today
		    	var d=new Date().dayofYear();
		    	var eventWrapper = $('.rc-eventsWrapperInner .rc-event');
		    	var currentStartDate;
		    	var currentEndDate = new Date()
		    	var dateReformat30 = t.obj.getDate(d,30).split('-');
		    	dateReformat30 = dateReformat30[1] + '/' + dateReformat30[2] + '/' + dateReformat30[0]
		    	var dateReformat180 = t.obj.getDate(d,180).split('-');
		    	dateReformat180 = dateReformat180[1] + '/' + dateReformat180[2] + '/' + dateReformat180[0]
		    	if (val == 'last30') {
		    		currentStartDate = new Date(dateReformat30)
		    	}else if(val == 'last6'){
		    		currentStartDate = new Date(dateReformat180)
		    	}
	    		var counter = 0;
	    		$.each(eventWrapper, function(i,v){
	    			var eventStart = new Date(v.dataset.date.split(' - ')[0]);
	    			var eventEnd = new Date(v.dataset.date.split(' - ')[1]);
	    			if(currentStartDate <= eventEnd && currentEndDate >= eventEnd){
	    				counter +=1
	    				$(v).show();
	    			}else{
	    				$(v).hide();
	    			}
	    			if (counter > 1) {
	    			}
	    			if (counter == 0) {
	    				// slide down no text element
	    				if(val == 'custom'){
	    					$('.rc-noFloodText').slideUp();
	    					$('.rc-eventsWrapper').slideUp();
	    				}else{
	    					$('.rc-noFloodText').slideDown();
	    					$('.rc-eventsWrapper').slideUp();
	    				}
	    			}
	    		})
            } // end of show event button function ///////////////////////////////

            function buildClickEvents(){
       			// create a function to handle the DOM if no tags were returned in a custom query
				t.obj.handleIfNoTags = function(){
					$('.rc-noTagText').hide();
					if(!t.obj.dataOnMap){
						// slide down text saying there are no flood events during the selevcetcd time frame
						$('.rc-noTagText').slideDown();
					}else{
						// slide down flood and adaptation wrappers
		           		$('.rc-contentBelowIntroWrapper').slideDown()
		           		// slide up timeframe and event boxes.
		           		$('.rc-floodTimeframeWrapper').slideUp()
					}
				}
				t.obj.changeDate = function(startDate, endDate){
					$('.rc-timeframeText span').html(startDate + ' - ' + endDate)
				}
            	// on daterange go click
				$("#" + t.id + "dateRangeGo").on('click', function(evt){
					// extract dates from date range inputs
					t.obj.daterangeStartCustom = $("#" + t.id +  "from" ).val().split('/')[2] + '-' + $("#" + t.id +  "from" ).val().split('/')[0] + '-' + $("#" + t.id +  "from" ).val().split('/')[1]
					t.obj.daterangeEndCustom = $("#" + t.id +  "to" ).val().split('/')[2] + '-' + $("#" + t.id +  "to" ).val().split('/')[0] + '-' + $("#" + t.id +  "to" ).val().split('/')[1]
					if($("#" + t.id +  "from" ).val() && $("#" + t.id +  "to" ).val()){
						onEventClick(t,evt)
					}
				})
				// on range toggle button click
				$('#' + t.id + 'rangeToggle input').on('click', function(evt){
					// slide up all range wrappers on any change
					var wrappers  = $('.rc-floodTimeframeWrapper').find('.rc-rangeWrapper');
					$.each(wrappers, function(i,v){
						$(v).hide();
					})
					// slide down the correct range wrapper
					$('#' + t.id + evt.currentTarget.value + "Range").slideDown();
					showEventButtons(evt.currentTarget.value);
		            // on flood event box click ////////////
		           	$('.rc-eventsWrapperInner .rc-event').off().on('click', function(evt){
		           		// slide down flood and adaptation wrappers
		           		$('.rc-contentBelowIntroWrapper').slideDown()
		           		// slide up timeframe and event boxes.
		           		$('.rc-floodTimeframeWrapper').slideUp()
		           		// on event click function populate map
		           		onEventClick(t,evt);
		           	});
				})
				// on flood section check box click
				// show and display various layers based on the id to get the index number from the map service
				$('.rc-infraCBWrapper input').off().on('click', function(evt){
					var id = evt.currentTarget.id.split('-')[1]
					var checked = evt.currentTarget.checked;
					//if is checked add layer to viz layers list
					if(checked){
						t.obj.visibleLayers.push(id);
					}else{ // if checked == false remove layer from viz layers array
						var index =  t.obj.visibleLayers.indexOf(id)
						if(index > -1){
							t.obj.visibleLayers.splice(index, 1);
						}
					}
					// set viz layers
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})
	           	// on back to events button click
	           	$('.rc-headingAndBackBtnWrapper button').off().on('click', function(evt){
	           		// clear map graphics
	           		t.map.removeLayer(t.obj.layer);
	           		t.map.removeLayer(t.obj.layer2);
	           		t.map.graphics.clear();
	           		// slide up flood and adap wrappers
	           		$('.rc-contentBelowIntroWrapper').slideUp()
	           		// slide down timeframe and event boxes
	           		$('.rc-floodTimeframeWrapper').slideDown()
	           	})
				// main toggle click functionality
				$('.rc-mainToggleWrapper input').on('click', function(evt){
					if(evt.currentTarget.value == 'floodrisk'){
						t.toggleType = 'flood'
						$('.rc-adaptationWrapper').slideUp();
						$('.rc-floodriskWrapper').slideDown();
						 t.map.addLayer(t.obj.layer);
						 t.map.removeLayer(t.obj.layer2);
					}else{
						t.toggleType = 'adaptation'
						$('.rc-floodriskWrapper').slideUp();
						$('.rc-adaptationWrapper').slideDown();
						 t.map.addLayer(t.obj.layer2);
						 t.map.removeLayer(t.obj.layer);
					}
				})
            }
            buildClickEvents() // call function to build all the click evenst 
		},
		appSetup: function(t){
			$('#show-single-plugin-mode-help').hide();
			// build admin units obj
			function buildAdminUnits(){
				t.obj.adminUnitId = [];
		        t.obj.adminUnit = [];
		        $.each(t.obj.adminUnits, function(i,v){
		            let id = String(v.attributes.geonameid.split(':')[1].split(')')[0])
		            // let n = id.includes(",");
		            let n = id.indexOf(',')
		            if(n> -1){
		                id = id.split(',')
		                v.attributes.id1 = id[0]
		                v.attributes.id2 = id[1]
		                t.obj.adminUnit.push(v);
		                $.each(id, function(i,v){
		                    id =v;
		                    t.obj.adminUnitId.push(String(id));
		                })
		            }else{
		                t.obj.adminUnitId.push(id)
		                v.attributes.id1 = String(v.attributes.geonameid.split(':')[1].split(')')[0])
		                t.obj.adminUnit.push(v);
		            }
		        })
			}
			buildAdminUnits();
			// create date picker
			function createDatePicker(){
				$( function() {
			    var dateFormat = "mm/dd/yy",
			      from = $("#" + t.id +  "from" )
			        .datepicker({
			          defaultDate: "+1w",
			          changeMonth: true,
			          changeYear: true,
			          yearRange: "-1:+2", // next ten years
			          numberOfMonths: 1,
			        })
			        .on( "change", function() {
			          to.datepicker( "option", "minDate", getDate( this ) );
			        }),
			      to = $("#" + t.id + "to" ).datepicker({
			        defaultDate: "+1w",
			        changeMonth: true,
			        changeYear: true,
			        yearRange: "-1:+2", // next ten years
			        numberOfMonths: 1
			      })
			      .on( "change", function() {
			        from.datepicker( "option", "maxDate", getDate( this ) );
			      });
			 
			    function getDate( element ) {
			     	 var date;
			     	 try {
			        	date = $.datepicker.parseDate( dateFormat, element.value );
			      	} catch( error ) {
			        	date = null;
			     	 }
			      	return date;
			    	}
			  } );
			}
			createDatePicker();
			// get events and build event buttons
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
	            t.obj.getDate = function(d,time){
	                var newDay = (d - time);
	                if (newDay >=0) {
	                     var newDate = String(Date.fromDayofYear(newDay).toLocaleDateString())
	                     newDate = newDate.split('/');
	                     newDate = newDate[2] + '-' + newDate[0] + '-' + newDate[1]
	                     return newDate
	                }else{
	                    var newDate = newDay + 365;
	                    var newDate = Date.fromDayofYear(newDate).toLocaleDateString()
	                    var newYear = (newDate.substring(newDate.length-1,newDate.length) - 1)
	                    newDate = newDate.slice(0,-1) + newYear
	                    newDate = newDate.split('/');
	                    newDate = newDate[2] + '-' + newDate[0] + '-' + newDate[1]
	                    return String(newDate)
	                }
	            }
        		 // var lastMonth = getFloodEvents(getDate(d, 30))
            	// call get flood events for the past 10,000 days
	            getFloodEvents(t.obj.getDate(d, 10000))

	            function getFloodEvents(endDate){
	                var url = 'https://api.floodtags.com/v1/events/index?until='+ todaysDate + '&since=' + endDate +'&upperLimit=10000&filterSource=northern-java&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
	                t.obj.eventList = []
	                $.get( url, function( data ) {
	                     var defer = $.Deferred(),
	                        filtered = defer.then(function() { 
	                    $.each(data.events, function(i,v){
	                        if(v.location.geonameid == 'g-1627893'){
	                            t.obj.eventList.push(v);
	                        }
	                    })
	                })
	                defer.resolve();
	                filtered.done(function( value ) {
	                   if(t.obj.eventList.length > 0){
	                        // call create event button function
	                        filterEvents(t.obj.eventList);
	                   }
	                });
	            })
	           }

	           // filter events to not show flood events that can only be georefed to semarang as a whole, we do not have the way to map that
	           function filterEvents(array){
	           		t.obj.filteredEventList = []
	           		t.obj.filteredTags = []
	           		$.each(array, function(i,v){
	           			let startDate = v.start.split('T')[0]
	           			let endDate = v.end.split('T')[0]
	           			let date = v.start.split('T')[0] + ' - ' + v.end.split('T')[0]
	           			var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=' + startDate + 'T00:00:00.000Z&until=' + endDate + 'T23:59:59.000Z&parentGeonameid=g-1627893&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
	                    $.get( url, function( data ) {
	                    	// console.log(data, i)
	                    	var defer = $.Deferred(),
	                        filtered = defer.then(function() {
	                        	if(data.features.length == 1){
	                        		if(data.features[0].properties.name != 'Semarang'){
	                        			t.obj.filteredEventList.push(v)
	                        			t.obj.filteredTags.push({data, date})
	                        		}
	                        	}else{
	                        		t.obj.filteredEventList.push(v)
	                        		t.obj.filteredTags.push({data, date})
	                        	}
	                        })
	                        defer.resolve();
			                filtered.done(function( value ) {
			                   if(i+1 == array.length){
				                   	function compare(a,b) {
									  if (a.end < b.start)
									    return 1;
									  if (a.end > b.start)
									    return -1;
									  return 0;
									}
									t.obj.filteredEventList.sort(compare);
				           			// call create event button function
				                	buildEventButtons(t.obj.filteredEventList);
				           		}
			                });
	                    })
	                    
	           		})
	           }

	           function buildEventButtons(array){
	           		// divide up array into past 7 days, 30, 180 and 365
	                var pastYearEvents = array;
	                $.each(array, function(i,v){
	                    let date = v.start.split('T')[0] + ' - ' + v.end.split('T')[0]
	                    var html = "<div data-date='"+ date +"' class='rc-event' id='" +v.location.geonameid +"'><span class='floodEventText'>Flood event: </span><div class='rc-floodEventDate'>  " 
	                    + v.start.split('T')[0] + " - " + v.end.split('T')[0] + '</div></div>'
	                    // append html to events wrapper
	                    $('.rc-eventsWrapperInner').append(html);
	                })
	                // slide down toggle buttons only after everything is done loading
	                $('.rc-floodTimeframeWrapper').slideDown();

	           }
			}
			getEvents(); // call the api and build the events obj
			// call event listeners after init app setup
			t.clicks.eventListeners(t)
		},
		numberWithCommas: function(x){
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
    });
});
