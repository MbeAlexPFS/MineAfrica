let country_data = null
let country = sessionStorage.getItem("country")
fetch('../data/data.json')
.then(response => response.json())
.then(data => {
    country_data = data[country]
    render()
})


function render() {
    let country_title = document.querySelectorAll(".country")
    let country_desc = document.querySelector("#rdesc")
    let desc = document.querySelector("#stdesc")
    let galerie = document.querySelector("#stat")

    //header
    document.title = "MineAfrica - " + country

    if (country_data != null ) {

        //country title
        country_title.forEach((e) => {
            e.textContent = country
        })
        
        //country desc
        country_desc.innerHTML = 
        ` <h1> Géographie </h1>
        <p class="tjustify">${country_data.DescGeo}
        </p>
            `

        //desc
        desc.innerHTML = ``

        Object.keys(country_data.MineProducts).forEach((un) => {
            desc.innerHTML +=
            `<tr class="">
                <td scope="row">${country_data.MineProducts[un][0]}</td>
                <td>${country_data.MineProducts[un][1]}</td>
                <td>${country_data.MineProducts[un][2]}</td>
            </tr>`    
        })

        //galerie
        galerie.innerHTML = ``
        galerie.innerHTML +=
        `<div class="col card p-2 m-2"><img src="${country_data.StatMineral.Graph}" alt="" class="img-fluid">
                    <p> ${country_data.StatMineral.DescGraph}</p></div>
            <div class="col card p-2 m-2"><img src="${country_data.StatPetrol.Graph}" alt="" class="img-fluid">
                    <p> ${country_data.StatPetrol.DescGraph}</p></div>`

    }else if (country_data == null ) {
        document.querySelector("#body").innerHTML = 
            `<div class="card text-start mt-5">
                <div class="card-body">
                    <h4 class="card-title">Desolé</h4>
                    <p class="card-text text-secondary">Il y'a aucune information pour ${country}</p>
                </div>
            </div>`
    }

}