(() => {
    let silent = false;
    const hash = window.location.hash.substr(1).split('&').reduce((r, i) =>
        i.split('=')[0].length && Object.assign(JSON.parse(`{"${i.split('=')[0]}":"${i.split('=')[1]}"}`), r), {});
    if (Object.keys(hash).length) {
        for (let prop in hash) {
            if (hash.hasOwnProperty(prop)) {
                const input = document.getElementById(prop);
                switch (input.type) {
                    case "checkbox":
                        input.checked = hash[prop] === "true";
                        break;
                    case "number":
                        input.value = hash[prop];
                        break;
                    case "select-one":
                        input.value = hash[prop];
                        break;
                    case "textarea":
                        input.value = atob(hash[prop]);
                }
            }
        }
    }
    const graphWidth = 700;
    const graphHeight = 400;
    const en_GB = {
        "decimal": ".",
        "thousands": ",",
        "grouping": [3],
        "currency": ["£", ""]
    };
    const GB = d3.formatLocale(en_GB);
    // set the dimensions and margins of the graph
    const margin = {
            "top": 20,
            "right": 20,
            "bottom": 40,
            "left": 70
        },
        width = graphWidth - margin.left - margin.right,
        height = graphHeight - margin.top - margin.bottom;
    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let raw = new Raw();
    // define the line
    const valueline = d3.line().x(d => x(d.date)).y(d => y(d.close));
    // Scale the range of the data
    x.domain(d3.extent(raw.data, d => d.date));
    y.domain([0, d3.max(raw.data, d => d.close)]);
    // Add the valueline path.
    svg.append("path")
        .data([raw.data])
        .attr("class", "line")
        .attr("d", valueline);
    let xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%b"));
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    let yAxis = d3.axisLeft(y)
        .tickFormat(GB.format("($.2f"));
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    const inputs = document.querySelectorAll(".updateData");
    Array.from(inputs).forEach(input => {
        input.addEventListener("change", () => {
            if(!silent){
                raw = new Raw();
                location.hash = raw.toString();
                const vis = d3.select("body").transition();
                x.domain(d3.extent(raw.data, d => d.date));
                y.domain([0, d3.max(raw.data, d => d.close)]);
                xAxis = d3.axisBottom(x)
                    .tickFormat(d3.timeFormat("%b"));
                yAxis = d3.axisLeft(y)
                    .tickFormat(GB.format("($.2f"));
                // Make the changes
                vis.select(".x.axis") // change the x axis
                    .duration(750)
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
                vis.select(".y.axis") // change the y axis
                    .duration(750)
                    .call(yAxis);
                vis.select(".line")   // change the line
                    .duration(750)
                    .attr("d", valueline(raw.data));
            }
        }, false);
    });
    window.onhashchange = () => {
        setTimeout(() => {
            const hash = window.location.hash.substr(1).split('&').reduce((r, i) =>
                i.split('=')[0].length && Object.assign(JSON.parse(`{"${i.split('=')[0]}":"${i.split('=')[1]}"}`), r), {});
            if (Object.keys(hash).length) {
                silent = true;
                for (let prop in hash) {
                    if (hash.hasOwnProperty(prop)) {
                        const input = document.getElementById(prop);
                        switch (input.type) {
                            case "checkbox":
                                input.checked = hash[prop] === "true";
                                break;
                            case "number":
                                input.value = hash[prop];
                                break;
                            case "select-one":
                                input.value = hash[prop];
                                break;
                            case "textarea":
                                input.value = atob(hash[prop]);
                        }
                    }
                }
                silent = false;
                raw = new Raw(hash);
            }else{
                raw = new Raw();
            }
            const vis = d3.select("body").transition();
            x.domain(d3.extent(raw.data, d => d.date));
            y.domain([0, d3.max(raw.data, d => d.close)]);
            xAxis = d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b"));
            yAxis = d3.axisLeft(y)
                .tickFormat(GB.format("($.2f"));
            // Make the changes
            vis.select(".x.axis") // change the x axis
                .duration(750)
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            vis.select(".y.axis") // change the y axis
                .duration(750)
                .call(yAxis);
            vis.select(".line")   // change the line
                .duration(750)
                .attr("d", valueline(raw.data));
        }, 500);
    };
})();