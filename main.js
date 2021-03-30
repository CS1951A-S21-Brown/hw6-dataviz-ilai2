// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// CSV filenames for artist and song data
let filename = "data/num_games_per_year.csv";

// TODO: Set up SVG object with width, height and margin
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (years)
let x = d3.scaleBand()
    .range([0, graph_1_width - margin.left - margin.right])
    .padding(0.1);

// TODO: Create a scale band for the y axis (number of games)
let y = d3.scaleLinear()
    .range([graph_1_height - margin.top - margin.bottom, 0]);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */
// Define color scale
let color = d3.scaleOrdinal()
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

// Set up reference to count SVG group
let countRef = svg.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");
let x_axis_label = svg.append("g");
// TODO: Add x-axis label
svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
    ${ - 25})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Year");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate(-50, ${(graph_1_height - margin.top - margin.bottom) / 2}) rotate(270)`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${graph_1_height - margin.top})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */

/**
 * Checks if a date falls within a provided year range
 */
 function validYear(start, end, cur) {
    return (Date.parse(start) < Date.parse(cur)) &&
        (Date.parse(cur) < Date.parse(end));
}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
 function cleanData(data, comparator, numExamples) {
    return data.sort(comparator).slice(0, numExamples);
}

/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setDataGraph1(startYear, endYear, attr) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filename).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        data = data.filter(function(a) {
            return validYear(startYear, endYear, a.date);
        });

        // let hash = {};
        // data.forEach(function(a) {
        //     hash[a["date"]] =  parseInt(a[attr])
        // });

        cleanedData = cleanData(data, function(a, b) { return parseInt(a["date"]) - parseInt(b["date"]); }, NUM_EXAMPLES)
        console.log(cleanedData)
        // TODO: Update the x axis domain with the max count of the provided data
        // y.domain([d3.min(cleanedData, function(d) { return parseInt(d["date"]); }), d3.max(cleanedData, function(d) { return parseInt(d["date"]); })]);
        x.domain(cleanedData.map(function(d) { return parseInt(d["date"]); }))
        // TODO: Update the y axis domains with the desired attribute
        // y.domain([0, d3.max(cleanedData, function(d) { return parseInt(d[attr]); })])
        y.domain([d3.max(cleanedData, function(d) { return parseInt(d[attr]); }), 0])
        // y.domain(cleanedData.map(function(d) { return parseInt(d[attr]); }));
        color.domain(cleanedData.map(function(d) { return parseInt(d[attr]); }));
        // HINT: Use the attr parameter to get the desired attribute for each data point
        // TODO: Render y-axis label


        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars = svg.selectAll("rect").data(cleanedData);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("transform", `translate(0, 0) scale(1,1)` )
            .attr("fill", function(d) { return color(parseInt(d[attr])) })
            // .attr("x", function(d) { return x(parseInt(d["date"]))})
            .attr("y", 0)
            .attr("x", function(d) { return x(parseInt(d["date"]))})  
            // .attr("height", function(d) { return y(parseInt(d[attr]))})
            // .attr("width", x.bandwidth())             // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("height", function(d) { return y(parseInt(d[attr]))})
            .attr("width",  x.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        // let counts = countRef.selectAll("text").data(data);

        // // TODO: Render the text elements on the DOM
        // counts.enter()
        //     .append("text")
        //     .merge(counts)
        //     .transition()
        //     .duration(1000)
        //     .attr("x", ?)       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        //     .attr("y", ?)       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        //     .style("text-anchor", "start")
        //     .text(?);           // HINT: Get the count of the artist
        y_axis_label.call(d3.axisLeft(y).tickSize(10).tickPadding(10));
        x_axis_label.call(d3.axisTop(x).tickSize(1).tickPadding(10));
        y_axis_text.text("Number of Games");
        title.text("Number of Games per Year");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        // counts.exit().remove();
    });
}


// On page load, render the barplot with the artist data
setDataGraph1(2009, 2020, "num_games");
let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  


// TODO: Create a linear scale for the x2 axis (years)
let x2 = d3.scaleBand()
.range([0, graph_2_width - margin.left - margin.right])
.padding(0.1);

// TODO: Create a scale band for the y2 axis (number of games)
let y2 = d3.scaleLinear()
.range([graph_2_height - margin.top - margin.bottom, 0]);  // Improves readability
/*
Here we will create global references to the x2 and y2 axis with a fixed range.
We will update the domain of the axis in the setData function based on which data source
is requested.
*/
// Define color scale
let color2 = d3.scaleOrdinal()
.range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

// Set up reference to y2 axis label to update text in setData
let y_axis_label2 = svg2.append("g");
let x_axis_label2 = svg2.append("g");
// TODO: Add x-axis label
// svg2.append("text")
// .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
// ${ - 25})`)       // HINT: Place this at the bottom middle edge of the graph
// .style("text-anchor", "middle")
// .text("Year");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
let y_axis_text2 = svg2.append("text")
.attr("transform", `translate(-50, ${(graph_2_height - margin.top - margin.bottom) / 2}) rotate(270)`)       // HINT: Place this at the center left edge of the graph
.style("text-anchor", "middle");

// TODO: Add chart title
let title2 = svg2.append("text")
.attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${graph_2_height - margin.top - margin.bottom / 2})`)       // HINT: Place this at the top middle edge of the graph
.style("text-anchor", "middle")
.style("font-size", 15);
function setDataGraph2() {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv("data/world_cup.csv").then(function(data) {

        cleanedData = cleanData(data, function(a, b) { return parseInt(b["num_games"]) - parseInt(a["num_games"]); }, NUM_EXAMPLES)
        console.log(cleanedData)
        // TODO: Update the x axis domain with the max count of the provided data
        // y.domain([d3.min(cleanedData, function(d) { return parseInt(d["date"]); }), d3.max(cleanedData, function(d) { return parseInt(d["date"]); })]);
        x2.domain(cleanedData.map(function(d) { return (d["winner"]); }))
        // TODO: Update the y axis domains with the desired attribute
        // y.domain([0, d3.max(cleanedData, function(d) { return parseInt(d[attr]); })])
        y2.domain([d3.max(cleanedData, function(d) { return parseInt(d["num_games"]); }), 0])
        // y.domain(cleanedData.map(function(d) { return parseInt(d[attr]); }));
        color2.domain(cleanedData.map(function(d) { return parseInt(d["num_games"]); }));
        // HINT: Use the attr parameter to get the desired attribute for each data point
        // TODO: Render y-axis label


        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars = svg2.selectAll("rect").data(cleanedData);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("transform", `translate(0, 0) scale(1,1)` )
            .attr("fill", function(d) { return color2(parseInt(d["num_games"])) })
            // .attr("x", function(d) { return x(parseInt(d["date"]))})
            .attr("y", 0)
            .attr("x", function(d) { return x2(d["winner"])})  
            // .attr("height", function(d) { return y(parseInt(d[attr]))})
            // .attr("width", x.bandwidth())             // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("height", function(d) { return y2(parseInt(d["num_games"]))})
            .attr("width",  x2.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        y_axis_label2.call(d3.axisLeft(y2).tickSize(10).tickPadding(10));
        x_axis_label2.call(d3.axisTop(x2).tickSize(1).tickPadding(10)).selectAll("text").attr("transform", "translate(-20, -10)rotate(45)");
        y_axis_text2.text("FIFA World Cup Game Wins");
        title2.text("Top 10 Winning Countries at the 2014/18 World Cup");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        // counts.exit().remove();
    });
}

setDataGraph2();
//////////////////////////////////////////////////////////////////////////
// let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;

// // Set up SVG object with width, height and margin
// let svg_barplot = d3.select("#barplot")
//     .append("svg")
//     .attr("width", graph_1_width)
//     .attr("height", graph_1_height)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Create a linear scale for the x axis (number of occurrences)
// let x_bar = d3.scaleLinear()
//     .range([0, graph_1_width - margin.left - margin.right]);

// // Create a scale band for the y axis (artist / song)
// let y_bar = d3.scaleBand()
//     .range([0, graph_1_height - margin.top - margin.bottom])
//     .padding(0.1);  // Improves readability

// // Set up reference to count SVG group
// let countRef = svg_barplot.append("g");
// // Set up reference to y axis label to update text in setData
// let y_axis_label = svg_barplot.append("g").attr("id", "y_bar_label");

// // Add x-axis label
// svg_barplot.append("text")
//     .attr("transform",
//         `translate(${(graph_1_width - margin.left - margin.right) / 2},
//         ${(graph_1_height - margin.top - margin.bottom) + 15})`)
//     .style("text-anchor", "middle")
//     .text("Count");

// // Add y-axis label
// let y_axis_text = svg_barplot.append("text")
//     .attr("transform", `translate(-120, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
//     .style("text-anchor", "middle");

// // Add chart title
// let title = svg_barplot.append("text")
//     .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
//     .style("text-anchor", "middle")
//     .style("font-size", 15);

// // Define color scale
// let color = d3.scaleOrdinal()
//     .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

// /**
//  * Sets the data on the barplot using the provided index of valid data sources and an attribute
//  * to use for comparison
//  */
// function updateData(startYear, endYear, attr) {
//     // Filter data by year
//     let filteredData = data.filter(function(a) {
//         return validYear(startYear, endYear, a.date);
//     });
//     // Store counts for each attr in hash
//     let hash = {};
//     filteredData.forEach(function(a) {
//         let cleaned = trimText(a[attr]);
//         if (hash[cleaned]) {
//             hash[cleaned] += 1;
//         }  else {
//             hash[cleaned] = 1;
//         }
//     });

//     // Post-process data before sorting and splicing
//     let attr_data = [];
//     for (let i=0; i < Object.keys(hash).length; i++) {
//         let k = Object.keys(hash)[i];
//         // Store each entry as hash of attr, count, and id
//         attr_data.push({attr: k, count: hash[k], id: i});
//     }
//     attr_data = cleanData(attr_data, function(a, b) {
//         return parseInt(b.count) - parseInt(a.count)
//     }, NUM_EXAMPLES);

//     // Update the x axis domain with the max count of the provided data
//     x_bar.domain([0, d3.max(attr_data, function(d) { return parseInt(d.count); })]);
//     // Update the y axis domains with the desired attribute
//     y_bar.domain(attr_data.map(function(d) { return d.attr }));
//     color.domain(attr_data.map(function(d) { return d.attr }));

//     // Render y-axis label
//     y_axis_label.call(d3.axisLeft(y_bar).tickSize(0).tickPadding(10));
//     let bars = svg_barplot.selectAll("rect").data(attr_data);

//     // Render the bar elements on the DOM
//     bars.enter()
//         .append("rect")
//         // Set up mouse interactivity functions
//         .on("mouseover", mouseover_barplot)
//         .on("mouseout", mouseout_barplot)
//         .on("click", click_barplot)
//         .merge(bars)
//         .transition()
//         .duration(1000)
//         .attr("fill", function(d) { return color(d.attr) })
//         .attr("x", x_bar(0))
//         .attr("y", function(d) { return y_bar(d.attr); })
//         .attr("width", function(d) { return x_bar(parseInt(d.count)); })
//         .attr("height",  y_bar.bandwidth())
//         .attr("id", function(d) { return `rect-${d.id}` });
//     /*
//         In lieu of x-axis labels, display the count of the artist next to its bar on the
//         bar plot.
//      */
//     let counts = countRef.selectAll("text").data(attr_data);
//     // Render the text elements on the DOM
//     counts.enter()
//         .append("text")
//         .merge(counts)
//         .transition()
//         .duration(1000)
//         .attr("x", function(d) { return x_bar(parseInt(d.count)) + 10; })
//         .attr("y", function(d) { return y_bar(d.attr) + 10; })
//         .style("text-anchor", "start")
//         .text(function(d) {return parseInt(d.count);});
//     // Add y-axis text and chart title
//     y_axis_text.text(sentenceCase(attr));
//     title.text(`Top ${sentenceCase(attr)}s in Billboard 100 Charts (${startYear} - ${endYear})`);
//     // Remove elements not in use if fewer groups in new dataset
//     bars.exit().remove();
//     counts.exit().remove();
// }

// /**
//  * Cleans the provided data using the given comparator then strips to first numExamples
//  * instances
//  */
// function cleanData(data, comparator, numExamples) {
//     return data.sort(comparator).slice(0, numExamples);
// }

// // Darken bar fill in barplot on mouseover
// let mouseover_barplot = function(d) {
//     svg_barplot.select(`#rect-${d.id}`).attr("fill", function(d) {
//         return darkenColor(color(d.attr), 0.5);
//     });
// };

// // Set scatterplot to song or artist based on cur_attr
// let click_barplot = function(d) {
//     if (cur_attr === 'artist') {
//         cur_artist = d.attr;
//         setScatter(cur_start_year, cur_end_year, cur_artist);
//     } else {
//         cur_song = d.attr;
//         setScatterSong(cur_start_year, cur_end_year, cur_song);
//     }
// };

// // Restore bar fill to original color on mouseout
// let mouseout_barplot = function(d) {
//     svg_barplot.select(`#rect-${d.id}`).attr("fill", function(d) {
//         return color(d.attr)
//     });
// };

// let data;

// let slider = new Slider('#year', {});
// let attr_input = document.getElementById("attrInput");

// const graph_1_csv = "../data/num_games_per_year.csv"
// // Load data from billboard.csv file
// d3.csv("./data/billboard.csv").then(function(d) {
//     data = d;
//     updateDashboard();
//     createGraph(2019);
// });

// // Update cur_start_year and cur_end_year on slideStop of range slider
// slider.on("slideStop", function(range) {
//     cur_start_year = range[0];
//     cur_end_year = range[1];
//     updateDashboard();
// });

// /**
//  * Set the data source for bar and scatter plots between artist and song
//  */
// function setData(attr) {
//     cur_attr = attr;
//     attr_input.placeholder = sentenceCase(attr);
//     updateDashboard();
// }

// /**
//  * Updates cur attribute with new artist or song from user input
//  */
// function setAttr() {
//     if (cur_attr === "artist") {
//         cur_artist = attr_input.value;
//     } else {
//         cur_song = attr_input.value;
//     }
//     updateDashboard();
// }

// /**
//  * Updates dashboard scatterplot and barplot after change in date or cur_attr
//  */
// function updateDashboard() {
//     updateData(cur_start_year, cur_end_year, cur_attr);
//     if (cur_attr === "artist") {
//         setScatter(cur_start_year, cur_end_year, cur_artist);
//     } else {
//         setScatterSong(cur_start_year, cur_end_year, cur_song);
//     }
// }

// /**
//  * Checks if a date falls within a provided year range
//  */
// function validYear(start, end, cur) {
//     return (Date.parse(start) < Date.parse(cur)) &&
//         (Date.parse(cur) < Date.parse(end));
// }

// /**
//  * Converts a text to sentence case
//  */
// function sentenceCase(word) {
//     return `${word[0].toUpperCase()}${word.substring(1)}`;
// }

// /**
//  * Abbreviates and shortens a given label by adding ellipses
//  */
// function trimText(label) {
//     if (label.length > 20) {
//         return label.substring(0, 20) + "..."
//     }
//     return label;
// }

// /**
//  * Finds all artists collaborating on a song by splitting on predefined text
//  * and returns a list of all artists
//  */
// function splitArtist(artist) {
//     let song_artists = artist.split(/(?:Featuring|&|,)/);
//     return song_artists.map(s => trimText(s.trim()));
// }

// /**
//  * Returns a darker shade of a given color
//  */
// function darkenColor(color, percentage) {
//     return d3.hsl(color).darker(percentage);
// }
// // let svg = d3.select("#graph1")
// //     .append("svg")
// //     .attr("width", 20)     // HINT: width
// //     .attr("height", 20)     // HINT: height
// //     .append("g")
// //     .attr("transform", `translate(${margin.left}, ${margin.top})`);  

// // let countRef = svg.append("g");

// // d3.csv(graph_1_csv).then(function(data) {
// //     console.log(data)
// //     data = data.map(function(x) { return parseInt(x) })
// //     // svg.selectAll("rect")
// //     // .data(data)
// //     // .enter()
// //     // .append("rect")
// //     // .attr("x", 0)
// //     // .attr("y", 0)
// //     // .attr("width", 20);
// //     let x = d3.scaleLinear()
// //         .domain([1800, 2020])
// //         .range([700, 1000]);
// //     let y = d3.scaleBand()
// //         .domain([1800, 2020])
// //         .range([700, 1000]);
// //     let bars = svg.selectAll("rect").data(data);
// //         // OPTIONAL: Define color scale
// //     let color = d3.scaleOrdinal()
// //         .domain(data.map(function(d) { return d["num_games"] }))
// //         .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 5));

// //     bars.enter()
// //         .append("rect")
// //         .merge(bars)
// //         .attr("fill", function(d) { return color(d['num_games']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
// //         .attr("x", x(0))
// //         .attr("y", function(d) { return color(d["num_games"])})               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
// //         .attr("width", MAX_WIDTH)
// //         .attr("height", y.bandwidth()); 

// //     d3.select("#graph1")
// //         .data(data)
// //         .enter()
// //         .append("div")
// //         .attr("class", "bar")
// // });

// // // .name for class, #name for id
