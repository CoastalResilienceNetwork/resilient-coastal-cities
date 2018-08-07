define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer",  "plugins/resilient-coastal-cities/js/moment.min.js",
],
function ( declare, Query, QueryTask, FeatureLayer,  moment, ) {
        "use strict";

        return declare(null, { 
			
			eventListeners: function(t){
				// on daterange clear
				$("#" + t.id + "dateRangeClear").on('click', function(evt){
					// clear date range inputs
					$("#" + t.id +  "from" ).val('')
					$("#" + t.id +  "to" ).val('')
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
				})
				$('.rc-mainToggleWrapper input').on('click', function(evt){
					console.log(evt.currentTarget.value);
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
