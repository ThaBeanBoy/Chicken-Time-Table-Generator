// Sections
const CalenderSection = document.querySelector('.calendar');

// Action buttons (For batch details)
const clearFormBtn = document.querySelector('#clearForm');
const generateBtn = document.querySelector('#generate');

// Action buttons (Printing tings)
const printButton = document.querySelector('#printCalendars');
const closeCalendarSection = document.querySelector('#closeCalendar');

// Input fields
const batchName = document.querySelector('#batchName');
const numOfChicks = document.querySelector('#numOfChicks');
const dateArrival = document.querySelector('#dateArrival');

onload = () => {
  dateArrival.valueAsDate = new Date();
};

// Setting up swiper
const swiper = new Swiper('.allTables', {});

clearFormBtn.addEventListener('click', () => {
  batchName.value = '';
  numOfChicks.value = '';
  dateArrival.value = '';
});

generateBtn.addEventListener('click', () => {
  //# authenticating the fields
  // Checking for empty string
  if (batchName.value === '' || numOfChicks.value === '') {
    alert('You did not input a batch name or the number of chicks');
    return;
  }
  // Checking if number was inputed
  if (isNaN(parseInt(numOfChicks.value))) {
    alert('Please input a proper name');
    return;
  }
  //   Checking if the number inputed is strange/ has weird characters
  if (
    numOfChicks.value.length !== parseInt(numOfChicks.value).toString().length
  ) {
    const confirmationMsg = `The number of chicks will be ${parseInt(
      numOfChicks.value
    )}`;
    const continueWithNumber = confirm(confirmationMsg);
    if (continueWithNumber) {
      generateCalendar();
    }
    return;
  } else {
    generateCalendar();
  }
});

closeCalendarSection.addEventListener('click', () => {});

closeCalendarSection.addEventListener('click', () => {
  CalenderSection.style.top = '-50%';
});

// const generateMonthCal = () => {
// };

const numToMonth = (num) => {
  switch (num) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    default:
      return 'Dec';
  }
};

const MonthPoints = (D, first) => {
  // first 1 returns the first of month whilst the other returns the last
  return first
    ? new Date(D.getFullYear(), D.getMonth(), 1)
    : new Date(D.getFullYear(), D.getMonth() + 1, 0);
};

const generateCalendar = () => {
  const SixWeeksInMillis = 3628800000;
  const ZeroWeekMark = new Date(dateArrival.valueAsNumber);
  const SixWeekMark = new Date(dateArrival.valueAsNumber + SixWeeksInMillis);

  console.log('0 Week Mark', ZeroWeekMark);
  // console.log('6 Week Mark', SixWeekMark);
  // console.log('0 Week Mark', ZeroWeekMark.getMonth());
  // console.log('6 Week Mark', SixWeekMark.getMonth());

  let CalendarMonthsToGenerate =
    (SixWeekMark.getFullYear() - ZeroWeekMark.getFullYear()) * 12;
  CalendarMonthsToGenerate -= ZeroWeekMark.getMonth();
  CalendarMonthsToGenerate += SixWeekMark.getMonth();
  CalendarMonthsToGenerate =
    CalendarMonthsToGenerate <= 0 ? 0 : CalendarMonthsToGenerate;
  console.log(`generating ${CalendarMonthsToGenerate} months`);
  // let months = [];
  // for (let i = 0; i < CalendarMonthsToGenerate; i++) {
  //   const monthOn13 = SixWeekMark.getMonth + i >= 12;
  //   console.log(monthOn13 ? 'next year' : 'same year');
  //   months.push(
  //     monthOn13
  //       ? new Date(ZeroWeekMark.getFullYear() + 1, 0, 1)
  //       : new Date(ZeroWeekMark.getFullYear(), ZeroWeekMark.getMonth() + i, 1)
  //   );
  // }
  // console.log('all months', months);

  // Making the tables for the months

  const cell = (td) => {
    if (td) {
      return document.createElement('td');
    }
    return document.createElement('th');
  };

  for (let i = 0; i < CalendarMonthsToGenerate; i++) {
    const firstMonth = i === 0;
    const lastMonth = i === CalendarMonthsToGenerate - 1;

    // Making the table
    const table = document.createElement('table');

    // Calculating how many rows to make
    console.log();

    // making the rows
    // console.log(zeroWeekMark);

    //<> Attaching the table to UI
  }

  // Displaying the months in the months tab
  const monthsTab = document.querySelector('.months');

  monthsTab.innerHTML = '';

  const span1 = document.createElement('span');
  span1.classList.add('active');
  span1.innerHTML = numToMonth(ZeroWeekMark.getMonth());
  monthsTab.appendChild(span1);

  if (CalendarMonthsToGenerate >= 3) {
    const span2 = document.createElement('span');
    span2.innerHTML = numToMonth(ZeroWeekMark.getMonth() + 1);
    monthsTab.appendChild(span2);
  }

  const span3 = document.createElement('span');
  span3.innerHTML = numToMonth(SixWeekMark.getMonth());
  monthsTab.appendChild(span3);

  // Displaying batch name
  document.querySelector(
    '.BatchName'
  ).innerHTML = `${batchName.value}, units: ${numOfChicks.value}`;

  // Showing the calenders
  CalenderSection.style.top = '50%';
};
