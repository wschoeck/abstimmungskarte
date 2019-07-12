
document.addEventListener("DOMContentLoaded", () => {

  const width = 800
  const height = 600

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
          .style("padding-top", "0.1rem")
          .style("padding-bottom", "0.1rem")
          .style("pointer-events", "none")
          .style("font-size", 18 + "px")

          const percent = container.append("div")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("padding", "0.5rem")
          .style("padding-top", "0.1rem")
          .style("padding-bottom", "0.1rem")
          .style("pointer-events", "none")
          .style("left", 20 + "px")
          .style("top", 100 + "px")
          .style("font-size", 42 + "px")
          .style("font-weight", "700")

          const yespercent = container.append("div")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("padding", "0.5rem")
          .style("padding-top", "0.1rem")
          .style("padding-bottom", "0.1rem")
          .style("pointer-events", "none")
          .style("left", 20 + "px")
          .style("top", 180 + "px")
          .style("font-size", 42 + "px")
          .style("font-weight", "700")

          const rectpercent = svg.append("rect")
          .style("opacity", 0)
          .attr("x", 10)
          .attr("y", 105)
          .attr("width", 120)
          .attr("height", 4)
          .attr("fill", "#008100")

          const rectyes = svg.append("rect")
          .style("opacity", 0)
          .attr("x", 10)
          .attr("y", 185)
          .attr("width", 120)
          .attr("height", 4)
          .attr("fill", "#9c0303")

          const textpercent = svg.append("text")
          .style("opacity", 0)
          .attr("x", 10)
          .attr("y", 100)
          .attr("font-size", 20)
          .attr("font-family", "Cairo")
          .attr("fill", "#000000")
          .style("font-weight", "700")
          .attr("fill", "#008100")
          .text("Ja");

          const textyes = svg.append("text")
          .style("opacity", 0)
          .attr("x", 10)
          .attr("y", 180)
          .attr("font-size", 20)
          .attr("font-family", "Cairo")
          .attr("fill", "#9c0303")
          .style("font-weight", "700")
          .text("Nein");

          const textheadline = svg.append("text")
          .attr("x", 10)
          .attr("y", 40)
          .attr("font-size", 30)
          .attr("font-family", "Cairo")
          .attr("font-weight", "400")
          .text("Bundesbeschluss über Biometrische Pässe");

          const texttest = container.selectAll("div")
          .style("font-family", "Cairo")


          const projection = d3.geoAlbers()
          .center([-0.2, 47])
          .rotate([-9, 0, 0])
          .parallels([40, 50])
          .scale(12500)

          const pathGenerator = d3.geoPath().projection(projection)

          const globe = svg.selectAll("path")
          .data(cantons.features)
          .enter()
          .append("path")
          .attr("d", d => pathGenerator(d))
          .on("mouseenter", function(d) {
            tooltip
            .style("opacity", 1)
            .style("color", "#000000")
            .html(d.name)
            percent
            .style("opacity", 1)
            .style("color", "#000000")
            .html(100 - d.ja_anteil + "%")
            yespercent
            .style("opacity", 1)
            .style("color", "#000000")
            .html(d.ja_anteil + "%")
            textpercent
            .style("opacity", 1)
            textyes
            .style("opacity", 1)
            rectyes
            .style("opacity", 1)
            rectpercent
            .style("opacity", 1)
          })
          .on("mousemove", function(d) {
            tooltip
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
          })
          .on("mouseleave", function(d) {
            tooltip.style("opacity", 0)
          })
          .on("mouseleave", function(d) {
            yespercent.style("opacity", 0)
            percent.style("opacity", 0)
            yespercent.style("opacity", 0)
            textpercent.style("opacity", 0)
            textyes.style("opacity", 0)
            rectyes.style("opacity", 0)
            rectpercent.style("opacity", 0)
          })
          .attr("fill", "#ceccc0")
          .attr("stroke", "#f5f3ef")
          .attr("fill", function (d) {
          const yescount = yesVotes.find(yes => yes.id == d.properties.id);

          const colorScale = d3.scaleThreshold()
            .domain([45,47.5,50,52.5,55])
            .range(['#003d00', '#008100', '#43c834', '#ffa19b', '#d74860', '#880033'])

          return colorScale(yescount.ja_anteil)

          });

          console.log(cantons.features)

          console.log(yesVotes)

          console.log(yesVotes[1].ja_anteil)

          /* results */

          const results = svg.selectAll("path")
            .data(yesVotes)
            .enter()

          /* results */

          const rect = svg.append("rect")
          .attr("x", 10)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#880033")

          const recttwo = svg.append("rect")
          .attr("x", 70)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#d74860")

          const rectthree = svg.append("rect")
          .attr("x", 130)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#ffa19b")

          const rectfour = svg.append("rect")
          .attr("x", 190)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#43c834")

          const rectfive = svg.append("rect")
          .attr("x", 250)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#008100")

          const rectsix = svg.append("rect")
          .attr("x", 310)
          .attr("y", 550)
          .attr("width", 60)
          .attr("height", 10)
          .attr("fill", "#003d00")

          const textnumber = svg.append("text")
          .attr("x", 10)
          .attr("y", 540)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("Prozent Ja-Stimmen");

          const textone = svg.append("text")
          .attr("x", 10)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<45%");

          const texttwo = svg.append("text")
          .attr("x", 70)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<47.5%");

          const textthree = svg.append("text")
          .attr("x", 130)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<50%");

          const textfour = svg.append("text")
          .attr("x", 190)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<52.5%");

          const textfive = svg.append("text")
          .attr("x", 250)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<55%");

          const textsix = svg.append("text")
          .attr("x", 310)
          .attr("y", 580)
          .attr("font-size", 14)
          .attr("font-family", "Cairo")
          .text("<57.5%");


          const textquellen = svg.append("text")
          .attr("x", 650)
          .attr("y", 580)
          .attr("font-size", 12)
          .attr("font-family", "Cairo")
          .attr("fill", "#838383")
          .text("Quelle: atlas.bfs.admin.ch");



            /*
            return yescount.ja_anteil >= 50 ? #76c770 : #d90f0f;
            */

          // ====================

          // Visualisierung...

          // ====================

        })
    })
})
