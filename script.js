// login form
const inputLoginUsername = document.getElementById('user');
const loginForm = document.getElementById('loginForm');
const inputLoginPin = document.getElementById('pswd');
const submitLogin = document.getElementById('submit');
const errorMessage = document.getElementById('errorMessage');

// exit
const logout = document.getElementById('exit');

// body app
const nav = document.getElementById('navBar');
const bodyApp = document.getElementById('main');
const bodyContent = document.getElementById('mainContent');
const footer = document.getElementById('footer');

// buttons
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const buttonBack = document.getElementById('back');

// search
const select_month = document.getElementById('selectMonth');
const select_year = document.getElementById('selectYear');
const button_search = document.getElementById('buttonSearch');

const state = {
  page: 1,
  resultsPerPage: 3,
  totalPages: 0,
};

// select month
const month = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const year = Array.from({ length: 80 }, (cur, i) => 2000 + i);
///////////////////////////////////////////////////////
// lectura del JSON
let users;
(async function () {
  const response = await fetch('./data.json');
  const response_format = await response.json();
  const data = JSON.stringify(response_format);
  users = JSON.parse(data);
})();

//////////////////////////////////////////////////

const fillSelect = function (selectId, data) {
  const select = document.querySelector(selectId);
  data.forEach(element => {
    const option = document.createElement('option');
    option.text = element;
    option.value = element;
    select.appendChild(option);
  });
};

////////////////////////////////////////////////////

const fillData = function (id, data) {
  const component = document.getElementById(id);
  component.innerHTML = '';
  component.innerHTML = data;
};

///////////////////////////////////////////////////

const old = dateStart => {
  const [dayStart, monthStart, yearStart] = dateStart.split('/');
  const dateStartFormat = new Date(yearStart, monthStart - 1, dayStart);
  const today = new Date();
  const difference = Math.abs(today - dateStartFormat);
  const yearsTotal = (difference / (1000 * 3600 * 24) / 365).toFixed(1);
  return yearsTotal;
};

const fillInfo = currentAccount => {
  // welcome message
  fillData('welcomeMessage', `Bienvenido ${currentAccount.name}`);
  // data
  fillData('code', `${currentAccount.id}`);
  fillData('name', `${currentAccount.name} ${currentAccount.lastname}`);
  fillData('birthday', `${currentAccount.birthday}`);
  fillData('startDate', `${currentAccount.startDate}`);
  fillData('shift', `${currentAccount.shift}`);
  fillData(
    'vacations',
    `${currentAccount.vacationsTotal - currentAccount.vacationsUse}`
  );
  fillData('position', `${currentAccount.position}`);
  fillData('old', `${old(currentAccount.startDate)} años`);
};

/////////////////////////////////////////////////////

const numPagesPerPage = dataSize => {
  const numPages =
    dataSize?.length === undefined
      ? 0
      : Math.ceil(dataSize.length / state.resultsPerPage);
  return numPages;
};

////////////////////////////////////////////////////

// table
const dataTable = function (data) {
  // first page
  if (state.page <= 0 || state.page === 1) {
    previous.style.visibility = 'hidden';
  }
  // last page
  if (state.page === state.totalPages) {
    next.style.visibility = 'hidden';
  }

  const mytablebody = document.getElementById('tbody');
  // creating all cells
  const body = data
    ?.map((item, i) => {
      return `<tr> 
    <td>${item.month}</td>
    <td>${item.payday}</td>
    <td>${item.periodEnd}</td>
    <td>${item.concept}</td>
    <td>$ ${item.total}</td>
    <td><button type="button" class="btn btn-link btn-sm btn-rounded botonModal" id=${item.id}>Ver detalle</button></td>
    </tr>`;
    })
    .join('');
  mytablebody.innerHTML = body;
};

// button Ver detalle
const on = (element, event, selector, handler) => {
  element.addEventListener(event, e => {
    // target implementa una delegacion del evento
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

/// Deducciones
const ISR = sueldo => {
  const isr = (sueldo * 2.267) / 100;
  return isr.toFixed(2);
};

const IMSS = sueldo => {
  const imss = (sueldo * 1.134) / 100;
  return imss.toFixed(2);
};

const INFONAVIT = sueldo => {
  const infonavit = (sueldo * 1.638) / 100;
  return infonavit.toFixed(2);
};

const extra = hours => {
  return (hours * 60).toFixed(2);
};

on(document, 'click', '.botonModal', e => {
  const fila = e.target.parentNode;
  const id = +fila.firstElementChild.getAttribute('id') - 1;

  const modal = document.querySelector('.modalData');
  //const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.close-modal');
  /* LLENADO DE LA NOMINA DEL MODAL */

  const totalDeducciones = document.getElementById('total_deducciones');
  const totalPercepciones = document.getElementById('total_percepciones');
  const neto = document.getElementById('neto');

  const deducciones = [
    +ISR(currentAccount.payslip[id].base),
    +IMSS(currentAccount.payslip[id].base),
    +INFONAVIT(currentAccount.payslip[id].base),
  ];

  totalDeducciones.innerHTML = `$ ${deducciones.reduce((a, b) => a + b)}`;
  const nameNomina = document.getElementById('nameNomina');
  const RFC = document.getElementById('RFC');
  const CURP = document.getElementById('CURP');
  const period = document.getElementById('period');
  const base = document.getElementById('base');
  const holiday = document.getElementById('holiday');
  const overtime = document.getElementById('overtime');
  const despensa = document.getElementById('despensa');
  const punctuality = document.getElementById('punctuality');
  const attendance = document.getElementById('attendance');
  const imss = document.getElementById('IMSS');
  const isr = document.getElementById('ISR');
  const infonavit = document.getElementById('INFONAVIT');

  nameNomina.innerHTML = '';
  RFC.innerHTML = '';
  CURP.innerHTML = '';
  period.innerHTML = '';
  base.innerHTML = '';
  holiday.innerHTML = '';
  overtime.innerHTML = '';
  despensa.innerHTML = '';
  punctuality.innerHTML = '';
  attendance.innerHTML = '';
  imss.innerHTML = '';
  isr.innerHTML = '';
  infonavit.innerHTML = '';

  // personal data
  nameNomina.innerHTML = `${currentAccount.name} ${currentAccount.lastname}`;
  RFC.innerHTML = currentAccount.rfc;
  CURP.innerHTML = currentAccount.curp;
  period.innerHTML = `${currentAccount.payslip[id].periodStart} al ${currentAccount.payslip[id].periodEnd}`;
  // percepciones

  base.innerHTML = `$ ${currentAccount.payslip[id].base.toFixed(2)}`;
  holiday.innerHTML = `$ ${currentAccount.payslip[id].holiday.toFixed(2)}`;
  overtime.innerHTML = `$ ${extra(currentAccount.payslip[id].overtime)}`;
  despensa.innerHTML = `$ ${currentAccount.payslip[id].despensa.toFixed(2)}`;
  punctuality.innerHTML = `$ ${currentAccount.payslip[id].punctuality.toFixed(
    2
  )}`;
  attendance.innerHTML = `$ ${currentAccount.payslip[id].attendance.toFixed(
    2
  )}`;
  const sum_percepciones =
    +currentAccount.payslip[id].base.toFixed(2) +
    +currentAccount.payslip[id].holiday.toFixed(2) +
    +extra(currentAccount.payslip[id].overtime) +
    +currentAccount.payslip[id].despensa.toFixed(2) +
    +currentAccount.payslip[id].punctuality.toFixed(2) +
    +currentAccount.payslip[id].attendance.toFixed(2);
  // deducciones
  imss.innerHTML = `$ ${deducciones[1]}`;
  isr.innerHTML = `$ ${deducciones[0]}`;
  infonavit.innerHTML = `$ ${deducciones[2]}`;
  // totales
  totalPercepciones.innerHTML = `$ ${sum_percepciones.toFixed(2)}`;

  neto.innerHTML = `$ ${(
    +sum_percepciones - +deducciones.reduce((a, b) => a + b)
  ).toFixed(2)}`;
  modal.classList.remove('hidden');
  // overlay.classList.remove('hidden');
  const closeModal = function () {
    modal.classList.add('hidden');
    //overlay.classList.add('hidden');
  };

  btnCloseModal.addEventListener('click', closeModal);
});

const getSearchResultsPage = function (page = state.page, data) {
  state.page = page;
  const start = (page - 1) * state.resultsPerPage; // 0
  const end = page * state.resultsPerPage; // 9
  dataTable(currentAccount.payslip.slice(start, end));
};

// buttons
next.addEventListener('click', function () {
  state.page += 1;
  getSearchResultsPage(state.page, currentAccount.payslip);
  if (state.page > 1) {
    previous.style.visibility = 'visible';
  }
});

previous.addEventListener('click', function () {
  state.page -= 1;
  getSearchResultsPage(state.page, currentAccount.payslip);

  if (state.page <= 0 || state.page === 1) {
    previous.style.visibility = 'hidden';
  }
  if (state.page > 0 || state.page < state.totalPages) {
    next.style.visibility = 'visible';
  }
});

buttonBack.addEventListener('click', function () {
  dataTable(currentAccount.payslip?.slice(0, state.resultsPerPage));
  buttonBack.classList.add('hidden');
  previous.classList.remove('hidden');
  next.classList.remove('hidden');
});
///////////////////////////////////////////////////

// search

button_search.addEventListener('click', function () {
  // validar que haya un mes
  const selectedMonth =
    select_month.value !== 'Mes' ? select_month.value : 'error';

  // validar que haya un año
  const selectedYear =
    select_year.value !== 'Año' ? select_year.value : 'error';

  // mensaje de error
  console.log(`mes: ${selectedMonth} año: ${selectedYear}`);
  // filtrado de datos
  const results = currentAccount.payslip.filter(
    data => data.month === selectedMonth && data.year === selectedYear
  );
  if (results.length != 0) {
    const resultsMap = results.map(item => {
      return {
        id: `${item.id}`,
        month: `${item.month}`,
        year: `${item.year}`,
        payday: `${item.payday}`,
        periodStart: `${item.periodStart}`,
        periodEnd: `${item.periodEnd}`,
        concept: `${item.concept}`,
        total: `${item.total}`,
        base: `${item.base}`,
        holiday: `${item.holiday}`,
        overtime: `${item.overtime}`,
        despensa: `${item.despensa}`,
        attendance: `${item.attendance}`,
        punctuality: `${item.punctuality}`,
      };
    });
    console.log(resultsMap);
    dataTable(resultsMap);
    buttonBack.classList.remove('hidden');
  }

  if (results.length == 0) {
    const message = 'No se encontraron resultados:(';
    const mytablebody = document.getElementById('tbody');
    mytablebody.innerHTML = message;
    buttonBack.classList.remove('hidden');
    previous.classList.add('hidden');
    next.classList.add('hidden');
  }

  select_month.value = 'Mes';
  select_year.value = 'Año';
});

////////////////////////////////////////////////////
const init = currentAccount => {
  // selects
  fillSelect('#selectMonth', month);
  fillSelect('#selectYear', year);
  // info tab
  fillInfo(currentAccount);
  state.totalPages = numPagesPerPage(currentAccount.payslip);
  // table
  dataTable(currentAccount.payslip?.slice(0, state.resultsPerPage));
};

///////////////////////////////////////////////////
// login
let currentAccount = '';

submitLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // validate username
  currentAccount = users.find(acc => acc.username === inputLoginUsername.value);

  console.log(currentAccount);
  if (currentAccount?.pass === inputLoginPin.value) {
    // remove hidden
    nav.classList.remove('hidden');
    bodyContent.classList.remove('hidden');
    bodyApp.classList.remove('hidden');
    footer.classList.remove('hidden');
    // clean message label
    errorMessage.innerHTML = ' ';
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    loginForm.classList.add('hidden');
    // Update UI
    init(currentAccount);
  } else {
    errorMessage.innerHTML =
      'La informacion ingresada no es correcta. Intente de nuevo';
  }
});

/////////////////////////////////

// exit
const exitApp = () => {
  currentAccount = '';
  // remove hidden
  nav.classList.add('hidden');
  bodyContent.classList.add('hidden');
  bodyApp.classList.add('hidden');
  footer.classList.add('hidden');
  // add login form
  loginForm.classList.remove('hidden');
};

logout.addEventListener('click', function () {
  exitApp();
});
