//https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?q=COUNT(%24p%3D%7BN%2CVV%2CADJ%7D*+%23ASC_DATE%5B2010%2C2015-12-31%5D+%23HAS%5Bauthor%2C%27Angela+Merkel%27%5D)+%23BY%5B%24l%5D+%23DESC_COUNT&ctx=8&fmt=kwic&start=11&limit=10&hint=0

function url_builder(){
     var author_list = document.getElementById("author");
     var author = author_list.options[author_list.selectedIndex].text
     var limit = '10'
     var start_list = document.getElementById("start");
     var date_start = start_list.options[start_list.selectedIndex].text
     var stop_list = document.getElementById("stop");
     var date_end = stop_list.options[stop_list.selectedIndex].text
     return 'https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?'+
                            'q=COUNT(%24p%3D{N%2CVV%2CADJ}*+' +
                            '%23ASC_DATE['+ date_start +'%2C'+ date_end +'-12-31]+' +
                            '%23HAS[author%2C%27' +  author + '%27])+'+
                            '%23BY[%24l]+' +
                            '%23DESC_COUNT&ctx=8&fmt=json&start=11&limit='+ limit +'&hint=0';

}

async function getWords() {
     url = url_builder();
     const response = await fetch(url);
     const data = await response.json();
     return data.counts_
}

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var layout;

getWords().then(words => {
            allWords = []
            for(k in words){
                allWords.push(words[k][1])
            }
            layout = d3.layout.cloud()
              .size([width, height])
              .words(allWords.map(function(d) { return {text: d}; }))
              .padding(10)        //space between words
              .fontSize(20)      // font size of words
              .on("end", draw);
            layout.start();
          });

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", 20)
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")";
        })
        .text(function(d) { return d.text; });
}

function rerun(){
    d3.select("#my_dataviz").selectAll("text").remove();
    getWords().then(words => {
                allWords = []
                for(k in words){
                    allWords.push(words[k][1])
                }
                layout = d3.layout.cloud()
                  .size([width, height])
                  .words(allWords.map(function(d) { return {text: d}; }))
                  .padding(10)        //space between words
                  .fontSize(20)      // font size of words
                  .on("end", draw);
                layout.start();
              });
}