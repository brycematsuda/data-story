angular.module('data-story', []).controller('ServerController', function($scope) {

  // Current list of GMS servers
  $scope.servers = ["Scania", "Windia", "Bera", "KHROA", "MYBCKN", "GRAZED"];

  // Index of server selected
  $scope.selectedIdx = 0;

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
      var list = $scope.get(server);
      var graphData = [];
      graphData.push(['Item', 'Amount']);

      for (var i = 0; i < 11; i++){
        graphData.push([list[i]["name"], list[i]["amount"]]);
      }

      // Otherwise, load what we already have
      views[server] = google.visualization.arrayToDataTable(graphData);
    }

    // Draw the graph
    $scope.chart.draw(views[server], options);

  };

  // Grabs the JSON and returns a list based on defined params
  // (for now, it just returns the amount of each equip items being sold from highest to lowest)
  $scope.get = function(server){
    $.getJSON("json/" + server + ".json", function(data) {
      _.each(data[0].fm_items, function(item, key){
        var i = _.findWhere(list, {"name" : item["O"]});
        if (i){
          i["amount"] += parseInt(item["a"]);
        }
        else {
          if (item["Q"] === "Equip") list.push({"name" : item["O"], "amount" : parseInt(item["a"])});
        }
      });

      list = _.sortBy(list, 'amount').reverse();
    });

    return list;
  }
});