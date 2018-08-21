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
			// on event click function //////////////////////////////////////
			function onEventClick(t,evt){

				t.obj.layer = new GraphicsLayer();
				try{
					console.log('remove layer')
            		// t.map.removeLayer(t.obj.layer)
            		// t.obj.layer.remove(t.graphic2)
            		t.obj.layer.clear()
            	}catch(err){
            		
            	}
            	// test to see if the user is clicking a single event or the all events button
				if(evt.currentTarget.id === t.id + 'allEventsButton'){
					getTagsFromEvents(1627893, '2018-03-23','2018-05-24' )

				}else{
					getTagsFromEvents(evt.currentTarget.id, evt.currentTarget.dataset.date.split(' - ')[0], evt.currentTarget.dataset.date.split(' - ')[1])
				}
				// query tags endpoint with parent geoname id
                function getTagsFromEvents(parentGeonameid, startDate, endDate){ 
                    var url = 'https://api.floodtags.com/v1/tags/northern-java/geojson.json?since=' + startDate + 'T00:00:00.000Z&until=' + endDate + 'T23:59:59.000Z&parentGeonameid=' + parentGeonameid+ '&apiKey=e0692cae-eb63-4160-8850-52be0d7ef7fe'
                	console.log(url)
                	// console.log(t.obj.adminUnits);
                	$.get(url, function(data) {
                		// defer callback until query is complete
                		var defer = $.Deferred(),
	                        filtered = defer.then(function(){
	                            return data;
	                        })
                        defer.resolve();
                        // when filtered done
                        filtered.done(function(data){
                        	console.log(2, data)
                        	// call event click function
                        	// eventClick();
                        	// loop through tags geojson and match to our admin unit ID's
                            $.each(data.features, function(i,v){
                                var id = v.properties.geonameid;
                                var index = t.obj.adminUnitId.indexOf(id);
                                if(index > 0){
                                    pos = t.obj.adminUnit.map(function(e) { return e.attributes.id1; }).indexOf(id);
                                    if(pos > -1){
                                    	console.log(v);
                                        t.obj.totalTweets += v.properties.total;
                                        var geom = t.obj.adminUnit[pos].geometry
                                        var atts = t.obj.adminUnit[pos].attributes
                                        var total = v.properties.total
                                        buildGraphic(geom,atts, total);
                                        // buildStats(atts);
                                        // console.log(atts.POP_TOTAL)
                                    }else{
                                    	console.log(v)
                                        ''
                                         pos = t.obj.adminUnit.map(function(e) { return e.attributes.id2; }).indexOf(id);
                                         if (pos > -1) {
                                            var geom = t.obj.adminUnit[pos].geometry
                                            var atts = t.obj.adminUnit[pos].attributes
                                            var total = v.properties.total
                                            buildGraphic(geom,atts, total);
                                            // buildStats(atts);
                                         }
                                    }
                                }else{
                                    // there was no match
                                }
                            })

                        }) // end of filtered done function
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
							    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
							    new Color([255,0,0]), 2),new Color(color)
							);
		                    // // Create a symbol for rendering the graphic
		                    var poly = new Polygon(geom)
		                    t.graphic2 = new Graphic(poly, sfs, atts);
		                     t.obj.layer.add(t.graphic2);
		                    // // add graphics to map
		                    t.map.addLayer(t.obj.layer);
                        }
                	})
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
		    	if (val == 'last30') {
		    		currentStartDate = new Date(t.obj.getDate(d,30))
		    	}else if(val == 'last6'){
		    		currentStartDate = new Date(t.obj.getDate(d,180))
		    	}else if(val == 'custom'){
		    		currentStartDate = t.obj.daterangeStartCustom;
		    		currentEndDate = t.obj.daterangeEndCustom;
		    	}
	    		var counter = 0;
	    		$.each(eventWrapper, function(i,v){
	    			var eventStart = new Date(v.dataset.date.split(' - ')[0])
	    			var eventEnd = new Date(v.dataset.date.split(' - ')[1]);
	    			console.log(v);
	    			if(currentStartDate <= eventEnd && currentEndDate >= eventEnd){
	    				counter +=1
	    				$(v).show();
	    			}else{
	    				$(v).hide();
	    			}
	    			if (counter > 1) {
	    				console.log('more than one')
	    			}
	    			if (counter == 0) {
	    				// slide down no text element
	    				$('.rc-noFloodText').slideDown();
	    				$('.rc-eventsWrapper').slideUp();
	    			}
	    		})
            } // end of show event button function ///////////////////////////////

            function buildClickEvents(){
            	console.log('built events')
            	// on daterange go click
				$("#" + t.id + "dateRangeGo").on('click', function(evt){
					// extract dates from date range inputs
					t.obj.daterangeStartCustom = new Date($("#" + t.id +  "from" ).val())
					t.obj.daterangeEndCustom = new Date($("#" + t.id +  "to" ).val())
					$("#" + t.id + 'dr3').trigger('click');
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
		           	// on all flood event box click ////////////
		           	$('#' + t.id + 'allEventsButton').off().on('click', function(evt){
		           		onEventClick(t,evt);
		           	})
				})
	           	// on back to events button click
	           	$('.rc-headingAndBackBtnWrapper button').off().on('click', function(evt){
	           		// clear map graphics
	           		t.map.removeLayer(t.obj.layer);
	           		// slide up flood and adap wrappers
	           		$('.rc-contentBelowIntroWrapper').slideUp()
	           		// slide down timeframe and event boxes
	           		$('.rc-floodTimeframeWrapper').slideDown()
	           	})
				// main toggle click functionality
				$('.rc-mainToggleWrapper input').on('click', function(evt){
					if(evt.currentTarget.value == 'floodrisk'){
						$('.rc-adaptationWrapper').slideUp();
						$('.rc-floodriskWrapper').slideDown();
					}else{
						$('.rc-floodriskWrapper').slideUp();
						$('.rc-adaptationWrapper').slideDown();
					}
				})
            }
            console.log('before call ///////////')
            buildClickEvents() // call function to build all the click evenst 
            
		},
		appSetup: function(t){
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
			          numberOfMonths: 1
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
			    	console.log(element.value)
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
	            t.obj.testFunction  = function(){
	            	console.log('test func call')
	            }
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
	                        if(v.location.geonameid == '1627893'){
	                            t.obj.eventList.push(v);
	                        }
	                    })
	                })
	                defer.resolve();
	                filtered.done(function( value ) {
	                   if(t.obj.eventList.length > 0){
	                        // call create event button function
	                        buildEventButtons(t.obj.eventList);
	                   }
	                });
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
