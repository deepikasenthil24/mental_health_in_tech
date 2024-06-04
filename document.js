document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    const csvData = `year,response,mentalhealthcarecoverage,awarenessOfOptions,empDisc,empRes
"2014",Yes,0.414161,0.338506,0.185257,0.205626
"2014",No,0.246363,0.406402,0.660524,0.483996
"2014",Don't Know,0.339476,0.255092,0.154219,0.310378
"2016",Yes,0.499529,0.267483,0.201049,0.257867
"2016",No,0.200754,0.308566,0.708916,0.462413
"2016",Don't Know,0.299717,0.307692,0.090035,0.279720
"2017",Yes,0.581848,0.416796,0.251944,0.292379
"2017",No,0.147488,0.479005,0.636081,0.433904
"2017",Don't Know,0.270665,0.000000,0.111975,0.273717
"2018",Yes,0.626471,0.454294,0.285319,0.324100
"2018",No,0.123529,0.443213,0.631579,0.398892
"2018",Don't Know,0.250000,0.000000,0.083102,0.277008
"2019",Yes,0.573427,0.427632,0.342105,0.335526
"2019",No,0.122378,0.486842,0.578947,0.427632
"2019",Don't Know,0.304196,0.000000,0.078947,0.236842`;

    const csvData2 = `company_size,mentalhealthcarecoverage,awarenessOfOptions,empDisc,empRes
"[1-5]",0.14,0.22666666666666666,0.11333333333333333,0.10666666666666667
"[6-25]",0.2792511700468019,0.21996879875195008,0.0904836193447738,0.0842433697347894
"[26-100]",0.42712294043092525,0.30925221799746516,0.16603295310519645,0.15082382762991128
"[100-500]",0.5442708333333334,0.3854166666666667,0.23567708333333334,0.27734375
"[500-1000]",0.5843621399176955,0.41975308641975306,0.32098765432098764,0.3497942386831276
"More than 1000",0.6689113355780022,0.4489337822671156,0.36475869809203143,0.4792368125701459`;

    const base64Data = btoa(csvData);
    const base64Data2 = btoa(csvData2);

    const dataURL = `data:text/csv;base64,${base64Data}`;
    const dataURL2 = `data:text/csv;base64,${base64Data2}`;

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

    populateSelectOptions();

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

    function rowConverter2(d) {
        return {
            company_size: d.company_size,
            mentalhealthcarecoverage: +d.mentalhealthcarecoverage,
            awarenessOfOptions: +d.awarenessOfOptions,
            empDisc: +d.empDisc,
            empRes: +d.empRes
        };
    }

    d3.csv(dataURL, rowConverter).then(data => {
        console.log('CSV data loaded:', data);

        d3.csv(dataURL2, rowConverter2).then(data2 => {
            console.log('Second CSV data loaded:', data2);

            drawChart(data, 'year', 'mentalhealthcarecoverage');
            drawBarChart(data2, 'mentalhealthcarecoverage');
            updateSubtitle('mentalhealthcarecoverage');

            document.getElementById('update-chart').addEventListener('click', () => {
                const selectedX = xAxisSelect.value;
                const selectedY = yAxisSelect.value;
                console.log('Update button clicked. Selected X:', selectedX, 'Selected Y:', selectedY);
                drawChart(data, selectedX, selectedY);
                drawBarChart(data2, selectedY);
                updateSubtitle(selectedY);
            });
        }).catch(error => {
            console.error('Error loading the second CSV data:', error);
        });
    }).catch(error => {
        console.error('Error loading the CSV data:', error);
    });

    function updateSubtitle(yAxisName) {
        const subtitle = document.getElementById('subtitle');
        switch (yAxisName) {
            case 'mentalhealthcarecoverage':
                subtitle.textContent = "Does your employer provide mental health benefits as part of healthcare coverage?";
                break;
            case 'awarenessOfOptions':
                subtitle.textContent = "Do you know the options for mental health care available under your employer-provided coverage?";
                break;
            case 'empDisc':
                subtitle.textContent = "Has your employer ever formally discussed mental health (for example, as part of a wellness campaign or other official)?";
                break;
            case 'empRes':
                subtitle.textContent = "Does your employer offer resources to learn more about mental health concerns and options for seeking help?";
                break;
            default:
                subtitle.textContent = "";
        }
    }

    function drawChart(data, xColumn, yColumn) {
        console.log('Drawing chart with X:', xColumn, 'Y:', yColumn);
        d3.select('#chart').selectAll('*').remove();

        const margin = { top: 20, right: 150, bottom: 60, left: 80 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        console.log('Transformed data:', data);

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

        const colorMapping = {
            'Yes': 'purple',
            'No': 'pink',
            "Don't Know": '#0000CD' // Darker blue
        };

        const line = d3.line()
            .x(d => x(d[xColumn]))
            .y(d => y(d[yColumn]));

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('background', '#fff')
            .style('border', '1px solid #000')
            .style('padding', '10px')
            .style('border-radius', '4px');

            function getDescription(response, column) {
                const descriptions = {
                    mentalhealthcarecoverage: {
                        'Yes': 'insert description',
                        'No': 'insert description',
                        "Don't Know": 'insert description'
                    },
                    awarenessOfOptions: {
                        'Yes': 'In the beginning, the decrease in 2014-2016 seemed bleak because more people became less aware of their mental health coverage. However, over time employees have significantly become more aware of their mental health coverage from their company.',
                        'No': 'In the beginning, the decrease in 2014-2016 seemed promising that people became more aware of their mental health coverage. However, over time employees have significantly become aware that they are not aware of their mental health coverage.',
                        "Don't Know": 'The proportion of employees who are aware of their mental health care available significantly decreased over time. We also see from the other line that employees became more aware of their mental health coverage or not at around the same time of this drop. This might indicate that people have become more aware of their mental health in terms of coverage in their company.'
                    },
                    empDisc: {
                        'Yes': 'Employees who responded "Yes" experienced an increase in discrimination over time.',
                        'No': 'Employees who responded "No" experienced a high level of discrimination that remained relatively stable over time.',
                        "Don't Know": 'Employees who responded "Don\'t Know" experienced fluctuations in discrimination, with notable decreases at certain points.'
                    },
                    empRes: {
                        'Yes': 'Employees who responded "Yes" experienced an increase in resources over time.',
                        'No': 'Employees who responded "No" experienced lower availability of resources that fluctuated over time.',
                        "Don't Know": 'Employees who responded "Don\'t Know" had varying levels of resources, with some significant drops.'
                    }
                };
                return descriptions[column][response];
            }
    
            groupedData.forEach((values, key) => {
                console.log(`Drawing line for ${key} with values:`, values);
                const lineGroup = svg.append('g');
    
                lineGroup.append('path')
                    .data([values])
                    .attr('class', 'line')
                    .attr('d', line)
                    .style('fill', 'none')
                    .style('stroke', colorMapping[key])
                    .style('stroke-width', '2px')
                    .on('mouseover', function () {
                        d3.select(this).style('stroke-width', '4px');
                    })
                    .on('mouseout', function () {
                        d3.select(this).style('stroke-width', '2px');
                    })
                    .on('click', function (event) {
                        const description = getDescription(key, yColumn);
                        tooltip.html(`<strong>${key}</strong>: ${description}`)
                            .style('top', `${event.pageY + 15}px`)
                            .style('left', `${event.pageX + 15}px`)
                            .style('visibility', 'visible');
                        event.stopPropagation();
                    });
    
                const legend = svg.append('g')
                    .attr('class', 'legend')
                    .attr('transform', `translate(${width + 30},${key === 'Yes' ? 0 : (key === 'No' ? 20 : 40)})`);
    
                legend.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 10)
                    .attr('height', 10)
                    .style('fill', colorMapping[key]);
    
                legend.append('text')
                    .attr('x', 15)
                    .attr('y', 8)
                    .text(key)
                    .style('font-size', '10px')
                    .attr('alignment-baseline', 'middle');
            });
    
            svg.append("text")
                .attr("transform", `translate(${width / 2},${height + margin.top + 40})`)
                .style("text-anchor", "middle")
                .text("Year");
    
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(yColumn);
    
            d3.select('body').on('click', function () {
                tooltip.style('visibility', 'hidden');
            });
        }
    
        function drawBarChart(data, yColumn) {
            console.log('Drawing bar chart with Y:', yColumn);
            d3.select('#bar-chart').selectAll('*').remove();
        
            const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased left margin to provide more space
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
        
            const svg = d3.select('#bar-chart').append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
        
            const x = d3.scaleBand()
                .domain(data.map(d => d.company_size))
                .range([0, width])
                .padding(0.1);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[yColumn])])
                .nice()
                .range([height, 0]);
        
            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-45)')
                .attr('font-family', 'Playfair Display'); // Set font-family
        
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 10)
                .style('text-anchor', 'middle')
                .attr('font-family', 'Playfair Display') // Set font-family
                .text('Size of Company'); // Set x-axis label
        
            svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'end')
                .text('Proportion of Companies') // Set y-axis label
                .attr('font-family', 'Playfair Display'); // Set font-family
        
            // Centered y-axis title and adjusted to avoid overlap with y-axis labels
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left + 10) // Adjusted to push further left
                .attr('x', 0 - (height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('font-family', 'Playfair Display') // Set font-family
                .text('Proportion of Companies');
        
            const colors = ["#afc9de", "#8bafc6", "#6baed6", "#4b97c3", "#2f7fae", "#19608a"];
        
            svg.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.company_size))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d[yColumn]))
                .attr('height', d => height - y(d[yColumn]))
                .style('fill', (d, i) => colors[i]);
        
            // Title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 0 - (margin.top / 2))
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-family', 'Playfair Display') // Set font-family
                .text('Does your employer provide mental health benefits as part of healthcare coverage?');
        }
        
        
        
    });
    

