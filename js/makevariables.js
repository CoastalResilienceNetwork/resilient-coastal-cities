// variables
app.renderer = {
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
        
      },
      {
        value: 60,
        size: 500,
        label: "1,000"
      },
      {
        value: 140,
        size: 1000,
        
      },
      {
        value: 280,
        size: 1500,
        
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
            title: "Area of Restorable Mangrove Forest (ha)"
        },
        stops: [
           {
            value: 0,
            color: [0,0,0,0],
            outline: {
              width: 0.5,
              color: "white"
            },
            label: "0"
          },
          {
            value: 1,
            color: [220,245,233,.7],
            outline: {
              width: 0.5,
              color: "white"
            },
            label: "1"
          },
          {
            value: 60,
            color: [162,207,180,.7],
            outline: {
              width: 0.5,
              color: "black"
            },
            label: "60"
          },
          {
            value: 140,
            color: [118,168,130,.7],
            outline: {
              width: 0.5,
              color: "black"
            },
            label: "140"
          },
          {
            value: 280,
            color: [74,135,88,.7],
            outline: {
              width: 0.5,
              color: "black"
            },
            label: "280"
          },
          {
            value: 445,
            color: [34, 102, 51, .7],
            outline: {
              width: 0.5,
              color: "white"
            },
            label: "445"
          }]
    }],
}
