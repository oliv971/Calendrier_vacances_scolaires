/********************************** */
/* Affichage du modal
/********************************** */
$(window).on('load', function () {
    setTimeout(function () {
        $('#exampleModal').modal('show');
    }, 1000);
});
/* ********************************* */
let accueil = document.querySelector("#accueil");
let select = document.createElement('select');
select.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select.innerHTML = `<option class='text-center'>--Sélectionnez une année--</option>`;
let select2 = document.createElement('select');
select2.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select2.innerHTML = `<option class='text-center'>--Sélectionnez une zone--</option>`;
let select3 = document.createElement('select');
select3.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select3.innerHTML = `<option class='text-center'>--Sélectionnez une période--</option>`;
let affiche = document.createElement('div');
affiche.id = 'affiche';
let modal_body = document.querySelector(".modal-body");
accueil.appendChild(select);
accueil.appendChild(select2);
accueil.appendChild(select3);
let tab_result = [];
let tab_years = [];
let tab_zones = ['Zone A', 'Zone B', 'Zone C', 'Corse', 'Guadeloupe', 'Martinique', 'Guyane'];
let val_description = "";
for (let i = 0; i < tab_zones.length; i++) {
    let val_zone = "";
    let val_desc = "";
    let val_date_deb = "";
    let val_date_fin = "";
    fetch(`https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=zones%20like%20%22${tab_zones[i]}%22%20and%20start_date%20%3E%20now()&order_by=start_date%20asc&limit=1`)
        .then(response => {
        return response.json();
    })
        .then(data => {
        for (let i = 0; i < data.results.length; i++) {
            val_zone = data.results[i].zones.toString();
            val_desc = data.results[i].description.toString();
            val_date_deb = data.results[i].start_date.substring(0, 10).toString();
            val_date_fin = data.results[i].end_date.substring(0, 10).toString();
            val_date_deb = format_date(val_date_deb).toString();
            val_date_fin = format_date(val_date_fin).toString();
            modal_body.innerHTML += `<h6 id=${val_zone}><strong>${val_desc}:</strong> Du ${val_date_deb} Au ${val_date_fin} <strong>(${val_zone})</strong></h6>`;
        }
    });
}
let newStr = "";
function modifStr(str) {
    if (str.match(/_/g)) {
        newStr = str.substring(0, str.length).split('_').join(' ');
    }
    else if (str.match(/ /g)) {
        newStr = str.substring(0, str.length).split(' ').join('_');
    }
    else
        newStr = str;
    return newStr;
}
function format_date(date) {
    let newDate = new Date(date);
    let newFormat = newDate.toLocaleDateString('fr');
    return newFormat;
}
let annee = new Date();
for (let i = annee.getFullYear() - 1; i < annee.getFullYear() + 3; i++) {
    let j = i;
    j += 1;
    tab_years.push(`${i}-${j}`);
}
for (let i = 0; i < tab_years.length; i++) {
    select.innerHTML += `<option class='text-center' id=${tab_years[i]} value=${tab_years[i]}>${tab_years[i]}</option>`;
}
select.addEventListener('change', (e) => {
    select2.innerHTML = `<option class='text-center'>--Sélectionnez une zone--</option>`;
    select3.innerHTML = `<option class='text-center'>--Sélectionnez une période--</option>`;
    affiche.style.display = "none";
    tab_result[0] = e.target.value;
    for (let i = 0; i < tab_zones.length; i++) {
        let zone = "";
        zone = modifStr(tab_zones[i]);
        select2.innerHTML += `<option class='text-center' id=${zone} value=${zone}>${tab_zones[i]}</option>`;
    }
});
select2.addEventListener('change', (e) => {
    select3.innerHTML = `<option class='text-center'>--Sélectionnez une période--</option>`;
    affiche.style.display = 'none';
    tab_result[1] = e.target.value;
    tab_result[1] = modifStr(tab_result[1]);
    fetch(`https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=annee_scolaire%20like%20%22${tab_result[0]}%22%20and%20zones%20like%20%22${tab_result[1]}%22&group_by=description`)
        .then(response => {
        return response.json();
    })
        .then(data => {
        for (let i = 0; i < data.results.length; i++) {
            val_description = modifStr(data.results[i].description);
            select3.innerHTML += `<option class='text-center' id=${val_description} value=${val_description}>${data.results[i].description}</option>`;
        }
    });
});
let date_deb = "";
let date_fin = "";
select3.addEventListener('change', (e) => {
    affiche.innerHTML = "";
    tab_result[2] = e.target.value;
    tab_result[2] = modifStr(tab_result[2]);
    fetch(`https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=annee_scolaire%20like%20%22${tab_result[0]}%22%20and%20zones%20like%20%22${tab_result[1]}%22%20and%20description%20like%20%22${tab_result[2]}%22&limit=1`)
        .then(response => {
        return response.json();
    })
        .then(data => {
        for (let i = 0; i < data.results.length; i++) {
            date_deb = data.results[i].start_date.substring(0, 10);
            date_fin = data.results[i].end_date.substring(0, 10);
            if (date_deb && date_fin) {
                date_deb = format_date(date_deb);
                date_fin = format_date(date_fin);
                affiche.innerHTML += `<h6 class='text-success text-center'>Date début: <span class='text-white'>${date_deb}</span></h6>`;
                affiche.innerHTML += `<h6 class='text-success text-center'>Date fin: <span class='text-white'>${date_fin}</span></h6>`;
            }
            else
                affiche.innerHTML += `<h6 class='text-danger text-center'>Données indisponibles</h6>`;
        }
        affiche.style.display = 'block';
        accueil.appendChild(affiche);
    });
});
