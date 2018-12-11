// @TODO: YOUR CODE HERE!
// SVG setup
var svgWidth = 960;
var svgHeight = 500;

// define object for chart margins
var margins = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// def demensions of the chart
var chartWidth = svgWidth - margins.left - margins.right;
var chartHeight = svgHeight - margins.top - margins.bottom;

// select #scatter using d3, append svg
var svg = d3.selectAll('#scatter')
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

    // cast data as a number
    healthData.forEach(element => {
        element.noHealthInsurance = +element.noHealthInsurance;
        element.poverty = +element.poverty;
    });

    var minPov = d3.min(healthData, d => d.poverty);
    var maxPov = d3.max(healthData, d => d.poverty);

    // Configure linear scale for poverty x axis
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([minPov - 2, maxPov]);
        // .domain(d3.extent(healthData, d => d.poverty));
      
    
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
    var bubbleR = 10;

    chartGroup.selectAll('circle')
        .data(healthData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.noHealthInsurance))
        .attr('r', bubbleR)
        .attr('fill', 'blue')
        .attr('opacity', '0.5');

    // add text abbrevaitions
    var abbrFontSize = 10;
    chartGroup.selectAll('text.abbrText')
        .data(healthData)
        .enter()
        .append('text')
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.noHealthInsurance)+abbrFontSize/4)
        .attr('class', 'abbrText')
        .attr('font-size', abbrFontSize)
        .text(data => {
            console.log(data.abbr);
            return (data.abbr);
            });

    // Create axes labels
    // y axis label
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margins.left + 40)
        .attr('x', 0 - (chartHeight/2))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('% Without Health Insurance');

    // x axis label
    chartGroup.append('text')
        .attr('transform', `translate(${chartWidth/2}, ${chartHeight + margins.top + 20})`)
        .attr('class', 'axisText')
        .text('Poverty Rate');
});
