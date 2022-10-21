const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyData;
let educationData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      const id = countyDataItem["id"];
      const county = educationData.find((item) => {
        return item["fips"] === id;
      });
      const percentage = county["bachelorsOrHigher"];
      if (percentage <= 20) {
        return "Lightgreen";
      } else if (percentage <= 40) {
        return "Darkgreen";
      } else if (percentage <= 60) {
        return "Forestgreen";
      } else {
        return "Red";
      }
    })
    .attr("data-fips", (countyDataItem) => {
      return countyDataItem["id"];
    })
    .attr("data-education", (countyDataItem) => {
      const id = countyDataItem["id"];
      const county = educationData.find((item) => {
        return item["fips"] === id;
      });
      const percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countyDataItem) => {
      tooltip.transition().style("visibility", "visible");

      const id = countyDataItem["id"];
      const county = educationData.find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        county["area_name"] +
          ", " +
          county["state"] +
          ": " +
          county["bachelorsOrHigher"] +
          "%"
      );
      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});
