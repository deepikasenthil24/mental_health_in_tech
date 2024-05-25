document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    // CSV data (replace this with your actual CSV data)
    const csvData = `year,self_employed,number_of_employees,tech_company,mental_health_benefits,mental_health_benefits_awareness,employer_mental_health_discussion,employer_mental_health_learning_resources,mental_health_treatment_anonymity,mental_health_leave_accessibility,mental_health_discussion_comfort_coworkers,mental_health_discussion_comfort_supervisor
    2014,No,100-500,Yes,Yes,Yes,No,No,No,Somewhat difficult,Some of them,Some of them
    2014,No,26-100,Yes,Yes,Yes,No,No,Don't know,Don't know,Some of them,Yes`;

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
        drawChart(data, columns[0], columns[1]);

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
        const isDateY = false; // Assuming y-axis columns are not dates

        const parseTime = isDateX ? d3.timeParse('%Y') : null;

        data.forEach(d => {
            if (isDateX) {
                d[xColumn] = parseTime(d[xColumn]);
            } else {
                d[xColumn] = +d[xColumn];
            }
            d[yColumn] = +d[yColumn]; // convert yColumn to number
        });

        const x = isDateX ? d3.scaleTime().range([0, width]) : d3.scaleLinear().range([0, width]);
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
