// @TODO: YOUR CODE HERE!
// SVG setup
var svgWidth = 1000;
var svgHeight = 500;

// define object for chart margins
var margins = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

// def demensions of the chart
var chartWidth = svgWidth - margins.left - margins.right;
var chartHeight = svgHeight - margins.top - margins.bottom;

// select #scatter using d3, append svg
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// append a group area and set margins
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

// Read data from csv
d3.csv('assets/data/data.csv').then(function(healthData) {
    // Error handling
    // if (error) throw(error);

    // Verify data in the console 
    console.log(healthData);

    healthData.forEach(element => {
        element.noHealthInsurance = +element.noHealthInsurance;
        element.poverty = +element.poverty;
    });

    // Configure linear scale for poverty x axis
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain(d3.extent(healthData, d => d.poverty));
      
    
    // linear scake for y axis
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(healthData, d => d.noHealthInsurance)]);

    // create axes that use the previously defined scales
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append('g')
        //.attr('transform', `translate(${margins.left}, 0)`)
        .call(leftAxis);

    // Create the circles for the scatter plot
    chartGroup.selectAll('circle')
        .data(healthData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.noHealthInsurance))
        .attr('r', '10')
        .attr('fill', 'blue')
        .attr('opacity', '0.5')

    // add text abbrevaitions
    chartGroup.selectAll('text')
        .data(healthData)
        .enter()
        .append('text')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.noHealthInsurance))
        .text(healthData.abbr);
});
