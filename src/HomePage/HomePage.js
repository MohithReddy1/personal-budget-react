import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

function HomePage() {

  const [budgetData, setBudgetData] = useState([]);
  const [isd3ChartCreated, setIsd3ChartCreated] = useState(false);
  const d3ChartRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3002/budget')
      .then((res) => {
        setBudgetData(res.data.myBudget);
        createChart(res.data.myBudget);

        if (!isd3ChartCreated) {
          D3JSchart(res.data.myBudget);
          setIsd3ChartCreated(true);
        }
      })
      .catch((error) => {
        console.error('Error while fetching the data:', error);
      });
  }, [isd3ChartCreated]);

  function createChart(data) {
    const ctx = document.getElementById("myChart").getContext("2d");

    const availableChart = Chart.getChart(ctx);
    if (availableChart) {
      availableChart.destroy();
    }

    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.title),
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: [
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#9b59b6',
            '#1abc9c',
            '#2ecc71',
            '#34495e',
          ],
        }],
      },
    });
  }

  function D3JSchart(data) {
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    if (d3ChartRef.current) {
      d3.select(d3ChartRef.current).selectAll('*').remove();
    }

    const svg = d3.select(d3ChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    var colorScale = d3.scaleOrdinal()
      .range(["#f39c12", "#3498db", "#2ecc71", "#e74c3c", "#9b59b6", "#1abc9c", "#f1c40f", "#34495e"]);

    const pieChart = d3.pie()
      .value(d => d.budget);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    var slice = svg.selectAll(".slice")
      .data(pieChart(data))
      .enter()
      .append("g")
      .attr("class", "slice");

    slice.append("path")
      .attr("d", arc)
      .style("fill", function (d, i) { return colorScale(i); })
      .style("stroke", "white")
      .style("stroke-width", 2);

    // Add text labels to slices
    slice.append("text")
      .attr("transform", function (d) {
        var pos = arc.centroid(d);
        pos[0] *= 1.55;
        pos[1] *= 1.55;
        return "translate(" + pos + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function (d, i) { return d.data.title; });

    // Add polyline connecting text labels to slices
    slice.append("polyline")
      .attr("points", function (d) {
        var pos = arc.centroid(d);
        pos[0] *= 1.5;
        pos[1] *= 1.5;
        return [arc.centroid(d), pos];
      })
      .attr("fill", "none")
      .attr("stroke", "black");

  }

  return (
    <div className="container center" role="main">

      <section className="page-area">

        <article className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article className="text-box">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </article>

        <article className="text-box">
          <h1>Free</h1>
          <p>
            This app is free!!! And you are the only one holding your data!
          </p>
        </article>

        <article className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article className="text-box" id="main-content">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </article>

        <article className="text-box">
          <h1>Chart</h1>
          <p>
            <canvas id="myChart" width="400" height="400"></canvas>
          </p>
        </article>

        <article className="text-box">
          <h1>D3JSChart</h1>
          <div ref={d3ChartRef}></div>
        </article>

      </section>

    </div>
  );
}

export default HomePage;
