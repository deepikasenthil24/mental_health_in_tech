document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    const csvData = `year,response,mentalhealthcarecoverage,awarenessOfOptions
"2014",Yes,0.414161,0.338506
"2014",No,0.246363,0.406402
"2014",Don't Know,0.339476,0.255092
"2016",Yes,0.499529,0.267483
"2016",No,0.200754,0.308566
"2016",Don't Know,0.299717,0.307692
"2017",Yes,0.581848,0.416796
"2017",No,0.147488,0.479005
"2017",Don't Know,0.270665,0.000000
"2018",Yes,0.626471,0.454294
"2018",No,0.123529,0.443213
"2018",Don't Know,0.250000,0.000000
"2019",Yes,0.573427,0.427632
"2019",No,0.122378,0.486842
"2019",Don't Know,0.304196,0.000000`;

    // Convert CSV data to Base64
    const base64Data = btoa(csvData);

    // Construct the data URL
    const dataURL = `data:text/csv;base64,${base64Data}`;

    // Populate the select options
    function populateSelectOptions() {
        const xOptions = ['year'];
        const yOptions = ['mentalhealthcarecoverage', 'awarenessOfOptions'];

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
            awarenessOfOptions: +d.awarenessOfOptions
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

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
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

        // Draw lines for each response category
        groupedData.forEach((values, key) => {
            console.log(`Drawing line for ${key} with values:`, values);
            svg.append('path')
                .data([values])
                .attr('class', 'line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', color(key))
                .style('stroke-width', '2px');

            // Add legend
            svg.append("text")
                .attr("transform", `translate(${width},${y(values[0][yColumn])})`)
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", color(key))
                .text(key);
        });
    }
});
