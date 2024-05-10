var template = `
<script src="https://d3js.org/d3.v5.min.js"></script>
<div id="table"></div>
<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700);
#title{width:50%;margin:0 auto;text-align:center}
body{font-family:'Open Sans',sans-serif;background-color: #1E1E1E;color: #FFFFFF;}
table{width:100%;border-collapse:collapse;padding: 16px;font-size: 12px;color: #FFFFFF;}
thead{background-color:#212121;}
th,td,td:first-child,td:last-child,th:first-child,th:last-child{padding:12px 15px;}
th{background-color:#212121;border: 1px solid #424242;padding:1em .5em;text-align:center;}
td{border: 1px solid #424242;color:#FFFFFF;}
tbody tr:nth-child(odd){background-color:#333333;transition:.3s;}
tbody tr:nth-child(even){background-color:#2C2C2C;transition:.3s;}
tbody tr:hover{filter:brightness(90%);}
.api{cursor:pointer;color: #00ADB5;}
.api:active{color:#80cbc4;}
</style>
<script>
    const results = {{{results}}};
    const headers = {{{headers}}};
    var table = d3.select("#table").append("table");
    var header = table.append("thead").append("tr");
    
    // creates the headers
    header
      .selectAll("th")
        .data(headers)
        .enter()
      .append("th")
        .text(function(d) {return d;});
    var tablebody = table.append("tbody");
    rows = tablebody
      .selectAll("tr")
        .data(results)
        .enter()
      .append("tr");

    // looping row kedalam bentu array, jadi ini akan masuk kedalam table cell
    cells = rows.selectAll("td")
        .data(function(d) {
            return d;
        })
        .enter()
      .append("td")
        .text(function(d) {
            return d;
        })
      .filter(function(d) {return isEndpoint(d)})
        .attr('onclick', function(d) {
            return 'copy(\"' + d + '\")'
        })
        .attr('class', 'api');
        
    function copy(text) {
        const el = document.createElement('textarea');
        el.value = text;
        el.style = {display: 'none'};
        document.body.append(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
    
    function isEndpoint(url) {
        const host = '{{host}}'
        return url.toString().indexOf(host) !== -1
    }
    
</script>`;

// Host checks for nested API endpoints and makes them copyable-on-click
const host = pm.request.url.host.join(".");
const response = pm.response.json();
const resdata = response.data

/* DATA PARSING */
function parseData(response, host) {
  // const results = response.map(obj => [obj.title, obj.abstract, obj.published_date, obj.url]); // versi per nama key
  const results = response.map(obj => Object.values(obj));

  // const headers = ["TITLE", "ABSTRACT", "PUBLISHED DATE", "URL"]; // versi array
  // const headers = ["TITLE", "ABSTRACT", "PUBLISHED DATE", "URL"]; // versi array
  const headers = Array.from(
    response.reduce((keys, cur) => {
      for (const key of Object.keys(cur)) {
        keys.add(key);
      }
      return keys;
    }, new Set())
  );
  return [results, headers]
}

/* FEED DATA INTO TEMPLATE */
pm.visualizer.set(template, {
  // Variable template akan menerima respon dari data result dan header
  // .data adalah nama key array object untuk ditampilkan ke table
  results: JSON.stringify(parseData(resdata)[0].map(val => 
    val.map(item => typeof item == 'object' ? JSON.stringify(item) : item ))
  ),
  headers: JSON.stringify(parseData(resdata)[1]),
  host
});
