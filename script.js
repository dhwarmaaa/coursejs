const mybody = document.getElementsByTagName('body')[0];
/// login
const inputLoginUsername = document.getElementById('user');
const inputLoginPin = document.getElementById('pswd');
const submit = document.getElementById('submit');
const prueba = document.getElementById('prueba');
const salida = document.getElementById('salida');
const nav = document.getElementById('navBar');
const bodyApp = document.getElementById('main');
const modalLogin = document.getElementById('login');
const exit = document.getElementById('exit');
const over = document.getElementById('overlay');
// buttons
const next = document.getElementById('next');
const previous = document.getElementById('previous');
// select
const select_month = document.getElementById('selectMonth');
const select_year = document.getElementById('selectYear');
const button_search = document.getElementById('buttonSearch');
// pagination
const pagination = document.getElementById('pagination');

// select values
// prettier ignore
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

const state = {
  page: 1,
  resultsPerPage: 3,
  totalPages: 0,
};

// lectura del JSON
const response = await fetch('data.json');
const response_format = await response.json();
const data = JSON.stringify(response_format);
const users = JSON.parse(data);

const getSearchResultsPage = function (page = state.page, data) {
  state.page = page;

  const start = (page - 1) * state.resultsPerPage; // 0
  const end = page * state.resultsPerPage; // 9
  console.log(data.slice(start, end));
  dataTable(currentAccount.payslip.slice(start, end));
  // return state.search.results.slice(start, end);
};

const dataTable = function (data) {
  console.log(data?.length);
  // para la primera pagina
  if (state.page <= 0 || state.page === 1) {
    previous.style.visibility = 'hidden';
  }
  // para la ultima
  if (state.page === state.totalPages) {
    next.style.visibility = 'hidden';
  }

  // creates <table> and <tbody> elements
  const mytable = document.querySelector('u-table-entity');
  const mytablebody = document.getElementById('tbody');

  // creating all cells
  const body = data
    ?.map((item, i) => {
      return `<tr style="height: 45px" onClick=${console.log(
        'funciono: ' + i
      )}> 
    <td class="u-table-cell">${item.month}</td>
    <td class="u-table-cell">${item.payday}</td>
    <td class="u-table-cell">${item.periodEnd}</td>
    <td class="u-table-cell">${item.concept}</td>
    <td class="u-table-cell">$ ${
      item.total
    } <button class="botonModal">Ver detalle</button></td>
    </tr>`;
    })
    .join('');
  mytablebody.innerHTML = body;
};

/* para el boton de ver a detalle*/
const on = (element, event, selector, handler) => {
  element.addEventListener(event, e => {
    // target implementa una delegacion del evento
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

on(document, 'click', '.botonModal', e => {
  const fila = e.target.parentNode;
  const id = fila.firstElementChild;
  console.log(id);
  const modal = document.querySelector('.modalData');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.close-modal');
  /* LLENADO DE LA NOMINA DEL MODAL */
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
  const totalDeducciones = document.getElementById('total_deducciones');
  const deducciones = [
    +ISR(currentAccount.payslip[0].base),
    +IMSS(currentAccount.payslip[0].base),
    +INFONAVIT(currentAccount.payslip[0].base),
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

  const extra = hours => {
    return (hours * 60).toFixed(2);
  };
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
  period.innerHTML = `${currentAccount.payslip[0].periodStart} al ${currentAccount.payslip[0].periodEnd}`;
  // percepciones
  base.innerHTML = `$ ${currentAccount.payslip[0].base.toFixed(2)}`;
  holiday.innerHTML = `$ ${currentAccount.payslip[0].holiday.toFixed(2)}`;
  overtime.innerHTML = `$ ${extra(currentAccount.payslip[0].overtime)}`;
  despensa.innerHTML = `$ ${currentAccount.payslip[0].despensa.toFixed(2)}`;
  punctuality.innerHTML = `$ ${currentAccount.payslip[0].punctuality.toFixed(
    2
  )}`;
  attendance.innerHTML = `$ ${currentAccount.payslip[0].attendance.toFixed(2)}`;
  // deducciones
  imss.innerHTML = `$ ${deducciones[1]}`;
  isr.innerHTML = `$ ${deducciones[0]}`;
  infonavit.innerHTML = `$ ${deducciones[2]}`;
  // totales

  modal.classList.remove('hidden');
  // overlay.classList.remove('hidden');
  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnCloseModal.addEventListener('click', closeModal);
  //overlay.addEventListener('click', closeModal);
  // openModal();
});

const fillSelect = function (selectId, data) {
  const select = document.querySelector(selectId);
  data.forEach(element => {
    const option = document.createElement('option');
    option.text = element;
    option.value = element;
    select.appendChild(option);
  });
};

const fillData = function (id, data) {
  const component = document.getElementById(id);
  component.innerHTML = '';
  component.innerHTML = data;
};

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

button_search.addEventListener('click', function () {
  // validar que haya un mes
  const selectedMonth =
    select_month.value !== 'Item 1' ? select_month.value : 'error';

  // validar que haya un año
  const selectedYear =
    select_year.value !== 'Item 1' ? select_year.value : 'error';

  // mensaje de error

  // filtrado de datos
  const results = currentAccount.payslip.filter(
    data => data.month === selectedMonth && data.year === selectedYear
  );
  const resultsMap = results.map(item => {
    return {
      month: `${item.month}`,
      year: `${item.year}`,
      payday: `${item.payday}`,
      periodEnd: `${item.periodEnd}`,
      concept: `${item.concept}`,
      total: `${item.total}`,
    };
  });

  dataTable(resultsMap);
  alert(`tam: ${results.length} resultado: ${resultsMap} `);
});

// inicialización de componentes
const init = currentAccount => {
  // select
  fillSelect('#selectMonth', month);
  fillSelect('#selectYear', year);

  // bienvenida
  fillData('welcomeMessage', `Bienvenido ${currentAccount.name}`);
  // datos
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
  const day1 = new Date(currentAccount.startDate);
  const date = new Date();
  const day2 = new Date(date.toISOString().split('T')[0]);

  const difference = Math.abs(date - day1);
  const days = difference / (1000 * 3600 * 24);
  fillData('old', `${difference} años`); // fecha actual - fecha de ingreso

  /// tabla
  const numPages =
    currentAccount.payslip?.length === undefined
      ? 0
      : Math.ceil(currentAccount.payslip.length / state.resultsPerPage);

  state.totalPages = numPages;

  // llenado de la tabla
  dataTable(currentAccount.payslip?.slice(0, state.resultsPerPage));
  if (state.page === 1) {
    previous.style.visibility = 'hidden';
  }
};

/////////////////////////////////////////
// Login

let currentAccount = '';
//init();

submit.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = users.find(acc => acc.username === inputLoginUsername.value);

  console.log(currentAccount);
  if (currentAccount?.pass === inputLoginPin.value) {
    // quitar la opacidad al cuerpo y al head
    nav.style.opacity = 100;
    bodyApp.style.opacity = 100;
    prueba.innerHTML = ' ';
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    modalLogin.classList.add('hidden');
    over.classList.add('hidden');
    // Update UI
    init(currentAccount);
  } else {
    prueba.innerHTML =
      'La informacion ingresada no es correcta. Intente de nuevo';
  }
});

/////////////////////////////////

// exit
const exitApp = () => {
  currentAccount = '';
  nav.style.opacity = 0;
  bodyApp.style.opacity = 0;
  modalLogin.classList.remove('hidden');
};

const logout = document.getElementById('exit');
logout.addEventListener('click', function () {
  alertify.confirm(
    '¿Ya te vas? ¿Estas seguro que deseas salir?',
    function () {
      exitApp();
    },
    function () {}
  );
});

/// modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/* on asigna eventos a los elementos del dom*/
