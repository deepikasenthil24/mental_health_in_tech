document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    const csvData = `year,response,mentalhealthcarecoverage,awarenessOfOptions,empDisc,empRes
"2014",Yes,0.414161,0.338506,0.185257,0.205626
"2014",No,0.246363,0.406402,0.660524,0.483996
"2014",Don't Know,0.339476,0.255092,0.154219,0.310378
"2016",Yes,0.499529,0.267483,0.201049, 0.257867
"2016",No,0.200754,0.308566,0.708916, 0.462413
"2016",Don't Know,0.299717,0.307692,0.090035, 0.279720
"2017",Yes,0.581848,0.416796,0.251944, 0.292379
"2017",No,0.147488,0.479005,0.636081, 0.433904
"2017",Don't Know,0.270665,0.000000,0.111975, 0.273717
"2018",Yes,0.626471,0.454294,0.285319,0.324100
"2018",No,0.123529,0.443213,0.631579,0.398892
"2018",Don't Know,0.250000,0.000000,0.083102,0.277008
"2019",Yes,0.573427,0.427632,0.342105, 0.335526
"2019",No,0.122378,0.486842,0.578947,0.427632
"2019",Don't Know,0.304196,0.000000,0.078947,0.236842`;

    // Convert CSV data to Base64
    const base64Data = btoa(csvData);

    // Construct the data URL
    const dataURL = `data:text/csv;base64,${base64Data}`;

    // Populate the select options
    function populateSelectOptions() {
        const xOptions = ['year'];
        const yOptions = ['mentalhealthcarecoverage', 'awarenessOfOptions', 'empDisc', 'empRes'];

        xOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            xAxisSelect.appendChild(optionElement);
        });

        yOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            yAxisSelect.appendChild(optionElement);
        });
    }

    // Populate the select options initially
    populateSelectOptions();

    // Row conversion function to parse year as Date object
    const parseTime = d3.timeParse('%Y');
    function rowConverter(d) {
        return {
            year: parseTime(d.year),
            response: d.response,
            mentalhealthcarecoverage: +d.mentalhealthcarecoverage,
            awarenessOfOptions: +d.awarenessOfOptions,
            empDisc: +d.empDisc,
            empRes: +d.empRes
        };
    }

    // Use the constructed data URL to fetch CSV data
    d3.csv(dataURL, rowConverter).then(data => {
        console.log('CSV data loaded:', data);
        
        // Initial chart draw
        drawChart(data, 'year', 'mentalhealthcarecoverage');

        document.getElementById('update-chart').addEventListener('click', () => {
            const selectedX = xAxisSelect.value;
            const selectedY = yAxisSelect.value;
            console.log('Update button clicked. Selected X:', selectedX, 'Selected Y:', selectedY);
            drawChart(data, selectedX, selectedY);
        });
    }).catch(error => {
        console.error('Error loading the CSV data:', error);
    });

    function drawChart(data, xColumn, yColumn) {
        console.log('Drawing chart with X:', xColumn, 'Y:', yColumn);
        // Clear the existing chart
        d3.select('#chart').selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 60, left: 80 }; // Increased bottom margin for y-axis label
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Check parsed data
        console.log('Transformed data:', data);

        // Group data by response
        const groupedData = d3.group(data, d => d.response);

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, d => d[xColumn]));
        y.domain([0, d3.max(data, d => d[yColumn])]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .call(d3.axisLeft(y));

        // Define color scale for different responses
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const line = d3.line()
            .x(d => x(d[xColumn]))
            .y(d => y(d[yColumn]));

        // Create tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('background', '#fff')
            .style('border', '1px solid #000')
            .style('padding', '10px')
            .style('border-radius', '4px');

        // Function to get description based on the column and response
        function getDescription(response, column) {
            const descriptions = {
                mentalhealthcarecoverage: {
                    'Yes': 'insert description',
                    'No': 'insert description',
                    "Don't Know": 'insert description'
                },
                awarenessOfOptions: {
                    'Yes': 'In the begining, the decrease in 2014-2016 seemed bleak because more people became less aware of their mental health coverage. However, over time employees have signicantly become more aware of their mental health coverage from their company.',
                    'No': 'In the begining, the decrease in 2014-2016 seemed promising that people became more aware of their mental health coverage. However, over time employees have signicantly become aware that they are not aware of their mental health coverage. ',
                    "Don't Know": 'The proportion of employees who are aware of their mental health care available signifcantly decreased over time. We also see from the other line that employees became more aware of their mental health coverage or not at around the same time of this drop. This might indicate that people have beecome more aware of their mental health in terms of coverage in their company.'
                },
                empDisc: {
                    'Yes': 'insert description',
                    'No': 'insert description',
                    "Don't Know": 'insert description'
                },
                empRes: {
                    'Yes': 'insert description',
                    'No': 'insert description',
                    "Don't Know": 'insert description'
                }
            };
            return descriptions[column][response];
        }

        // Draw lines for each response category
        groupedData.forEach((values, key) => {
            console.log(`Drawing line for ${key} with values:`, values);
            const lineGroup = svg.append('g');

            // Draw the line
            lineGroup.append('path')
                .data([values])
                .attr('class', 'line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', color(key))
                .style('stroke-width', '2px')
                .on('mouseover', function () {
                    d3.select(this).style('stroke-width', '4px');
                })
                .on('mouseout', function () {
                    d3.select(this).style('stroke-width', '2px');
                })
                .on('click', function (event) {
                    const description = getDescription(key, yColumn); // Get description based on column and line key
                    // Show tooltip with line name and description
                    tooltip.html(`<strong>${key}</strong>: ${description}`)
                        .style('top', `${event.pageY + 15}px`)
                        .style('left', `${event.pageX + 15}px`)
                        .style('visibility', 'visible');
                    event.stopPropagation(); // Prevent the event from bubbling up to the body click listener
                });

            // Add legend
            svg.append("text")
                .attr("transform", `translate(${width},${y(values[0][yColumn])})`)
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", color(key))
                .text(key);
        });

        // Add axis labels
        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.top + 40})`) // Adjusted position
            .style("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yColumn);

        // Hide tooltip when clicking outside the chart area
        d3.select('body').on('click', function () {
            tooltip.style('visibility', 'hidden');
        });
    }
});
