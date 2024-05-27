document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    const csvData = `year,response,mentalhealthcarecoverage
2014,Yes,0.414161
2014,No,0.246363
2014,Don't Know,0.339476
2016,Yes,0.499529
2016,No,0.200754
2016,Don't Know,0.299717
2017,Yes,0.581848
2017,No,0.147488
2017,Don't Know,0.270665
2018,Yes,0.626471
2018,No,0.123529
2018,Don't Know,0.250000
2019,Yes,0.573427
2019,No,0.122378
2019,Don't Know,0.304196`;

    // Convert CSV data to Base64
    const base64Data = btoa(csvData);

    // Construct the data URL
    const dataURL = `data:text/csv;base64,${base64Data}`;

    // Use the constructed data URL to fetch CSV data
    d3.csv(dataURL).then(data => {
        console.log('CSV data loaded:', data);
        const columns = Object.keys(data[0]);
        console.log('Column names:', columns);

        // Populate the select options
        columns.forEach(column => {
            console.log('Adding option for column:', column);
            const optionX = document.createElement('option');
            optionX.value = column;
            optionX.text = column;
            xAxisSelect.appendChild(optionX);

            const optionY = document.createElement('option');
            optionY.value = column;
            optionY.text = column;
            yAxisSelect.appendChild(optionY);
        });

        console.log('Dropdowns populated');

        // Initial chart draw
        drawChart(data, columns[0], columns[2]); // Default to x: year, y: mentalhealthcarecoverage

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

        // Determine data types for x and y columns
        const isDateX = xColumn === 'year'; // Assuming 'year' is the date column

        const parseTime = isDateX ? d3.timeParse('%Y') : null;

        // Transform data
        data.forEach(d => {
            if (isDateX) {
                d[xColumn] = parseTime(d[xColumn]);
            }
            d[yColumn] = +d[yColumn]; // convert yColumn to number
        });

        // Group data by response
        const groupedData = d3.group(data, d => d.response);

        const x = isDateX ? d3.scaleTime().range([0, width]) : d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3.line()
            .x(d => x(d[xColumn]))
            .y(d => y(d[yColumn]));

        x.domain(d3.extent(data, d => d[xColumn]));
        y.domain([0, d3.max(data, d => d[yColumn])]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .call(d3.axisLeft(y));

        // Define color scale for different responses
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw lines for each response category
        groupedData.forEach((values, key) => {
            svg.append('path')
                .data([values])
                .attr('class', 'line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', color(key))
                .style('stroke-width', '2px');
        });
    }
});
