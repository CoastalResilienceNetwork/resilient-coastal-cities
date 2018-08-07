define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer",  "/plugins/resilient-coastal-cities/js/moment.min.js"
],
function ( declare, Query, QueryTask, FeatureLayer,  moment ) {
        "use strict";

        return declare(null, { 
			appSetup: function(t){
			
			},
			eventListeners: function(t){
				
				
			},
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
        });
    }
);
