define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer"
],
function ( declare, Query, QueryTask, FeatureLayer, ArcGISDynamicMapServiceLayer) {
	"use strict";

	return declare(null, { 
		appSetup: function(t){
			console.log('app appSetup')
		},
		eventListeners: function(t){
			
		},
		getValues: function(t){
			
		},
		startAudio: function(t){
			
		},
		resetAudios: function(t) {
			$.each(t.audios, function(i,v) {var temps = v.src;v.pause();v.currentTime = 0; v.src = "temp";v.src = temps });
			$('.volumneicons').removeClass("fa-volume-up").addClass("fa-volume-off");
		},
		numberWithCommas: function(x){
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
    });
});
