// console.log('create charts')

// var Chart = require('chart.js');
function buildCharts(app){
  console.log('start building charts', app.popMen);
  console.log(app.popWomen,
                    app.popMen,
                    app.popTotal,
                    app.hospTotal,
                    app.worshipTotal,
                      app.eduTotal, 
                    app.roadsTotal,
                    app.agTotal, 
                    app.riceTotal)
  console.log(app)
  console.log((app.popTotal*.05) + app.popTotal)
  console.log(app.totalTweets)
// update the livelihoods section of the app ///////////////////////////////////////////////////////////////////

$($('.liveAffectedWrapper').find('.livelihoodsItems').find('span')[0]).html(app.tourTotal + ' ')
$($('.liveAffectedWrapper').find('.livelihoodsItems').find('span')[1]).html(app.roadsTotal + ' km ')
$($('.liveAffectedWrapper').find('.livelihoodsItems').find('span')[2]).html(app.agTotal + ' ha ')
$($('.liveAffectedWrapper').find('.livelihoodsItems').find('span')[3]).html(app.riceTotal + ' ha ')
// update each header of the app ///////////////////////////////////////////////////////////////////////////////
$("#numOfTweetsInAdmin").html(app.totalTweets + ' ')
$('.placesAffectedWrapper').children().find('span').html(app.hospTotal + app.worshipTotal + app.eduTotal)
$('.peopleAffectedWrapper').children().find('span').html(numberWithCommas(app.popTotal))
// build charts below ////////////////////
// chart 1 code ////////////////////////////////////////////////////////////////////////////////////////////////


 var popData = {
        labels: [
            "Men",
            "Women"
        ],
        datasets: [
            {
                label: "Test",
                data: [app.popMen, app.popWomen],
                backgroundColor: ["#669911", "#119966" ],
                hoverBackgroundColor: ["#66A2EB", "#FCCE56"]
            }]
    };

var ctx = document.getElementById("Chart1");
app.myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: popData,
      options: {
        scales: {
            yAxes: [{
                barThickness:17,
                stacked: true
            }],
            xAxes: [{
              display: false,
              ticks:{
                min: 0
              }
            }]

        },
        responsive: false,
        tooltips: {
            enabled: false
        },
      //   scales: {
      //     xAxes: [{
      //         display: false,
      //         barThickness:75,
      //         ticks: {
      //             beginAtZero:true,
      //             fontFamily: "'Open Sans Bold', sans-serif",
      //             fontSize:15,
      //              max: (app.popTotal*.05) + app.popTotal,
      //         },
      //         scaleLabel:{
      //             display:true
      //         },
      //         gridLines: {
      //           display: false
      //         }, 
      //         stacked: false
      //     }],
      //     yAxes: [{
      //         barThickness:35,
      //         gridLines: {
      //             display:false,
      //             color: "#f3f3f3",
      //             zeroLineColor: "#f3f3f3",
      //             zeroLineWidth: 0
      //         },
      //         ticks: {
      //             fontFamily: "'Open Sans Bold', sans-serif",
      //             fontSize:15,

      //         },
      //         stacked: true
      //     }]
      // },
        legend:{
          display:false,
      },

    }
})



  // var barOptions_stacked = {
  //     responsive: false,
  //     tooltips: {
  //         enabled: false
  //     },
  //     label:{
  //       fontSize:20
  //     },
  //     hover :{
  //         animationDuration:0
  //     },
  //     scales: {
  //         xAxes: [{
  //             display: false,
  //             barThickness:75,
  //             ticks: {
  //                 beginAtZero:true,
  //                 fontFamily: "'Open Sans Bold', sans-serif",
  //                 fontSize:20,
  //                  max: (app.popTotal*.05) + app.popTotal,
  //             },
  //             scaleLabel:{
  //                 display:true
  //             },
  //             gridLines: {
  //               display: false
  //             }, 
  //             stacked: true
  //         }],
  //         yAxes: [{
  //             barThickness:35,
  //             gridLines: {
  //                 display:false,
  //                 color: "#f3f3f3",
  //                 zeroLineColor: "#f3f3f3",
  //                 zeroLineWidth: 0
  //             },
  //             ticks: {
  //                 fontFamily: "'Open Sans Bold', sans-serif",
  //                 fontSize:20,

  //             },
  //             stacked: true
  //         }]
  //     },
  //     legend:{
  //         display:false,
  //     },
      
  //     animation: {
  //         onComplete: function () {
  //             var chartInstance = this.chart;
  //             var ctx = chartInstance.ctx;
  //             ctx.textAlign = "center";
  //             ctx.font = "20px Open Sans";
  //             ctx.fillStyle = "black";

  //             Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
  //                 var meta = chartInstance.controller.getDatasetMeta(i);
  //                 Chart.helpers.each(meta.data.forEach(function (bar, index) {
  //                     data = dataset.data[index];
  //                     data = numberWithCommas(data)
  //                     if(i==0){
  //                         ctx.fillText(data + ' Men', 80, bar._model.y+5);
  //                     } else {
  //                         ctx.fillText(data + ' Women', bar._model.x-75, bar._model.y+5);
  //                     }
  //                 }),this)
  //             }),this);
  //         }
  //     },
  //     pointLabelFontFamily : "Quadon Extra Bold",
  //     scaleFontFamily : "Quadon Extra Bold",
  // };
  // var ctx = document.getElementById("Chart1");
  // var myChart = new Chart(ctx, {
  //     type: 'horizontalBar',
  //     data: {
  //         // labels: ["Men", "Women"],
          
  //         datasets: [{
  //             label: 'men',
  //             data: [app.popMen],
  //             backgroundColor: "rgba(163,103,126,1)",
  //             hoverBackgroundColor: "rgba(140,85,100,1)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //         },{
  //              label: 'women',
  //             data: [app.popWomen],
  //             backgroundColor: "rgba(63,203,226,1)",
  //             hoverBackgroundColor: "rgba(46,185,235,1)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //         }]
  //     },

  //     options: barOptions_stacked,
  // });
// chart 2 code ///////////////////////////////////////////////////////////////////////////////////////////////
  // var numTweetChartOptions = {
  //     responsive: false,
  //     tooltips: {
  //         enabled: false
  //     },
  //     label:{
  //       fontSize:20
  //     },
  //     hover :{
  //         animationDuration:0
  //     },
  //     scales: {
  //         xAxes: [{
  //             display: false,
  //             barThickness:35,
  //             ticks: {
  //                 beginAtZero:true,
  //                 fontFamily: "'Open Sans Bold', sans-serif",
  //                 fontSize:20
  //             },
  //             scaleLabel:{
  //                 display:false
  //             },
  //             gridLines: {
  //               display: false,
  //               color: "#fff",
  //               zeroLineColor: "#fff",
  //               zeroLineWidth: 0
  //             }, 
  //             stacked: true
  //         }],
  //         yAxes: [{
  //             barThickness:25,
  //             gridLines: {
  //                 display:false,
  //                 color: "#f3f3f3",
  //                 zeroLineColor: "#f3f3f3",
  //                 zeroLineWidth: 0
  //             },
  //             ticks: {
  //                 fontFamily: "'Open Sans Bold', sans-serif",
  //                 fontSize:20
  //             },
  //             stacked: true
  //         }]
  //     },
  //     legend:{
  //         display:false,
  //     },

      
  //     animation: {
  //         onComplete: function () {
  //             var chartInstance = this.chart;
  //             var ctx = chartInstance.ctx;
  //             ctx.textAlign = "center";
  //             ctx.font = "20px Open Sans";
  //             ctx.fillStyle = "black";
  //             ctx.fontColor= "black";

  //             Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
  //                 var meta = chartInstance.controller.getDatasetMeta(i);
  //                 Chart.helpers.each(meta.data.forEach(function (bar, index) {
  //                     data = dataset.data[index];
  //                     data = numberWithCommas(data)
  //                     // data = data + ' Admin Units'
  //                     if(i==0){
  //                         ctx.fillText(data, 50, bar._model.y+4);
  //                     } else {
  //                         if(data == 1){
  //                           ctx.fillText(data, bar._model.x-10, bar._model.y+5);
  //                         }else{
  //                           // console.log(bar._model.x)
  //                           ctx.fillText(data, bar._model.x-40, bar._model.y+5);
  //                         }
  //                     }
  //                 }),this)
  //             }),this);
  //         }
  //     },
  //     pointLabelFontFamily : "Quadon Extra Bold",
  //     scaleFontFamily : "Quadon Extra Bold",
  // };
  // var ctx2 = document.getElementById("Chart2");
  // var myChart2 = new Chart(ctx2, {
  //     type: 'horizontalBar',
  //     data: {
  //         // labels: ["Men", "Women"],
          
  //         datasets: [{
  //             label: 'men',
  //             data: [7],
  //             backgroundColor: "rgba(115, 255, 222,0.6)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //             // hoverBackgroundColor: "rgba(140,85,100,1)"
  //         },{
  //             label: 'women',
  //             data: [5],
  //             backgroundColor: "rgba(82, 227, 217,0.6)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //             // hoverBackgroundColor: "rgba(46,185,235,1)"
  //         },
  //         {
  //             label: 'men',
  //             data: [4],
  //             backgroundColor: "rgba(54, 182, 199,0.6)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //             // hoverBackgroundColor: "rgba(140,85,100,1)"
  //         },
  //         {
  //             label: 'men',
  //             data: [1],
  //             backgroundColor: "rgba(13, 80, 143,0.6)",
  //             borderWidth: 1,
  //             // borderColor: 'black',
  //             // hoverBackgroundColor: "rgba(140,85,100,1)"
  //         }

  //         ]
  //     },

  //     options: numTweetChartOptions,
  // });
// chart 3 code ////////////////////////////////////////////////////////////////////////////////
var placesChartOption = {
      responsive: false,
      tooltips: {
          enabled: false
      },
      label:{
        fontSize:20
      },
      layout:{
        padding:{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
      },
      hover :{
          animationDuration:0
      },
      scales:{
          yAxes: [{
              barThickness:25,
              ticks: {
                  
                  beginAtZero: true,
              },
              
          }]
      },
      legend:{
          display:true,
          position:'bottom',
      },
      animation: {
          onComplete: function () {
            // console.log('an comp')
            var chartInstance = this.chart,
                ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textBaseline = 'bottom';
            ctx.textAlign = "center";
            ctx.font = "20px Open Sans";
            ctx.fillStyle = "black";
            ctx.fontColor= "black";

            this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index]; 
                    // console.log(data)                           
                    // ctx.fillText(data, bar._model.x, bar._model.y + 5);
                    if(data > 20){
                      ctx.fillText(data, bar._model.x, bar._model.y + 25);
                    }else{
                      ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    }
                });
            });
          }
      },
      pointLabelFontFamily : "Quadon Extra Bold",
      scaleFontFamily : "Quadon Extra Bold",
  };

var barChartData = {
      datasets: [{
        label: 'Education',
        backgroundColor: 'rgba(103,126,163,1)',
        // borderColor: 'black',
        borderWidth: 1,
        data: [app.eduTotal]
      },
      {
        label: 'Hospital',
        backgroundColor: 'rgba(163,103,126,1)',
        // borderColor: 'black',
        borderWidth: 1,
        data: [app.hospTotal]
      },
      {
        label: 'Worship',
        backgroundColor: 'rgba(126,163,103,1)',
        // borderColor: 'black',
        borderWidth: 1,
        data: [app.worshipTotal]
      }],
      

  };

 var ctx3 = document.getElementById("Chart3");
app.myChart3 = new Chart(ctx3, {
      type:'bar',
      data:barChartData,
      options: placesChartOption
  });
}





// var pieChart = $('#pieChart');

// var pieChartData = {
//     datasets: [{
//         data: [10, 20, 30],
        
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)',
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 206, 86, 0.6)'
//         ],
//     }],
//     // These labels appear in the legend and in the tooltips when hovering different arcs
//     labels: [
//         'Matt',
//         'Mark',
//         'John'
//     ],

    
// };

// var myPieChart = new Chart(pieChart, {
// 	type:'pie',
// 	data:pieChartData
// })








// // Our labels along the x-axis
// var years = [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050];
// // For drawing the lines
// var africa = [86,114,106,106,107,111,133,221,783,2478];
// var asia = [282,350,411,502,635,809,947,1402,3700,5267];
// var europe = [168,170,178,190,203,276,408,547,675,734];
// var latinAmerica = [40,20,10,16,24,38,74,167,508,784];
// var northAmerica = [6,3,2,2,7,26,82,172,312,433];

// var ctx = document.getElementById("myChart");
// var myChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: years,
//     datasets: [
//       { 
//         data: africa,
//         label: "Africa",
//         borderColor: "#3e95cd",
//         fill: false
//       }
//     ]
//   }
// });
