google.load('visualization', '1', {packages: ['corechart', 'bar']});
angular.module('data-story', []).controller('ServerController', function($scope) {

  // Current list of GMS servers
  $scope.servers = ["Scania", "Windia", "Bera", "KHROA", "MYBCKN", "GRAZED"];

  // Index of server selected
  $scope.selectedIdx = -1;

  // Current chart being displayed
  $scope.chart = new google.visualization.BarChart(document.getElementById('bar_chart'));

  // Chart options
  var options = {
    title: 'Top 10 Items For Sale In Free Market',
    width: 1200,
    height: 600,
    hAxis: {
      title: 'Amount',
      minValue: 0,
      textStyle : {
        fontSize : 14
      }
    },
    vAxis: { 
      gridlines: { count: 5 },
      textStyle : {
        fontSize : 14
      }
    },
    bar: {groupWidth: "90%"}
  };

  // "Cached" views to be reused later (instead of parsing the json every time)
  var views = {};

  // Called when a user clicks on a server nav pill
  $scope.serverClicked = function ($index){
    $scope.selectedIdx = $index;
    var server = $scope.servers[$index].toLowerCase();

    // If the chart for the server doesn't already exist,
    // parse the json and make a new one.
    if (views[server] === undefined){
      var list = $scope.get($index);
      var graphData = [];
      graphData.push(['Item', 'Amount', { role: 'annotation' }]);

      for (var i = 0; i < 11; i++){
        graphData.push([list[i]["name"], list[i]["amount"], list[i]["amount"]]);
      }

      // Otherwise, load what we already have
      views[server] = google.visualization.arrayToDataTable(graphData);
    }

    // Draw the graph
    $scope.chart.draw(views[server], options);

    $("p#intro").remove();

  };

  // Grabs the JSON and returns a list based on defined params
  // (for now, it just returns the amount of each equip items being sold from highest to lowest)
  $scope.get = function(index){
    var list = [];
    $.ajax({
      async: false,
      type: "GET",
      url: "http://maple.fm/api/2/search?server=" + index + "&stats=0&desc=0",
      success: function(data){
        _.each(data.fm_items, function(item, key){
          var i = _.findWhere(list, {"name" : item["name"]});
          if (i) i["amount"] += parseInt(item["quantity"]);
          else {
            if (item["category"] === "Equip"){
              list.push({"name" : item["name"], "amount" : parseInt(item["quantity"])});
            }
          }
        })
      }
    });

    return _.sortBy(list, 'amount').reverse();
  };
});