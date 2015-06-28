var list = [];

var server = "grazed";

$.getJSON("json/" + server + ".json", function(data) {
  console.log(data);
  _.each(data[0].fm_items, function(item, key){
    var x = _.findWhere(list, {"name" : item["O"]});
    if (x){
      x["amount"] += parseInt(item["a"]);
    }
    else {
      if (item["Q"] === "Equip") list.push({"name" : item["O"], "amount" : parseInt(item["a"])});
    }
  });

  list = _.sortBy(list, 'amount').reverse();
});

 google.load('visualization', '1', {packages: ['corechart', 'bar']});
 google.setOnLoadCallback(drawAxisTickColors);

 function drawAxisTickColors() {

  var graphData = [];
  graphData.push(['Item', 'Amount']);

  for (var i = 0; i < 11; i++){
    graphData.push([list[i]["name"], list[i]["amount"]]);
  }


  var data = google.visualization.arrayToDataTable(graphData);

  var options = {
    title: 'Top 10 Items For Sale In Free Market',
    width: 1200,
    height: 600,
    hAxis: {
      title: 'Amount',
      minValue: 0,
      textStyle : {
        fontSize : 14
      },
      ticks: [10, 20, 30, 40, 50]
    },
    vAxis: { 
      gridlines: { count: 5 },
      textStyle : {
        fontSize : 14
      }
    },
    bar: {groupWidth: "90%"}
  };
  var chart = new google.visualization.BarChart(document.getElementById('bar_chart'));
  chart.draw(data, options);
}

