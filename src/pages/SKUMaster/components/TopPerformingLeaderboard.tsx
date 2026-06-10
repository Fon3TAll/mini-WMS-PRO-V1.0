import React, { useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import * as d3 from "d3";

export function TopPerformingLeaderboard() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const data = [
      {
        id: "SKU-8801",
        name: "Nescafe Red Cup 380g",
        score: 95,
        color: "#3f809e",
      },
      {
        id: "SKU-2094",
        name: "Singha Soda Water",
        score: 88,
        color: "#b7a159",
      },
      { id: "SKU-0012", name: "Lays Classic 50g", score: 82, color: "#657f4d" },
      {
        id: "SKU-1002",
        name: "M-150 Energy Drink",
        score: 76,
        color: "#a94228",
      },
      {
        id: "SKU-3050",
        name: "Mama Shrimp Tom Yum",
        score: 65,
        color: "#b58c4f",
      },
    ];

    const width = chartRef.current.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 160 };

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block");

    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.name)!)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("width", (d) => x(d.score) - x(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(0))
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .style(
        "font-family",
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
      )
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "#414757");

    svg
      .selectAll(".value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", (d) => x(d.score) + 5)
      .attr("y", (d) => y(d.name)! + y.bandwidth() / 2 + 4)
      .text((d) => d.score + " pts")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "#7a8b95")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#eaeaec] shadow-sm animate-fadeIn text-left mt-4 mb-4">
      <h4 className="text-[14px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 mb-4 flex items-center gap-2">
        <Icons.Trophy size={16} className="text-[#b7a159]" />
        Top Performing Items Pipeline
      </h4>
      <div ref={chartRef} className="w-full h-[200px]" />
    </div>
  );
}
