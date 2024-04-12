//Making a variable with the url to the sample data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
let samples = [];
let metadata = [];

//Using d3.json to call on sample.json
d3.json(url).then(function(data) {
  console.log(data);
  samples = data.samples;
  metadata = data.metadata;

  //Creating the menu to switch between the ids
  const dropdownMenu = d3.select("#selDataset");
  samples.forEach((sample, index) => {
    dropdownMenu.append("option").attr("value", index).text(sample.id);
  });

  init(0);

  dropdownMenu.on("change", function() {
    const selectedIndex = parseInt(dropdownMenu.property("value"));
    updatePlotly(selectedIndex);
  });
});

function init(index) {
  createBarChart(index);
  createBubbleChart(index);
  createGaugeChart(index);
  displayMetadata(index);
}

//Creating the Gauge for wfreq
function createGaugeChart(index) {
  const wfreq = metadata[index].wfreq;

  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Washing Frequency (Times Per Week)" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: 'rgba(232, 226, 202, .5)' },//setting the color scales for the ranges
          { range: [1, 2], color: 'rgba(210, 206, 145, .5)' },
          { range: [2, 3], color: 'rgba(202, 209, 95, .5)' },
          { range: [3, 4], color: 'rgba(170, 202, 42, .5)' },
          { range: [4, 5], color: 'rgba(110, 154, 22, .5)' },
          { range: [5, 6], color: 'rgba(14, 127, 0, .5)' },
          { range: [6, 7], color: 'rgba(10, 120, 22, .5)' },
          { range: [7, 8], color: 'rgba(0, 105, 11, .5)' },
          { range: [8, 9], color: 'rgba(0, 88, 10, .5)' }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: wfreq
        }
      }
    }
  ];

  const layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "white",
    font: { color: "darkblue", family: "Arial" }
  };

  Plotly.newPlot('gauge', data, layout);
}

//Creating the bubble chart for the information 
function createBubbleChart(index) {
  const sample = samples[index];
  const otuIds = sample.otu_ids;
  const sampleValues = sample.sample_values;
  const otuLabels = sample.otu_labels;

  const data = [{
    x: otuIds,
    y: sampleValues,
    mode: "markers",
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: "Plasma"
    },
    text: otuLabels
  }];

  Plotly.newPlot("bubble", data);
}

//Creating the Bar chart for the information 
function createBarChart(index) {
  const sample = samples[index]; //Declaring the values that are going into the graph
  const otuIds = sample.otu_ids.slice(0, 10);//We only want 10 instances at a time
  const sampleValues = sample.sample_values.slice(0, 10);
  const otuLabels = sample.otu_labels.slice(0, 10);

  const data = [{
    x: sampleValues,
    y: otuIds.map(id => `OTU ${id}`),
    text: otuLabels,
    type: "bar",
    orientation: "h"
  }];

  Plotly.newPlot("bar", data);
}

//Calling the data to display it
function displayMetadata(index) {
  const selectedMetadata = metadata[index];
  const metadataContainer = d3.select("#sample-metadata");

  metadataContainer.html("");//making sure the area holding the data is empty

  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataContainer.append("p").text(`${key}: ${value}`);
  });
}

//printing the charts to the webpage
function updatePlotly(index) {
  createBarChart(index);
  createBubbleChart(index);
  createGaugeChart(index);
  displayMetadata(index);
}
