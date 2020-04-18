var api = 'https://api.covid19api.com';
var country = 'bangladesh';

var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/countries');
xhr.onreadystatechange = function(){
  if (xhr.readyState === 4) {
    var html_opt = '';
    var data = JSON.parse(xhr.responseText);
    data.forEach(function(item, index, array) {
      if (item.Slug == country) {
        html_opt += '<option selected value="'+item.Slug+'">'+item.Country+'</option>'
      } else {
        html_opt += '<option value="'+item.Slug+'">'+item.Country+'</option>'
      }
    });
    document.getElementById('countries').innerHTML = html_opt;
  }
};
xhr.send();

function getData(country, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api+'/total/country/'+country+'/status/'+type);
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      var count = new Array();
      var diff = new Array();
      var data = JSON.parse(xhr.responseText);

      data.forEach(function(item, index, array) {
        count.push([
          Date.parse(item.Date),
          item.Cases
         ]);

        if (index > 0) {
          diff.push([
            Date.parse(item.Date),
            item.Cases-data[index-1].Cases
          ]);
        }
      });
      callback(count, diff);
    }
  }
  xhr.send();
}

function parseData(type, data) {
  var a = new Array();
  for (var k in data) {
    a.push([Date.parse(data[k].Date), data[k].Cases]);
    stats[type].push([Date.parse(data[k].Date), data[k].Cases]);
  }
  return a;
}

function calculDeathPercent (confirmed, deaths) {
  var a = new Array();
  for (var i in confirmed) {
    a.push([confirmed[i][0], deaths[i][1]/confirmed[i][1]*100]);
  }
  return a;
}

var opt = {
  chart: {
    zoomType: 'x',
    animation: {
      duration: 300
    }
  },
//  annotations: [{
//    labels: [{
//      text: 'Confinement',
//      point: {
//        xAxis: Date.parse('2020-03-16T00:00:00Z')
//      }
//    }]
//  }],
  subtitle: {
    text: ''
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  legend: {
    enabled: true
  },
  plotOptions: {
    area: {
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  }
};

var config = {
  'confirmed': {
    'color': '#52c5fa'
  },
  'deaths': {
    'color': '#fa5271'
  },
  'recovered': {
    'color': '#52fa5a'
  }
}

function countrySelection(country) {

  UpdateCharts(country);

}

function UpdateCharts(country) {

  ['confirmed', 'deaths', 'recovered'].forEach(function(item, index, array) {

    var chart = Highcharts.chart('chart-'+item, opt);
    var chartDiff = Highcharts.chart('chart-'+item+'-diff', opt);

    chart.setTitle({
      text: '# '+item
    });

    chartDiff.setTitle({
      text: 'Diff '+item
    });

    getData(country, item, function(count, diff) {

      chart.addSeries({
        type: 'area',
        name: item,
        color: config[item]['color'],
        data: count
      });

      chartDiff.addSeries({
        type: 'area',
        name: item,
        color: config[item]['color'],
        data: diff
      });

    });

  });

}

document.addEventListener('DOMContentLoaded', function(event) {

  UpdateCharts(country);

});
