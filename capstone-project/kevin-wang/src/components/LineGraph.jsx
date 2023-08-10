import { useEffect, useRef } from 'react';
import *  as d3 from 'd3';

const LineGraph = ({ currData, county }) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const height = 700;
    const width = 1000;
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
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        const xScale = d3.scaleLinear()
            .domain([2010, 2020])
            .range([margins.left, width - margins.right * 2])

        const minTransit = d3.min(currData, d => d.transit);
        const maxTransit = d3.max(currData, d => d.transit);

        const yScale = d3.scaleLinear()
            .domain([minTransit, maxTransit+1])
            .range([height - margins.bottom * 2, margins.top]);
        
        let tooltip = d3.select(tooltipRef.current)
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none")
            .style('position', 'absolute')
            .style("color", "black")
            .style("background-color", "white")
            .style('width', '150px')
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const mouseover = function (d) {
            tooltip.style("display", "block")
            d3.select(this)
                .style("stroke-width", "2px")
                .style("opacity", 1)
        }
        const mousemove = function (evt, d) {
            // console.log('data', evt.srcElement.__data__)
            const text = `${evt.srcElement.__data__.year}: ${evt.srcElement.__data__.transit}%`
            tooltip
                .html(text)
                .style("top", d3.pointer(evt, this)[1] + 'px')
                .style("left", d3.pointer(evt, this)[0] + 'px')
        };

        const mouseleave = function (d) {
            tooltip
                .style("display", "none")
            d3.select(this)
                .style("stroke-width", "1px")
                .style("opacity", 1)
        }

        const line = d3.line()
            .x(d => xScale(parseInt(d.year)))
            .y(d => yScale(parseFloat(d.transit)))

        g.selectAll('path')
            .data([currData])
            .join('path')
            .attr('d', d => line(d))
            .attr('fill', 'none')
            .attr('stroke', '#88d2dd')
            .attr('stroke-width', 1.5)

        g.selectAll('circle')
            .data(currData)
            .join('circle')
            // .attr('cx', d => xScale(parseInt(d.year)))
            .attr('cy', d => {
                console.log(d.transit, d.year)
                return yScale(parseFloat(d.transit))}
                )
            .attr('r', 3)
            .attr('fill', 'black')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .transition()
            .attr('cx', function(d) {
                return xScale(parseInt(d.year));
            })

        const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(x => x);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height - margins.bottom * 2})`)
            .call(xAxis)

        g.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margins.left}, 0)`)
            .call(d3.axisLeft(yScale))
            

        // svg.append('text')
        //     .attr('x', width / 2)
        //     .attr('y', margins.top)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', '20px')
        //     .text('Public Transit Use by Year in ' + county)

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', margins.left)
            .attr('text-anchor', 'middle')
            .text('Public Transit Use')

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .text('Year')
    }, [currData])
    return (
        <>
            <div className="line-header">
                <h2>Public Transit Use by Year in {county}</h2>
            </div>
                <div className="tooltip" ref={tooltipRef} />


                <svg ref={svgRef} width={width} height={height}></svg>
        </>
    )
}
export default LineGraph;