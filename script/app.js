//------ Données ------
sessionStorage.setItem("country","Sénégal")
//site donnée
let sitedata
fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            sitedata = data
        }).catch(error => { console.error('Error loading JSON data:', error);
        });

//------ Rendre la carte ------
//Généré des couleurs
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//taille du cadre
var width = window.innerWidth,
    height = window.innerHeight;

//-- creation de la carte dans un svg --
var svg = d3.select("#my_dataviz")
    .attr("width", width)
    .attr("height", height)
    .on("click",reset)

// map et projection
var projection
var path

// charge la carte
d3.json("../data/africa.json").then(function (data) {
    // Ajuster la projection
    projection = d3.geoMercator().fitSize([width, height], data);
    path = d3.geoPath().projection(projection);

    // Créer un groupe pour chaque regions
    var regionGroups = svg.selectAll("g.region")
        .data(data.features)
        .enter()
        .append("g")
        .attr("class", "region")
        .on("click", zoomToFeature);

    // Dessiner les paths
    regionGroups.append("path")
        .attr("class", d => `${d.geometry.type} no-checked`)
        .attr("name", d => d.properties.name_fr)
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        
        .attr("d", path);

    // Ajouter les textes
    regionGroups.append("text")
        .attr("class", d => d.properties.name_fr + " region-label")
        .attr("text-anchor", "middle")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("onclick",d => 'toPage("'+d.properties.name_fr+'")').text(d => d.properties.name_fr)
        .on("mouseover", (d) => raise(d.srcElement.parentNode))

        //première mise à jours
        init()
});

const raise = (d) => {
    d3.select(d).raise()
  }

//-- Fonction de zoom --
//Zoom sur une region
function zoomToFeature(event, d) {
    if (! event.target.classList.contains("no-checked")) { //ne pas zoomer lors de la deselection
        // Empêche le reset aussi
        event.stopPropagation();

        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(2)  // Zoom ×2
                    .translate(-path.centroid(d)[0], -path.centroid(d)[1])
            );
    }
}

//système de navigation
const zoom = d3.zoom()
    .scaleExtent([0.5, 8])
    .on('zoom', zoomed);

svg.call(zoom);

function zoomed(event) {
    svg.selectAll('path')
        .attr('transform', event.transform);

    svg.selectAll(".region-label").attr('transform', event.transform);
}

function reset() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
}

//------ initiation des entrées ------
var selectedRegion

function init() {
    //recupere la barre de recherche
    selectedRegion = "empty"
    //selectionne et deselectionne une region
    let mp = document.querySelectorAll(".MultiPolygon")
    mp.forEach((p) => {
        p.setAttribute("stroke",getRandomColor())
        p.onclick = () => {
            if (p.classList.contains("no-checked")) {
                mp.forEach((e) => {
                    if (! e.classList.contains("no-checked") ) {
                        e.classList.add("no-checked")
                    }
                })
                p.classList.remove("no-checked")
                p.setAttribute("fill", p.getAttribute("stroke"))
                selectedRegion = p.getAttribute("name")
              
            }else{
                p.classList.add("no-checked")
                selectedRegion = "empty"
                
            }
        }
    })

    //selectionne et deselectionne une region
    mp = document.querySelectorAll(".Polygon")
    mp.forEach((p) => {
        p.setAttribute("stroke",getRandomColor())
        p.onclick = () => {
            if (p.classList.contains("no-checked")) {
                mp.forEach((e) => {
                    if (! e.classList.contains("no-checked") ) {
                        e.classList.add("no-checked")
                    }
                })
                p.classList.remove("no-checked")
                p.setAttribute("fill", p.getAttribute("stroke"))
                selectedRegion = p.getAttribute("name")
           
            }else{
                p.classList.add("no-checked")
                selectedRegion = "empty"

            }
        }
    })
}

function toPage(country) {
    sessionStorage.setItem("country",country)
    location.replace("page/site.html")
}
