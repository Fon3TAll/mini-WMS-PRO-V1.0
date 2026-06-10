import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as Icons from 'lucide-react';

interface ExecutiveSummaryDashboardProps {
  onRefresh?: () => void;
}

export default function ExecutiveSummaryDashboard({ onRefresh }: ExecutiveSummaryDashboardProps) {
  const [accuracyVal, setAccuracyVal] = useState<number>(99.4);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const accuracyRef = useRef<SVGSVGElement | null>(null);
  const pickingRef = useRef<SVGSVGElement | null>(null);
  const inflowRef = useRef<SVGSVGElement | null>(null);

  // Mock data for charts
  const pickingTasks = [
    { priority: 'Express', count: 12, color: '#922724' },
    { priority: 'High', count: 22, color: '#ad2b10' },
    { priority: 'Medium', count: 34, color: '#ce8a39' },
    { priority: 'Low', count: 15, color: '#788990' },
  ];

  const inflowTimeline = [
    { date: '06/04', volume: 1200 },
    { date: '06/05', volume: 1800 },
    { date: '06/06', volume: 1400 },
    { date: '06/07', volume: 2200 },
    { date: '06/08', volume: 2800 },
    { date: '06/09', volume: 2100 },
    { date: '06/10', volume: 3200 },
  ];

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString('th-TH'));
  }, []);

  // 1. Stock Accuracy Arc / Gauge Chart
  useEffect(() => {
    if (!accuracyRef.current) return;
    const svgEl = d3.select(accuracyRef.current);
    svgEl.selectAll('*').remove();

    const width = 240;
    const height = 150;
    const radius = Math.min(width, height) / 1.25;

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height - 20})`);

    // Arc generator
    const arcGenerator = d3.arc<any>()
      .innerRadius(radius - 28)
      .outerRadius(radius)
      .cornerRadius(10)
      .startAngle(-Math.PI / 2);

    // Background Arc
    svg.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#eaeaec')
      .attr('d', arcGenerator as any);

    // Foreground Percentage Arc
    const scoreRad = -Math.PI / 2 + (Math.PI * (accuracyVal / 100));
    svg.append('path')
      .datum({ endAngle: scoreRad })
      .style('fill', 'url(#accuracy-gradient)')
      .attr('d', arcGenerator as any);

    // Glow filter or gradients
    const defs = svgEl.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'accuracy-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ce8a39');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#a8c0bb');

    // Add Value Text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-15px')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '28px')
      .style('font-weight', '900')
      .style('fill', '#1a253d')
      .text(`${accuracyVal}%`);

    // Label Text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '10px')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '800')
      .style('fill', '#788990')
      .style('letter-spacing', '0.15em')
      .text('WMS STOCK ACCURACY');

  }, [accuracyVal]);

  // 2. Pending Picking Tasks Bar Chart
  useEffect(() => {
    if (!pickingRef.current) return;
    const svgEl = d3.select(pickingRef.current);
    svgEl.selectAll('*').remove();

    const margin = { top: 15, right: 15, bottom: 25, left: 35 };
    const width = 280;
    const height = 140;

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width - margin.left - margin.right])
      .domain(pickingTasks.map(d => d.priority))
      .padding(0.35);

    const y = d3.scaleLinear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([0, d3.max(pickingTasks, d => d.count) || 40]);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('fill', '#788990');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('fill', '#788990');

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .style('stroke', '#eaeaec')
      .style('stroke-opacity', 0.6)
      .call(d3.axisLeft(y).ticks(4).tickSize(-width + margin.left + margin.right).tickFormat(() => ''))
      .call(g => g.select('.domain').remove());

    // Bars
    svg.selectAll('.bar')
      .data(pickingTasks)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.priority) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height - margin.top - margin.bottom)
      .attr('height', 0)
      .attr('rx', 4)
      .style('fill', d => d.color)
      .transition()
      .duration(800)
      .attr('y', d => y(d.count))
      .attr('height', d => height - margin.top - margin.bottom - y(d.count));

    // Value Labels on top of bars
    svg.selectAll('.bar-label')
      .data(pickingTasks)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (x(d.priority) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 4)
      .attr('text-anchor', 'middle')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '800')
      .style('fill', '#1a253d')
      .text(d => d.count);

  }, []);

  // 3. Inflow Area Chart
  useEffect(() => {
    if (!inflowRef.current) return;
    const svgEl = d3.select(inflowRef.current);
    svgEl.selectAll('*').remove();

    const margin = { top: 15, right: 15, bottom: 25, left: 40 };
    const width = 280;
    const height = 140;

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scalePoint()
      .range([0, width - margin.left - margin.right])
      .domain(inflowTimeline.map(d => d.date));

    const y = d3.scaleLinear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([0, d3.max(inflowTimeline, d => d.volume) || 4000]);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('fill', '#788990');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('~s')).tickSizeOuter(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('font-family', 'ui-sans-serif, system-ui')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('fill', '#788990');

    // Horizontal grid lines
    svg.append('g')
      .attr('class', 'grid')
      .style('stroke', '#eaeaec')
      .style('stroke-opacity', 0.6)
      .call(d3.axisLeft(y).ticks(4).tickSize(-width + margin.left + margin.right).tickFormat(() => ''))
      .call(g => g.select('.domain').remove());

    // Gradient definitions
    const defs = svgEl.append('defs');
    const areaGlow = defs.append('linearGradient')
      .attr('id', 'inflow-area-glow')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGlow.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#133951')
      .attr('stop-opacity', 0.25);

    areaGlow.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#133951')
      .attr('stop-opacity', 0.0);

    // Area Generator
    const area = d3.area<any>()
      .x(d => x(d.date) || 0)
      .y0(height - margin.top - margin.bottom)
      .y1(d => y(d.volume))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const line = d3.line<any>()
      .x(d => x(d.date) || 0)
      .y(d => y(d.volume))
      .curve(d3.curveMonotoneX);

    // Render Area
    svg.append('path')
      .datum(inflowTimeline)
      .attr('class', 'area')
      .attr('fill', 'url(#inflow-area-glow)')
      .attr('d', area);

    // Render Line
    svg.append('path')
      .datum(inflowTimeline)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#133951')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Points on connection
    svg.selectAll('.dot')
      .data(inflowTimeline)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date) || 0)
      .attr('cy', d => y(d.volume))
      .attr('r', 4)
      .style('fill', '#ffffff')
      .style('stroke', '#133951')
      .style('stroke-width', 2);

  }, []);

  const handleSimulateShift = () => {
    // Generate slight drift in accuracy value for demo
    const delta = (Math.random() * 0.4 - 0.2);
    const newVal = Math.min(100, Math.max(90, accuracyVal + delta));
    setAccuracyVal(parseFloat(newVal.toFixed(1)));
    setLastUpdated(new Date().toLocaleTimeString('th-TH'));
    if (onRefresh) onRefresh();
  };

  return (
    <div className="bg-white border border-[#eaeaec] rounded-2xl relative w-full overflow-hidden p-6 sm:p-8 shadow-sm text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Icons.LayoutDashboard size={20} className="text-[#ce8a39]" />
            <h2 className="text-sm sm:text-base font-black text-[#1a253d] uppercase tracking-widest leading-tight">
              EXECUTIVE EXECUTIVE SUMMARY <span className="text-[#a8c0bb]">DASHBOARD</span>
            </h2>
          </div>
          <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none mb-1">
            Real-time D3 Visualizations comparing warehouse KPIs & Picking operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] font-black tracking-widest text-[#788990] block">LAST INTEGRITY SCAN</span>
            <span className="text-[11px] font-bold font-mono text-[#1a253d]">{lastUpdated || '-'}</span>
          </div>
          <button
            onClick={handleSimulateShift}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f3f3f1] hover:bg-[#ce8a39] hover:text-white border border-[#eaeaec] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-[#1a253d]"
          >
            <Icons.RefreshCw size={12} className="animate-spin-slow" /> Scan Systems
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* KPI 1: Accuracy Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl h-[190px] text-center">
          <svg ref={accuracyRef}></svg>
        </div>

        {/* KPI 2: Pending Tasks Bars */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl h-[190px] text-center">
          <h4 className="text-[10px] font-black text-[#1a253d] uppercase tracking-widest mb-1.5">Pending Picking Tasks (D3.js)</h4>
          <svg ref={pickingRef}></svg>
        </div>

        {/* KPI 3: Inflow Timeline Area */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl h-[190px] text-center">
          <h4 className="text-[10px] font-black text-[#1a253d] uppercase tracking-widest mb-1.5">Inflow Volume Trend (PCS)</h4>
          <svg ref={inflowRef}></svg>
        </div>
      </div>
    </div>
  );
}
