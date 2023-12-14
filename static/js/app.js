//URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Function to initialize the page with default plot
function init(){
  // Read the sanples.json data using D3 library
    d3.json(url).then(function(data){
        console.log(data);

      // Assign the variables with names and metadata 
       names = data.names;
       metadata = data.metadata;
        console.log(names);
        
        //Populate the dropdown with subject IDs

        // Select the dropdown
        let idDropDown = d3.select("#selDataset");
        // Loop through names list and add each item to the dropdown
        for(i=0;i<names.length;i++){
            let newOption = idDropDown.append("option");
            newOption.attr("value", names[i]);
            newOption.text(names[i]);    
        
        }
        // To plot for the default values
        let dataset = idDropDown.property("value");
        // get the subject ID
        let selectedId  = dataset;

        //Call the function to plot the bar plot
        drawBarPlot(selectedId);

        //Call the function to add the Demographic information
        showDemographics(selectedId);

        //Call the function to plot the bubble chart
        drawBubbleChart(selectedId);

        //Call the function to plot the gauge chart
        drawGuagePlot(selectedId);
    
})}


//Call the init function
init();

// Funciton to plot bar plot
function drawBarPlot(selectedId){
    d3.json(url).then(function(data){
        samplesData = data.samples;

        let val = samplesData.filter(values => values.id == selectedId);
        
        let yValues  = val[0]["otu_ids"].slice(0,10).map(id => `OTU ${id}`).reverse();
        let xValues = val[0]["sample_values"].slice(0,10).reverse();
        let otu_labels = val[0]["otu_labels"].slice(0,10).reverse();

        // Trace for bar plot
        let trace = {

            x: xValues,
            y: yValues,
            text : otu_labels,
            type : "bar",
            orientation : "h"
        };

        Plotly.newPlot("bar", [trace]);

        } )   

}

// Funciton to display demographic information
function showDemographics(selectedId){
    d3.json(url).then(function(data){
        metaData = data.metadata;

        let selectedMetadata = metaData.filter(values => values.id == selectedId);

        d3.select("#sample-metadata").html("");

        Object.entries(selectedMetadata[0]).forEach(([k,v]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(k,v);

            d3.select("#sample-metadata").append("h5").text(`${k}: ${v}`);
        });

    })

}

// Funciton to plot the bubble chart
function drawBubbleChart(selectedId){

  // Get the samples data from URL
    d3.json(url).then(function(data){
        samplesData = data.samples;

        // data related to the selected Id
        let val = samplesData.filter(values => values.id == selectedId);
        
        let otu_ids = val[0]["otu_ids"];
        let sample_values = val[0]["sample_values"];
        let otu_labels = val[0]["otu_labels"];

        // Trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            },
            text: otu_labels
        };

        // Set up the layout
        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1] , layout);

})}


function optionChanged(value) { 

  // get the selectedId
    let selectedId  = value;
    // Log the new value
    console.log(selectedId); 

    // Call all functions 
    showDemographics(selectedId);
    drawBarPlot(selectedId);
    drawBubbleChart(selectedId);
    drawGuagePlot(selectedId);
};


function drawGuagePlot(selectedId){
    d3.json(url).then(function(data){
        metaData = data.metadata;
    
        
    selMetadata = metaData.filter(selValue => selValue.id ==selectedId );
    // Function to calculate angle 
    function valueToAngle(value, min, max) {
        // Assuming a linear scale
        return (value - min) / (max - min) * 180;
      }
  
      // Set up the gauge data - washing frequency
      var value = selMetadata[0].wfreq;  

      // Range - 0 to 9
      var min = 0;
      var max = 9;
      
      // angle for marking
      var angle = valueToAngle(value, min, max);
  
      // data to plot
      var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: value,
          title: { text: "Category" },
          gauge: {
            axis: { range: [min, max] },
            bar: { color: "darkblue" },
            steps: [
              { range: [0, 1], color: "#ff0000" },
              { range: [1, 2], color: "#ff4500" },
              { range: [2, 3], color: "#ffa500" },
              { range: [3, 4], color: "#ffd700" },
              { range: [4, 5], color: "#adff2f" },
              { range: [5, 6], color: "#7fff00" },
              { range: [6, 7], color: "#32cd32" },
              { range: [7, 8], color: "#008000" },
              { range: [8, 9], color: "#006400" }
            ],
          }
        }
      ];
  
      // Set up the gauge layout
      var layout = {
        width: 350,
        height: 350,
        margin: { t: 0, b: 0 }
        
      };
  
      // Create the gauge plot
      Plotly.newPlot('gauge', data, layout);

})}
