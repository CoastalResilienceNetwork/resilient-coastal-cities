define(["dojo/_base/declare",
        "framework/PluginBase",
        "dojo/text!./templates.html",
        "esri/layers/MapImageLayer"],
    function (declare, PluginBase, templates, MapImageLayer) {
        return declare(PluginBase, {
            toolbarName: "Pilot Flood Demo",
            fullName: "Exploring capabilities of JSAPI 4.0",
            allowIdentifyWhenActive: false,
            size: 'small',
            currentLayer: null,
            locations: {
                pgSound: {
                    zoom: 12,
                    center: [-122.13, 47.87],
                    tilt: 60
                },
                nisqually: {
                    zoom: 13,
                    center: [-122.70, 47.052],
                    tilt: 55,
                    heading: 15
                },
                usa: {
                    zoom: 3,
                    center: [-98.486, 38.69]
                }
            },

            initialize: function(args) {
                declare.safeMixin(this, args);
                this.$container = $(this.container);
            },

            hibernate: function() {
                this.scene = this.app.activate2d();
            },

            activate: function(showHelpOnStart) {
                var el = this.getTemplateById('pilot-plugin'),
                    self = this;

                this.$container.empty().append(el);
                this.$floodRisk = this.$container.find('#flood-risk');
                this.$floodRisk.on('click', $.proxy(this.showFloodRisk, this));

                this.$nisqually = this.$container.find('#sea-risk');
                this.$nisqually.on('click', $.proxy(this.showNisqually, this));

                this.scene = this.app.activate3d();
                this.map.ground = 'world-elevation';

                this.scene.then(function() {
                    self.zoomTo(self.locations.usa);
                });
            },

            zoomTo: function(location) {
                return this.scene.goTo(location);
            },

            getTemplateById: function(id) {
                return $('<div>').append(templates)
                    .find('#' + id)
                    .html().trim();
            },

            showFloodRisk: function() {
                var self = this,
                    $stepLabel = this.$container.find('#flood-step-label'),
                    chance = this.$container.find('input[name=flood-percent]:checked').val(),
                    scenario = this.$container.find('input[name=flood-scenario]:checked').val(),
                    // Layer Ids for the permutations of high/low scenarios in 1% or 10% chances
                    desc = [
                        'Current Flood Depth (10% chance)',
                        'Current Flood Depth (1% chance)',
                        '2040 Flood Depth (10% chance, Low Scenario)',
                        '2040 Flood Depth (10% chance, High Scenario)',
                        '2040 Flood Depth (1% chance, Low Scenario)',
                        '2040 Flood Depth (1% chance, High Scenario)',
                        '2080 Flood Depth (10% chance, Low Scenario)',
                        '2080 Flood Depth (10% chance, High Scenario)',
                        '2080 Flood Depth (1% chance, Low Scenario)',
                        '2080 Flood Depth (1% chance, High Scenario)',
                    ],
                    profile = {
                        one: { low: [1, 4, 8], high: [1, 5, 9] },
                        ten: { low: [0, 2, 6], high: [0, 3, 7] }
                    },
                    layerIds = profile[chance][scenario],
                    labels = layerIds.map(function(id) { return desc[id]; }),
                    baseUrl = 'http://dev.services.coastalresilience.org/arcgis/rest/services/Puget_Sound/Flood_Level_Rise/MapServer/';

                self.$floodRisk.prop('disabled', true);
                this.animateLayers(this.locations.pgSound, baseUrl, layerIds, labels, $stepLabel)
                    .then(function() {
                        self.$floodRisk.prop('disabled', false);
                    });
            },

            showNisqually: function() {
                var self = this,
                    $stepLabel = this.$container.find('#sea-step-label'),
                    sea = this.$container.find('input[name=sea-level]:checked').val(),
                    tidal = this.$container.find('input[name=tidal-level]:checked').val(),
                    // Layer Ids for the permutations of high/low scenarios in 1% or 10% chances
                    desc = [
                        '2100 Mean Higher High Water (MHHW) Max',
                        '2100 Mean Higher High Water (MHHW) Mean',
                        '2050 Mean Higher High Water (MHHW) Max',
                        '2050 Mean Higher High Water (MHHW) Mean',
                        '2010 Mean Higher High Water (MHHW)',
                        '2100 Highest Observed Water (HOW) Max',
                        '2100 Highest Observed Water (HOW) Mean',
                        '2050 Highest Observed Water (HOW) Max',
                        '2050 Highest Observed Water (HOW) Mean',
                        '2010 Highest Observed Water (HOW)'
                    ],
                    profile = {
                        how:  { mean: [0, 8, 6], max: [0, 7, 5] },
                        mhhw: { mean: [4, 3, 1], max: [4, 2, 0] }
                    },
                    layerIds = profile[tidal][sea],
                    labels = layerIds.map(function(id) { return desc[id]; }),
                    baseUrl = 'http://dev.services.coastalresilience.org/arcgis/rest/services/Puget_Sound/Nisqually_Flood_and_SLR/MapServer/';

                self.$nisqually.prop('disabled', true);
                self.animateLayers(this.locations.nisqually, baseUrl, layerIds, labels, $stepLabel)
                    .then(function() {
                        self.$nisqually.prop('disabled', false);
                    });
            },

            animateLayers: function(location, baseUrl, layerIds, labels, $display) {
                var self = this,
                    step = 0,
                    pauseTime = 6000,
                    showLayer = function(id) {
                        return function() {
                            var newLayer = new MapImageLayer({
                                url: baseUrl,
                                sublayers: [{id: id}]
                            });

                            transitionLayers(self.currentLayer, newLayer);
                            $display.text(labels[step++]);
                        };
                    },
                    transitionLayers= function(oldLayer, newLayer) {
                            self.map.addLayer(newLayer);
                            setTimeout(function() {
                                removeLayer(oldLayer);
                                // Keep a reference to the most recent layer
                                self.currentLayer = newLayer;
                            }, 1500);
                    },
                    removeLayer = function(layer) {
                        if (layer) {
                            self.map.removeLayer(layer);
                        }
                    },
                    pause = function(time) {
                        var defer = $.Deferred();
                        return function() {
                            setTimeout(function() {
                                defer.resolve();
                            }, time);
                            return defer;
                        };
                    };

                $display.empty();
                removeLayer(self.currentLayer);
                var animationStep = this.zoomTo(location);
                layerIds.forEach(function(id) {
                    animationStep = animationStep
                        .then(showLayer(id))
                        .then(pause(pauseTime));
                });
                return animationStep;
            }

    });
});
