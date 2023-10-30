/********************************** */
/* Affichage du modal
/********************************** */
$(window).on('load', function () {
    setTimeout(function () {
        $('#exampleModal').modal('show');
    }, 1000);
});
/* ********************************* */
var accueil = document.querySelector("#accueil");
var select = document.createElement('select');
select.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une ann\u00E9e--</option>";
var select2 = document.createElement('select');
select2.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select2.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une zone--</option>";
var select3 = document.createElement('select');
select3.classList.add("form-select", "form-select-sm", "mb-3", "select-tab");
select3.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une p\u00E9riode--</option>";
var affiche = document.createElement('div');
affiche.id = 'affiche';
var modal_body = document.querySelector(".modal-body");
accueil.appendChild(select);
accueil.appendChild(select2);
accueil.appendChild(select3);
var tab_result = [];
var tab_years = [];
var tab_zones = ['Zone A', 'Zone B', 'Zone C', 'Corse', 'Guadeloupe', 'Martinique', 'Guyane'];
var val_description = "";
var _loop_1 = function (i) {
    var val_zone = "";
    var val_desc = "";
    var val_date_deb = "";
    var val_date_fin = "";
    fetch("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=zones%20like%20%22".concat(tab_zones[i], "%22%20and%20start_date%20%3E%20now()&order_by=start_date%20asc&limit=1"))
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        for (var i_1 = 0; i_1 < data.results.length; i_1++) {
            val_zone = data.results[i_1].zones.toString();
            val_desc = data.results[i_1].description.toString();
            val_date_deb = data.results[i_1].start_date.substring(0, 10).toString();
            val_date_fin = data.results[i_1].end_date.substring(0, 10).toString();
            val_date_deb = format_date(val_date_deb).toString();
            val_date_fin = format_date(val_date_fin).toString();
            modal_body.innerHTML += "<h6 id=".concat(val_zone, "><strong>").concat(val_desc, ":</strong> Du ").concat(val_date_deb, " Au ").concat(val_date_fin, " <strong>(").concat(val_zone, ")</strong></h6>");
        }
    });
};
for (var i = 0; i < tab_zones.length; i++) {
    _loop_1(i);
}
var newStr = "";
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
    var newDate = new Date(date);
    var newFormat = newDate.toLocaleDateString('fr');
    return newFormat;
}
var annee = new Date();
for (var i = annee.getFullYear() - 1; i < annee.getFullYear() + 3; i++) {
    var j = i;
    j += 1;
    tab_years.push("".concat(i, "-").concat(j));
}
for (var i = 0; i < tab_years.length; i++) {
    select.innerHTML += "<option class='text-center' id=".concat(tab_years[i], " value=").concat(tab_years[i], ">").concat(tab_years[i], "</option>");
}
select.addEventListener('change', function (e) {
    select2.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une zone--</option>";
    select3.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une p\u00E9riode--</option>";
    affiche.style.display = "none";
    tab_result[0] = e.target.value;
    for (var i = 0; i < tab_zones.length; i++) {
        var zone = "";
        zone = modifStr(tab_zones[i]);
        select2.innerHTML += "<option class='text-center' id=".concat(zone, " value=").concat(zone, ">").concat(tab_zones[i], "</option>");
    }
});
select2.addEventListener('change', function (e) {
    select3.innerHTML = "<option class='text-center'>--S\u00E9lectionnez une p\u00E9riode--</option>";
    affiche.style.display = 'none';
    tab_result[1] = e.target.value;
    tab_result[1] = modifStr(tab_result[1]);
    fetch("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=annee_scolaire%20like%20%22".concat(tab_result[0], "%22%20and%20zones%20like%20%22").concat(tab_result[1], "%22&group_by=description"))
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        for (var i = 0; i < data.results.length; i++) {
            val_description = modifStr(data.results[i].description);
            select3.innerHTML += "<option class='text-center' id=".concat(val_description, " value=").concat(val_description, ">").concat(data.results[i].description, "</option>");
        }
    });
});
var date_deb = "";
var date_fin = "";
select3.addEventListener('change', function (e) {
    affiche.innerHTML = "";
    tab_result[2] = e.target.value;
    tab_result[2] = modifStr(tab_result[2]);
    fetch("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?select=*&where=annee_scolaire%20like%20%22".concat(tab_result[0], "%22%20and%20zones%20like%20%22").concat(tab_result[1], "%22%20and%20description%20like%20%22").concat(tab_result[2], "%22&limit=1"))
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        for (var i = 0; i < data.results.length; i++) {
            date_deb = data.results[i].start_date.substring(0, 10);
            date_fin = data.results[i].end_date.substring(0, 10);
            if (date_deb && date_fin) {
                date_deb = format_date(date_deb);
                date_fin = format_date(date_fin);
                affiche.innerHTML += "<h6 class='text-success text-center'>Date d\u00E9but: <span class='text-white'>".concat(date_deb, "</span></h6>");
                affiche.innerHTML += "<h6 class='text-success text-center'>Date fin: <span class='text-white'>".concat(date_fin, "</span></h6>");
            }
            else
                affiche.innerHTML += "<h6 class='text-danger text-center'>Donn\u00E9es indisponibles</h6>";
        }
        affiche.style.display = 'block';
        accueil.appendChild(affiche);
    });
});
