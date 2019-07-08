
document.addEventListener("DOMContentLoaded", () => {

  const width = 740
  const height = 500

  const container = d3.select("#viz")

  const svg = container.append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#f5f3ef")

  d3.json("/cantons.json")
    .then(cantons => {

      d3.csv("/referendum.csv")
        .then(yesVotes => {

          const tooltip = container.append("div")
          .style("opacity", 0)
          .style("position", "fixed")
          .style("background", "rgba(255,255,255,0.8)")
          .style("padding", "0.5rem")
          .style("pointer-events", "none")

          const projection = d3.geoAlbers()
          .center([0, 46.7])
          .rotate([-9, 0, 0])
          .parallels([40, 50])
          .scale(12500)

          const pathGenerator = d3.geoPath().projection(projection)

          const globe = svg.selectAll("path")
          .data(cantons.features)
          .enter()
          .append("path")
          .attr("d", d => pathGenerator(d))
          .on("click", function(d) {
            tooltip
            .style("opacity", 1)
            .html(d.ja_anteil)
          })
          .on("mouseenter", function(d) {
            tooltip
            .style("opacity", 1)
            .html(d.properties.name)
          })
          .on("mousemove", function() {
            tooltip
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
          })
          .on("mouseleave", function() {
            tooltip.style("opacity", 0)
          })
          .attr("fill", "#ceccc0")
          .attr("stroke", "#f5f3ef")
          .attr("fill", function (d) {
          const yescount = yesVotes.find(yes => yes.id == d.properties.id);

          const colorScale = d3.scaleThreshold()
            .domain([30,35,40,45,50,55,60,65,70,100])
            .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"])

          return colorScale(yescount.ja_anteil)

          });

          console.log(cantons.features)

          console.log(yesVotes)

          console.log(yesVotes[1].ja_anteil)

          /* results */

          const results = svg.selectAll("circle")
            .data(yesVotes)
            .enter()
            .append("circle")
            .attr("d", d => pathGenerator(d))
            .on("click", d => {
              console.log("Data: ", d.ja_anteil)
            })
            .on("click", function(d) {
              tooltip
              .style("opacity", 1)
              .html(d.ja_anteil)
            })

          /* results */


            /*
            return yescount.ja_anteil >= 50 ? "#76c770" : "#cb3535";
            */

          // ====================

          // Visualisierung...

          // ====================

        })
    })
})
