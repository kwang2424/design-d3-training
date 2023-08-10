import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { legendColor, legendHelpers } from 'd3-svg-legend';

const BarGraph = ({ data, state }) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    
    const height = 1300;
    const width = 1400;
    const margins = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('class', 'svg-group')
            .attr('transform', 'translate(' + (margins.left * 3 - 10) + ',' + margins.top / 2+ ')');

        const colors = d3.scaleOrdinal()
            .domain(['Transit Use', 'Unemployed %'])
            .range(['red', 'blue'])

        svg
            .append('g')
            .attr('class', 'legendQuant')
            .attr('transform', 'translate(20,20)')

        const legend = legendColor()
            .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
            .shapePadding(10)
            .scale(colors)

        // want data in state, county, year, transit format
        const fips = Object.keys(data);
        const stateFips = fips.filter(f => data[f].properties.state === state);
        const relevantData = stateFips.map(f => {
            const countyData = data[f];
            
            return [countyData.properties.county, countyData.data];
        })

        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margins.left, width - margins.right * 2])

        const yDomain = relevantData.map(d => d[0])

        const yScale = d3.scalePoint()
            .domain(yDomain)
            .range([0, height - margins.bottom - margins.top])

        // console.log(relevantData)

        let tooltip = d3.select(tooltipRef.current)
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none")
            .style('position', 'absolute')
            .style("color", "black")
            .style("background-color", "white")
            .style('width', '250px')
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const mouseover = function () {
            tooltip.style("display", "block")
            d3.select(this)
                .style('border', 'solid')
                .style("border-width", "2px")
                .style("opacity", 1)
        }
        const mousemove = function (evt) {
            const text = "County: " + evt.srcElement.__data__[0] + "<br/>" + "Unemployment: " + parseFloat(evt.srcElement.__data__[1].unemployed)
             + "<br/>" + "Transit Usage: " + parseFloat(evt.srcElement.__data__[1].transit);
            tooltip
                .html(text)
                .style("top", d3.pointer(evt, this)[1] + 'px')
                .style("left", d3.pointer(evt, this)[0] + 'px')
        };

        const mouseleave = function () {
            tooltip
                .style("display", "none")
            d3.select(this)
                .style("border-width", "0px")
                .style("opacity", 1)
        };

        g.selectAll("rect")
            .data(relevantData)
            .join("rect")
            .attr("y", d => yScale(d[0])- 5 + 'px')
            .attr("width", d => xScale(parseFloat(d[1].unemployed)))
            .attr("height", '5px')
            .attr("fill", "blue")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        g.selectAll(".transit-bars")
            .data(relevantData)
            .join("rect")
            .attr("y", d => yScale(d[0]))
            .attr("width", d => xScale(parseFloat(d[1].transit)))
            .attr("height", '5px')
            .attr("fill", "red")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        
        g.append("text")
            .text("Unemployment and Transit Usage by County in " + state)
            .attr("x", (width - margins.left - margins.right) / 2)
            .attr("y", -margins.top / 4)
            .attr("text-anchor", "middle")

        g.append("g")
            .attr("transform", "translate(" + -(margins.left) + "," + (height - margins.top - margins.bottom + 5) + ")")
            .call(d3.axisBottom(xScale));
        g.append("g")
            .call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margins.bottom / 4)
            .attr("text-anchor", "middle")
            .text("Percent (x 100)")

        svg.select(".legendQuant")
            .attr("transform", "translate(" + (width - margins.right * 3) + "," + (margins.top / 2) + ")")
            .call(legend);
            
    }, [data, state])

    return (
        <div>
                <div className="tooltip" ref={tooltipRef} />
                <div className="bar-container">
                <svg ref={svgRef} width={width} height={height}></svg>
                    {/* <svg ref={legendRef} id="svg-color-quant"></svg> */}

            </div>
        </div>
    )
}

export default BarGraph;