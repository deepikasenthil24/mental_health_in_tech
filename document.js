document.addEventListener('DOMContentLoaded', function () {
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    d3.csv('survey_2014-2019.csv').then(data => {
        const columns = Object.keys(data[0]);

        // Populate the select options
        columns.forEach(column => {
            const optionX = document.createElement('option');
            optionX.value = column;
            optionX.text = column;
            xAxisSelect.add(optionX);

            const optionY = document.createElement('option');
            optionY.value = column;
            optionY.text = column;
            yAxisSelect.add(optionY);
        });

        // Initial chart draw
        drawChart(data, columns[0], columns[1]);

        document.getElementById('update-chart').addEventListener('click', () => {
            const selectedX = xAxisSelect.value;
            const selectedY = yAxisSelect.value;
            drawChart(data, selectedX, selectedY);
        });
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });

    function drawChart(data, xColumn, yColumn) {
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

        const parseTime = d3.timeParse('%Y-%m-%d');

        // Determine if xColumn is a date
        const isDate = !isNaN(Date.parse(data[0][xColumn]));

        data.forEach(d => {
            if (isDate) {
                d[xColumn] = parseTime(d[xColumn]);
            } else {
                d[xColumn] = +d[xColumn];
            }
            d[yColumn] = +d[yColumn]; // convert yColumn to number
        });

        const x = isDate ? d3.scaleTime().range([0, width]) : d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3.line()
            .x(d => x(d[xColumn]))
            .y(d => y(d[yColumn]));

        x.domain(d3.extent(data, d => d[xColumn]));
        y.domain(d3.extent(data, d => d[yColumn]));

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .call(d3.axisLeft(y));

        svg.append('path')
            .data([data])
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', 'steelblue')
            .style('stroke-width', '2px');
    }
});
