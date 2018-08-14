define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer","esri/dijit/BasemapToggle",  "plugins/resilient-coastal-cities/js/vue",
],
function ( declare, Query, QueryTask, FeatureLayer,BasemapToggle,  Vue ) {
        "use strict";

        return declare(null, {
        	vueCreate: function(t){
        		// t.id = "#"+t.id;
        		// new Vue({
        		// 	el:'#'+t.id + "app",
        		// 	data:{
        		// 		name: 'Test vue data',
        		// 		mainToggle: true,
        		// 		rangeToggle: true,
        		// 		ok: false,

        		// 	},
        		// 	methods:{
        		// 		// mainToggle: function(){
        		// 		// 	console.log('main toggle')
        		// 		// },
        		// 	}
        		// })
        	},

        	getEvents: function(t){
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
	                    $('.rc-eventsWrapper').append(html);
	                    // onEventClick();
	                })
	           }
	         

        	}, // end of get events function
			
			eventListeners: function(t){
					// $("#" + t.id + "BasemapToggle").show()
					// var toggle = new BasemapToggle({
				 //        map: t.map,
			  //       basemap: "osm"
			  //     }, "#" + t.id + "BasemapToggle");
					// console.log(toggle);
			  //     toggle.startup();



			  	
				// show the correct event boxes based on custom filter or toggle buttons
			    function showEventButtons(val){
			    	// slide up no flood text div
			    	$('.rc-noFloodText').hide();
			    	// show the events wrapper on first click
			    	$('.rc-eventsWrapper').show();
			    	// create new date obj for today
			    	var d=new Date().dayofYear();
			    	var eventWrapper = $('.rc-eventsWrapper .rc-event');
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
		    			if(currentStartDate <= eventEnd && currentEndDate >= eventEnd){
		    				counter +=1
		    				$(v).show();
		    			}else{
		    				$(v).hide();
		    			}
		    			if (counter == 0) {
		    				// slide down no text element
		    				$('.rc-noFloodText').slideDown();
		    			}
		    		})
	            }
	           
				// on daterange clear
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
			},
			appSetup: function(t){
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
			},
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
        });
    }
);
