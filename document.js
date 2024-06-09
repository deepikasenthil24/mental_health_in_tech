document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    const csvData = `year,response,mentalHealthCoverage,awarenessOfOptions,employeerDiscussion,employeerResources
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

    const csvData2 = `company_size,mentalHealthCoverage,awarenessOfOptions,employeerDiscussion,employeerResources
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

    // Define your CSV data
    const csvData3 = `istechcomp,mentalHealthCoverage,awarenessOfOptions,employeerDiscussion,employeerResources
    "Not Tech Company",410,298,238,284
    "Tech Company",1283,919,238,630`;

    // Parse the CSV data
    const parsedData3 = d3.csvParse(csvData3);

    function populateSelectOptions() {
        const xOptions = ['year'];
        const yOptions = ['mentalHealthCoverage', 'awarenessOfOptions', 'employeerDiscussion', 'employeerResources'];

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
            mentalHealthCoverage: +d.mentalHealthCoverage,
            awarenessOfOptions: +d.awarenessOfOptions,
            employeerDiscussion: +d.employeerDiscussion,
            employeerResources: +d.employeerResources
        };
    }

    function rowConverter2(d) {
        return {
            company_size: d.company_size,
            mentalHealthCoverage: +d.mentalHealthCoverage,
            awarenessOfOptions: +d.awarenessOfOptions,
            employeerDiscussion: +d.employeerDiscussion,
            employeerResources: +d.employeerResources
        };
    }

    function rowConverter3(d) {
        return {
            istechcomp: d.istechcomp,
            mentalHealthCoverage: +d.mentalHealthCoverage,
            awarenessOfOptions: +d.awarenessOfOptions,
            employeerDiscussion: +d.employeerDiscussion,
            employeerResources: +d.employeerResources
        };
    }

    function getChartTitle(selectedY) {
        switch (selectedY) {
            case 'mentalHealthCoverage':
                return 'Mental Health Coverage';
            case 'awarenessOfOptions':
                return 'Awareness of Options';
            case 'employeerDiscussion':
                return 'Employer Discussion';
            case 'employeerResources':
                return 'Employer Resources';
            default:
                return 'Default Title';
        }
    }    

    d3.csv(dataURL, rowConverter).then(data => {
        console.log('CSV data loaded:', data);

        d3.csv(dataURL2, rowConverter2).then(data2 => {
            console.log('Second CSV data loaded:', data2);

            drawChart(data, 'year', 'mentalHealthCoverage');
            drawBarChart(data2, 'mentalHealthCoverage', 'Employer-Provided Mental Health Coverage Across Company Sizes');
            drawPieChart(parsedData3, 'mentalHealthCoverage', "Out of the people who said that their employer provides mental health benefits as part of healthcare coverage, which percentage of them work at a company that primarily delivers tech products/services?");
            updateSubtitle('mentalHealthCoverage');

            document.getElementById('update-chart').addEventListener('click', () => {
                const selectedX = xAxisSelect.value;
                const selectedY = yAxisSelect.value;
                console.log('Update button clicked. Selected X:', selectedX, 'Selected Y:', selectedY);
                drawChart(data, selectedX, selectedY);
                drawBarChart(data2, selectedY, getChartTitle(selectedY));
                updateSubtitle(selectedY);

                let filteredData = parsedData3;
                switch (selectedY) {
                    case 'mentalHealthCoverage':
                        filteredData = parsedData3;
                        break;
                    case 'awarenessOfOptions':
                        filteredData = parsedData3;
                        break;
                    case 'employeerDiscussion':
                        filteredData = parsedData3;
                        break;
                    case 'employeerResources':
                        filteredData = parsedData3;
                        break;
                    default:
                        filteredData = parsedData3;
                }

                // Draw the pie chart with the filtered data and selected y-axis value
                drawPieChart(filteredData, selectedY, getChartTitle2(selectedY));
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
            case 'mentalHealthCoverage':
                subtitle.textContent = "Does your employer provide mental health benefits as part of healthcare coverage?";
                break;
            case 'awarenessOfOptions':
                subtitle.textContent = "Do you know the options for mental health care available under your employer-provided coverage?";
                break;
            case 'employeerDiscussion':
                subtitle.textContent = "Has your employer ever formally discussed mental health (for example, as part of a wellness campaign or other official)?";
                break;
            case 'employeerResources':
                subtitle.textContent = "Does your employer offer resources to learn more about mental health concerns and options for seeking help?";
                break;
            default:
                subtitle.textContent = "";
        }
    }

    function getChartTitle(yColumn) {
        switch (yColumn) {
            case 'mentalHealthCoverage':
                return "Employer-Provided Mental Health Coverage Across Company Sizes";
            case 'awarenessOfOptions':
                return "Employee Awareness of Mental Health Care Options by Company Size";
            case 'employeerDiscussion':
                return "Formal Discussions on Mental Health in the Workplace by Company Size";
            case 'employeerResources':
                return "Provision of Mental Health Resources by Employers and Company Size";
            default:
                return "";
        }
    }

    function getChartTitle2(yColumn) {
        switch (yColumn) {
            case 'mentalHealthCoverage':
                return "Out of the people who said that their employer provides mental health benefits as part of healthcare coverage, which percentage of them work at a company that primarily delivers tech products/services?";
            case 'awarenessOfOptions':
                return "Out of the people who said that they know the options for mental health care available under their employer-provided coverage, which percentage of them work at a company that primarily delivers tech products/services?";
            case 'employeerDiscussion':
                return "Out of the people who said that their employer has previously formally discussed mental health, which percentage of them work at a company that primarily delivers tech products/services?";
            case 'employeerResources':
                return "Out of the people who said that their employer offers resources to learn more about mental health concerns and options for seeking health, which percentage of them work at a company that primarily delivers tech products/services?";
            default:
                return "";
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
                mentalHealthCoverage: {
                    'Yes': 'insert description',
                    'No': 'insert description',
                    "Don't Know": 'insert description'
                },
                awarenessOfOptions: {
                    'Yes': 'In the beginning, the decrease in 2014-2016 seemed bleak because more people became less aware of their mental health coverage. However, over time employees have significantly become more aware of their mental health coverage from their company.',
                    'No': 'In the beginning, the decrease in 2014-2016 seemed promising that people became more aware of their mental health coverage. However, over time employees have significantly become aware that they are not aware of their mental health coverage.',
                    "Don't Know": 'The proportion of employees who are aware of their mental health care available significantly decreased over time. We also see from the other line that employees became more aware of their mental health coverage or not at around the same time of this drop. This might indicate that people have become more aware of their mental health in terms of coverage in their company.'
                },
                employeerDiscussion: {
                    'Yes': 'Employees who responded "Yes" experienced an increase in discrimination over time.',
                    'No': 'Employees who responded "No" experienced a high level of discrimination that remained relatively stable over time.',
                    "Don't Know": 'Employees who responded "Don\'t Know" experienced fluctuations in discrimination, with notable decreases at certain points.'
                },
                employeerResources: {
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
                    const [mouseX, mouseY] = d3.pointer(event);
                    const pathLength = this.getTotalLength();
                    let beginning = 0,
                        end = pathLength,
                        target = null;
        
                    while (true) {
                        const position = Math.floor((beginning + end) / 2);
                        target = this.getPointAtLength(position);
                        if ((position === end || position === beginning) && target.x !== mouseX) {
                            break;
                        }
                        if (target.x > mouseX) end = position;
                        else if (target.x < mouseX) beginning = position;
                        else break; //position found
                    }
        
                    tooltip.html(`<strong>${key}</strong>: y-axis: ${y.invert(target.y).toFixed(2)}`)
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
    
            // Add arrow and annotation for "Yes" line at x value 2018
            if (key === 'Yes' && yColumn === 'mentalHealthCoverage') {
                const point2018 = values.find(d => new Date(d[xColumn]).getFullYear() === 2018);
                if (point2018) {
                    const xPos = x(new Date(point2018[xColumn]));
                    const yPos = y(point2018[yColumn]);
    
                    // Add arrow
                    svg.append("line")
                        .attr("x1", xPos - 20) // Adjusted to tilt the line
                        .attr("y1", yPos + 50)
                        .attr("x2", xPos)
                        .attr("y2", yPos)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)");
    
                    // Add annotation text within a box-like element
                    svg.append("foreignObject")
                        .attr("x", xPos - 120) // Adjusted to position annotation
                        .attr("y", yPos + 55)  // Adjusted to position annotation below the arrow
                        .attr("width", 250)     // Adjust the width as needed
                        .attr("height", 100)     // Adjust the height as needed
                        .append("xhtml:div")
                        .style("font", "12px 'Arial'")
                        .style("color", "black")
                        .style("background", "rgba(255, 255, 255, 0.7)")
                        .style("padding", "5px")
                        .style("border-radius", "5px")
                        .html(`Over the past few years it seems like companies have had an increase in mental health benefits provided in employees health care coverage. This is also apparent in the other lines we can see that typically there is decrease over time especially in the "no" line.`);
    
                    // Define arrow marker
                    svg.append("defs").append("marker")
                        .attr("id", "arrow")
                        .attr("viewBox", "0 0 10 10")
                        .attr("refX", 8) // Adjusted to fix the arrow head
                        .attr("refY", 5)
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", "M 0 0 L 10 5 L 0 10 z")
                        .attr("fill", "black");
                }
            }
    
            // Add arrow and annotation for "Don't Know" line at x value 2017 for awarenessOfOptions
            if (key === "Don't Know" && yColumn === 'awarenessOfOptions') {
                const point2017 = values.find(d => new Date(d[xColumn]).getFullYear() === 2017);
                if (point2017) {
                    const xPos = x(new Date(point2017[xColumn]));
                    const yPos = y(point2017[yColumn]);
    
                    // Add arrow
                    svg.append("line")
                        .attr("x1", xPos + 20) // Adjusted to tilt the line to the right
                        .attr("y1", yPos - 50)
                        .attr("x2", xPos)
                        .attr("y2", yPos)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)");
    
                    // Add annotation text within a box-like element
                    svg.append("foreignObject")
                        .attr("x", xPos + 30) // Adjusted to position annotation
                        .attr("y", yPos - 120)  // Adjusted to position annotation above the arrow
                        .attr("width", 250)     // Adjust the width as needed
                        .attr("height", 130)    // Adjust the height as needed
                        .append("xhtml:div")
                        .style("font", "12px 'Arial'")
                        .style("color", "black")
                        .style("background", "rgba(255, 255, 255, 0.7)")
                        .style("padding", "5px")
                        .style("border-radius", "5px")
                        .html(`In 2017, there was a significant drop in awareness of mental health coverage options among employees. This suggests that employees are becoming more aware of whether or not they know the mental health care options provided in their health care plan.`)
                    // Define arrow marker if not already defined
                    svg.append("defs").append("marker")
                        .attr("id", "arrow")
                        .attr("viewBox", "0 0 10 10")
                        .attr("refX", 8)
                        .attr("refY", 5)
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", "M 0 0 L 10 5 L 0 10 z")
                        .attr("fill", "black");
                }
            }
            if (key === 'Yes' && yColumn === 'employeerDiscussion') {
                const point2018 = values.find(d => new Date(d[xColumn]).getFullYear() === 2018);
                if (point2018) {
                    const xPos = x(new Date(point2018[xColumn]));
                    const yPos = y(point2018[yColumn]);
            
                    // Define arrow marker
                    svg.append("defs").append("marker")
                        .attr("id", "arrow")
                        .attr("viewBox", "0 0 10 10")
                        .attr("refX", 8)
                        .attr("refY", 5)
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", "M 0 0 L 10 5 L 0 10 z")
                        .attr("fill", "black");
            
                    // Add arrow
                    svg.append("line")
                        .attr("x1", xPos)
                        .attr("y1", yPos - 30) // Arrow above the line
                        .attr("x2", xPos)
                        .attr("y2", yPos)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)");
            
                    const textX = xPos - 50;
                    const textY = yPos - 140;
                    const annotationText = "Here we see an increase in employeers campaigning about mental health. This might indicate that tech companies are taking mental health into account more now than in the past.";
            
                    // Add a foreignObject for text wrapping
                    svg.append("foreignObject")
                        .attr("x", textX)
                        .attr("y", textY)
                        .attr("width", 250)     // Adjust the width as needed
                        .attr("height", 130) // Adjust height as needed
                        .append("xhtml:div")
                        .style("font-size", "12px")
                        .style("background", "rgba(255, 255, 255, 0.7)")
                        .style("padding", "5px")
                        .style("border", "1px solid transparent") // Invisible box
                        .style("width", "150px") // Same as width of foreignObject
                        .html(annotationText);
                }
            }

        // Define arrow marker
        svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 8)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z"); // Arrowhead path

        // Add arrow and annotation for "Don't Know" line at x value 2017
        if (key === "Don't Know" && yColumn === 'employeerResources') {
        const point2017 = values.find(d => new Date(d[xColumn]).getFullYear() === 2017);
        if (point2017) {
            const xPos = x(new Date(point2017[xColumn]));
            const yPos = y(point2017[yColumn]);

            // Add arrow pointing to the line
            svg.append("line")
                .attr("x1", xPos)
                .attr("y1", yPos + 20) // Starting point below the line
                .attr("x2", xPos)
                .attr("y2", yPos) // Ending point at the line
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)");

            // Annotation text for the arrow
            const annotationText = "Over time, the don't know line steadily decreases. This suggest that that these educational resources being offered might be effective informing people to at least know whether their employer offers these resources.  This idea is supported with the yes line is steadily increasing and the no line is steadily decreasing over time.";
            const textX = xPos - 50; // Adjust position
            const textY = yPos + 20; // Adjust position

            // Add a foreignObject for text wrapping
            svg.append("foreignObject")
                .attr("x", textX)
                .attr("y", textY)
                .attr("width", 200) // Adjust width
                .attr("height", 160) // Adjust height
                .append("xhtml:div")
                .style("font-size", "12px")
                .style("background", "rgba(255, 255, 255, 0.7)")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .html(annotationText);
        }
    }


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
            .text("Proportion of Responses");
    
        d3.select('body').on('click', function () {
            tooltip.style('visibility', 'hidden');
        });
    }
    
    
    function drawBarChart(data, yColumn, chartTitle) {
        console.log('Drawing bar chart with Y:', yColumn);
        d3.select('#bar-chart').selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased left margin to provide more space
        const width = 600 - margin.left - margin.right;
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
            .attr('dy', '.8em')
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
            .text('Proportion of Yes Responses') // Set y-axis label
            .attr('font-family', 'Playfair Display'); // Set font-family

        // Centered y-axis title and adjusted to avoid overlap with y-axis labels
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left + 10) // Adjusted to push further left
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-family', 'Playfair Display') // Set font-family
            .text('Proportion of Yes Responses');

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
            .style('font-size', '14px')
            .style('font-family', 'Playfair Display') // Set font-family
            .text(chartTitle);
    }

    function drawPieChart(data, yColumn, title) {
        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;
        const margin = { top: 110, right: 50, bottom: 30, left: 50 }; // Increased top margin
    
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.istechcomp))
            .range(['#DDA0DD', '#87CEEB']);
    
        // Clear previous chart if exists
        d3.select('#pie-chart').selectAll('*').remove();
    
        // Create SVG element
        const svg = d3.select('#pie-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${(width + margin.left + margin.right) / 2},${(height + margin.top + margin.bottom) / 2})`);
    
        // Split title into four lines
        const splitTitle = (title) => {
            const words = title.split(' ');
            const partLength = Math.ceil(words.length / 4);
    
            let line1 = words.slice(0, partLength).join(' ');
            let line2 = words.slice(partLength, partLength * 2).join(' ');
            let line3 = words.slice(partLength * 2, partLength * 3).join(' ');
            let line4 = words.slice(partLength * 3).join(' ');
    
            return [line1, line2, line3, line4];
        };
    
        const [line1, line2, line3, line4] = splitTitle(title);
    
        // Append title to the SVG
        svg.append('text')
            .attr('x', 0)
            .attr('y', - height / 2 - margin.top / 2) // Position for the first line
            .attr('text-anchor', 'middle')
            .text(line1)
            .style('font-size', '13px')
            .style('font-weight', 'bold');
    
        svg.append('text')
            .attr('x', 0)
            .attr('y', - height / 2 - margin.top / 2 + 15) // Position for the second line
            .attr('text-anchor', 'middle')
            .text(line2)
            .style('font-size', '13px')
            .style('font-weight', 'bold');
    
        svg.append('text')
            .attr('x', 0)
            .attr('y', - height / 2 - margin.top / 2 + 30) // Position for the third line
            .attr('text-anchor', 'middle')
            .text(line3)
            .style('font-size', '13px')
            .style('font-weight', 'bold');
    
        svg.append('text')
            .attr('x', 0)
            .attr('y', - height / 2 - margin.top / 2 + 45) // Position for the fourth line
            .attr('text-anchor', 'middle')
            .text(line4)
            .style('font-size', '13px')
            .style('font-weight', 'bold');
    
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
        const pie = d3.pie()
            .value(d => d[yColumn]);
    
        const g = svg.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');
    
        g.append('path')
            .attr('d', arc)
            .style('fill', d => colorScale(d.data.istechcomp))
            .append('title')
            .text(d => d.data.istechcomp);
    
        g.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1]})`)
            .attr('dy', '.35em')
            .text(d => d.data.istechcomp)
            .style('text-anchor', 'middle')
            .style('fill', 'white') // Ensure the text is visible by setting the fill color to white
            .style('font-size', '10px'); // Adjust font size as needed
            }
    
    });
    
    