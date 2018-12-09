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
    .attr('transfrom', `translate(${margin.left}, ${margin.top})`);

// Read data from csv
d3.csv('/data/data.csv', function(error, healthData) {
    // Error handling
    if (error) throw(error);

    // Verify data in the console 
    console.log(healthData);

    // Create a list of state + abbrs
    var states = healthData.map(data => [data.state, data.abbr]);

    // Verify states data in console
    console.log('State Names and abbr:');
    states.forEach(state => {
        console.log(`Full: ${state[0]}, Abbr: ${state[1]}`);
    })

    // Cast the relevant data to a number. Interested in Healthcare vs Poverty
    healthData.forEach(element => {
        element.healthcare = +element.healthcare;
        element.poverty = +element.poverty;
    });

    // max and min values for poverty data
    var povertyLim = [
        d3.min(healthData, d => d.poverty),
        d3.max(healthData, d=> d.povery)
    ];

    // Configure linear scale for poverty x axis
    var xLinearScale = d3.scaleLinear()
        .domain(povertyLim)
        .range([0, chartWidth]);
    
    // linear scake for y axis
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([chartHeight, 0]);

    // create axes that use the previously defined scales
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axiisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append('g')
        .call(leftAxis);

    // Create the circles for the scatter plot
    var circlesGroup = chartGroup.selectAll('circle')
        .data(healthData)
        .enter()
        .append('circle')
        .attr('cx', d=>xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', '30')
        .attr('fill', 'blue')
        .atter('opacity', '0.5');

});
