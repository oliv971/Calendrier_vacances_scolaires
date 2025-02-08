// const axios = require('axios');


let accueil = document.querySelector("#accueil");
// accueil.style.marginLeft = "40%";
// accueil.style.marginRight = "40%";

let select = document.createElement('select');
select.classList.add("form-select", "form-select-sm", "mb-3");
select.style.width = "30%";
select.style.margin = "auto";
select.innerHTML = `<option>--Sélectionnez un département--</option>`;

let select2 = document.createElement('select');
select2.classList.add("form-select", "form-select-sm", "mb-3");
select2.style.width = "30%";
select2.style.margin = "auto";
select2.innerHTML = `<option>--Sélectionnez une commune--</option>`;


let detail = document.createElement("div");
detail.style.width = "30%";
detail.style.margin = "auto";
// detail.innerHTML = "";


accueil.appendChild(select);
accueil.appendChild(select2);
accueil.append(detail);


fetch("https://geo.api.gouv.fr/departements")
    .then(response => {
        // console.log(response.json());
        return response.json();
    })
    .then(data =>{
        // console.log(data);
        let datas = data
        for (const key in datas) {
            let code = `${datas[key].code}`;
            let nom = `${datas[key].nom}`;
            select.innerHTML += `<option id=${code} value=${code}>${nom} (${code})</option>`;
        }
    }
)

select.addEventListener('change', (e) => {
    dept = e.target.value;
    select2.innerHTML = `<option>--Sélectionnez une commune--</option>`;
    detail.innerHTML = "";
    getCommunes(dept);
    e.preventDefault();
})

function getCommunes(dept) {

    fetch(`https://geo.api.gouv.fr/departements/${dept}/communes`)
    .then(response => {
        // console.log(response.json());
        return response.json();
    })
    .then(data =>{
        // console.log(data);
        let datas = data
        // select2.innerHTML = `<option>--Sélectionnez une commune--</option>`;
        for (const key in datas) {
            let code = `${datas[key].code}`;
            let nom = `${datas[key].nom}`;
            select2.innerHTML += `<option id=${code} value=${code}>${nom} (${datas[key].codesPostaux[0]})</option>`;
        }
    }
    )
}

select2.addEventListener('change', (e) => {
    commune = e.target.value;
    // console.log(dept);
    getInfosCommune(commune);
    e.preventDefault();
})

function getInfosCommune(commune) {
    
    fetch(`https://etablissements-publics.api.gouv.fr/v3/communes/${commune}/mairie`)
    .then(response => {
        // console.log(response.json());
        return response.json();
    })
    .then(data =>{
        console.log(data.features);
        let datas = data.features;
        if (datas.length > 0) {
            detail.style.background = 'khaki';
        }
        let nom = "";
        let adresse = "";
        let tph = "";
        let email = "";
        // detail.innerHTML = "";
        // console.log(key);
        nom = `${datas[0].properties.nom}`;
        let adresseLignes = datas[0].properties.adresses[0].lignes;
        for (const key in adresseLignes) {
            adresse += `${adresseLignes[key]}<br>`;
        }
        tph = `${datas[0].properties.telephone}`;
        if (datas[0].properties.email) {
            email = `${datas[0].properties.email}`;
        }
        // console.log(`${datas[0].properties.nom}`);
        detail.innerHTML = `${nom}<br>`;
        detail.innerHTML += `<strong>Adresse:</strong> ${adresse}`;
        detail.innerHTML += `${datas[0].properties.adresses[0].codePostal} ${datas[0].properties.adresses[0].commune}<br>`;
        detail.innerHTML += `<strong>Téléphone:</strong> ${tph}<br>`;
        detail.innerHTML += `<strong>Email:</strong> <a href='mailto:${email}'>${email}</a><br>`;
    }
    )
}
