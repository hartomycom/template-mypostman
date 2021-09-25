var template = `
<script src="https://d3js.org/d3.v5.min.js"></script>
<div id="table"></div>
<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700);
#title{width:50%;margin:0 auto;text-align:center}
body{font-family:'Open Sans',sans-serif}table{width:100%;border-collapse:collapse;padding: 16px;font-size: 12px;}
thead{background-color:#f5f5f5}border th,td,td:first-child,td:last-child,th:first-child,th:last-child{padding:12px 15px}
th{background-color:#90a4ae;border: 1px solid #ddd;padding:1em .5em;text-align:center}
td{border: 1px solid #ddd;color:#676769}tbody tr:nth-child(odd){background-color:#fff;transition:.3s}
tbody tr:nth-child(even){background-color:#f5f5f5;transition:.3s}
tbody tr:hover{filter:brightness(90%)}.api{cursor:pointer}.api:active{color:#202128}
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

/* DATA PARSING */
function parseData(response, host) {
    // const results = response.map(obj => [obj.title, obj.abstract, obj.published_date, obj.url]); // versi per nama key
    const results = response.map(obj => Object.values(obj));

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
  results: JSON.stringify(parseData(response.data)[0]),
  headers: JSON.stringify(parseData(response.data)[1]),
  host
});