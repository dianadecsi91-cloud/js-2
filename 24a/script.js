heroes = [];

//dictionary -> az oldalakat (good, bad, civil) színekkel rendeli össze
//ugye ezek a kulcs-érték párok
colors = new Map();
colors.set('good', 'success');
colors.set('bad', 'danger');
colors.set('civil', 'warning');

load();
display();

class SuperHero {
    id;
    name;
    side;
    power;
    ability;
    constructor() {
        this.id = crypto.randomUUID();
    }
}

//ez a függvény fut le, hogyha az input range csúszkát arrébb húzzuk
function rangeChange(event) {
    document.getElementById('range-result').innerText =
        event.srcElement.value;
}

//ez a függvény fut le, hogyha a mutáns képesség kérdésnél az igen radio-t bejelöljük
function mutantQuestionOn() {
    document.getElementById('mutantQuestion').style.display = 'block';
}

//ez a függvény fut le, hogyha a mutáns képesség kérdésnél a nem radio-t bejelöljük
function mutantQuestionOff() {
    document.getElementById('mutantQuestion').style.display = 'none';
    document.getElementById('inp_ability').value = '';
}

//ez a függvény fut le, hogyha a formot kitöltjük és a hozzáadás gombra kattintunk
function addHero() {
    let hero = new SuperHero();
    hero.name = document.getElementById('inp_name').value;
    hero.side = document.getElementById('sel_side').value;
    hero.power = parseInt(document.getElementById('inp_power').value);
    hero.ability = document.getElementById('inp_ability').value;
    heroes.push(hero);
    display();
    //form visszaállítása alapadatokra
    document.getElementById('inp_name').value = '';
    document.getElementById('sel_side').value = 'good';
    document.getElementById('inp_power').value = 5;
    document.getElementById('inp_ability').value = '';
    document.getElementById('radio_mutant_no').checked = true;
    document.getElementById('range-result').innerText = 5;
    mutantQuestionOff();
}

//szuperhős tömböt táblázatba rajzolja
function display() {
    //táblázat jelenlegi sorait eldobjuk
    document.getElementById('table_body').innerHTML = '';

    heroes.forEach(x => {
        document.getElementById('table_body').innerHTML +=
        `
            <tr class="table-${colors.get(x.side)}">
                <td>${x.name}</td>
                <td>${x.power}</td>
                <td>${displayAbility(x)}</td>
                <td>
                    <button onclick="remove('${x.id}')" class="btn btn-sm btn-danger">Törlés</button>
                    <button onclick="edit('${x.id}')" class="btn btn-sm btn-warning">Szerkesztés</button>
                </td>
            </tr>
        `;
    });
    save();
}

function displayAbility(hero){
    //ha az ability üres, akkor visszatérünk egy üres stringgel
    if (hero.ability == undefined){
        return '';
    }
    //ha az abilityben nincs vessző -> akkor csak egy van -> akkor visszatérünk vele
    if (!hero.ability.includes(',')){
        return hero.ability;
    }
    else{
        //különben a vesszők mentén felvágjuk egy string tömbbe őket
        let abilities = hero.ability.split(',');
        //és badgeeket csinálunk belőlük úgy, hogy a tömbelemek közti vesszőt semmire cseréljük
        return abilities.map(t => {
            return `<span class="badge rounded-pill bg-warning text-dark ms-1">${t}</span>`;
        }).toString().replaceAll(',','');
    }
}

//ehelyett van a dictionary
/*function getColorBySide(side){
    if (side == 'good'){
        return 'success';
    }
    else if (side == 'bad'){
        return 'danger';
    }
    else{
        return 'warning';
    }
}*/

function load(){
    heroes = JSON.parse(localStorage.getItem('heroes') ?? '[]');
}

function save(){
    localStorage.setItem('heroes', JSON.stringify(heroes));
}

function remove(id){
    heroes = heroes.filter(x => x.id != id);
    display();
}

function edit(id){
    //kinyerjük a tömbből ezt az elemet
    let hero = heroes.find(x => x.id == id);
    //töröljük a tömbből ezt az elemet
    remove(id);
    //a form-ba visszatöltjük ezt az elemet
    document.getElementById('inp_name').value = hero.name;
    document.getElementById('sel_side').value = hero.side;
    document.getElementById('inp_power').value = hero.power;
    document.getElementById('range-result').innerText = hero.power;
    document.getElementById('inp_ability').value = hero.ability;

    //amennyiben van ability-je, akkor a megfelelő radiobutton legyen bejelölve
    if (hero.ability.length > 0) { //szöveg hossza nagyobb nulla
        document.getElementById('radio_mutant_yes').checked = true;
        //és az ability input mező legyen látható!
        mutantQuestionOn();
    }
    //...majd a form végén a mentés gomb elmenti javítva -> ez a mentés gombra már meg van írva
}


