import React, { useState, useEffect, useRef } from "react";
import geoJson from '../../data/geoJsonData.json';
import * as d3 from "d3";
import { legendColor } from 'd3-svg-legend'


const Map = ({ transit }) => {
    const [data, setData] = useState(geoJson);
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

    // calculate dimensions without margins
    const innerHeight = height - margins.top - margins.bottom;
    const innerWidth = width - margins.left - margins.right;

    useEffect(() => {
        // console.log(svgRef.current, d3.select(svgRef.current))
        const svg = d3.select(svgRef.current);
        const legendSvg = d3.select('#svg-color-quant');
        legendSvg.append("g")
            .attr("class", "legendSequential")
            .attr("transform", "translate(20,20)");

        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('class', 'svg-group')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        // load and parse data
        const projection = d3.geoAlbersUsa();
        const geoGen = d3.geoPath().projection(projection);

        const minUnemployment = d3.min(data.features, d => parseFloat(d.properties.unemployed));
        const maxUnemployment = d3.max(data.features, d => parseFloat(d.properties.unemployed));
        const minTransit = d3.min(data.features, d => parseFloat(d.properties.transit));
        const maxTransit = d3.max(data.features, d => parseFloat(d.properties.transit));
        const domain = transit ? [minTransit, maxTransit] : [minUnemployment, maxUnemployment]


        const colors = d3.scaleSequentialSqrt()
            .domain(domain)
            .interpolator(d3.interpolateGnBu)
        // .range(d3.schemeBlues[9])
        const unemployedColors = d3.scaleSequential()
            .domain(domain)
            .interpolator(d3.interpolateGnBu);
        const legendSequential = legendColor()
            .shapeWidth(30)
            .cells(5)
            .orient('vertical')
            .scale(colors)

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
            const text = transit ? `${evt.srcElement.__data__.properties.name}: ${evt.srcElement.__data__.properties.transit}`
                : `${evt.srcElement.__data__.properties.name}: ${evt.srcElement.__data__.properties.unemployed}`
            tooltip
                .html(text)
                .style("left", evt.pageX + 'px')
                .style("top", evt.pageY + 'px')
        };

        const mouseleave = function (d) {
            tooltip
                .style("display", "none")
            d3.select(this)
                .style("stroke-width", "1px")
                .style("opacity", 1)
        }
        g.selectAll('path')
            .data(data.features)
            .join('path')
            .attr('d', geoGen)
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')
            .attr('fill', d => transit ? colors(d.properties.transit) : unemployedColors(d.properties.unemployed))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        legendSvg.select('.legendSequential')
            .call(legendSequential)
    }, [transit]);
    return (
        <>
            <div>
                <div className="tooltip" ref={tooltipRef} />
                <svg className="map" ref={svgRef} width={width} height={height}></svg>
                <svg id="svg-color-quant"></svg>
            </div>

        </>)
}

export default Map;