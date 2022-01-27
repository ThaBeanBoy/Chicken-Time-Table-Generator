// Sections
const CalenderSection = document.querySelector('.calendar');

// Action buttons (For batch details)
const clearFormBtn = document.querySelector('#clearForm');
const generateBtn = document.querySelector('#generate');

// Input fields
const batchName = document.querySelector('#batchName');
const numOfChicks = document.querySelector('#numOfChicks');
const dateArrival = document.querySelector('#dateArrival');

// Action buttons (Printing tings)
const monthsTab = document.querySelector('.months');
const finalActions = document.querySelector('.finalActions');
const printButton = document.querySelector('#printCalendars');
const closeCalendarSection = document.querySelector('#closeCalendar');

onload = () => {
  dateArrival.valueAsDate = new Date();
};

// Setting up swiper
let swiper;

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
      getReq('./timeTable.json', generateCalendar, () => {
        console.log('Could not process request');
      });
    }
    return;
  } else {
    getReq('./timeTable.json', generateCalendar, () => {
      console.log('Could not process request');
    });
  }
});

closeCalendarSection.onclick = () => {
  CalenderSection.style.top = '-50%';
  // Destroy the swiper object
  swiper.destroy();
  // Delete all the tables after css transition is done
  setTimeout(() => {
    document.querySelector('.tables').innerHTML = '';
  }, 500);

  showingCalendars = false;
};

const numToMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MonthPoints = (D, first) => {
  // first 1 returns the first of month whilst the other returns the last
  return first
    ? new Date(D.getFullYear(), D.getMonth(), 1)
    : new Date(D.getFullYear(), D.getMonth() + 1, 0);
};

const generateCalendar = (timeTable) => {
  showingCalendars = true;

  const SixWeeksInMillis = 3628800000;
  const ZeroWeekMark = new Date(dateArrival.valueAsNumber);
  const SixWeekMark = new Date(dateArrival.valueAsNumber + SixWeeksInMillis);

  console.log(ZeroWeekMark);
  console.log(SixWeekMark);

  // Figuring the number of months to generate
  let CalendarMonthsToGenerate =
    (SixWeekMark.getFullYear() - ZeroWeekMark.getFullYear()) * 12;
  CalendarMonthsToGenerate -= ZeroWeekMark.getMonth();
  CalendarMonthsToGenerate += SixWeekMark.getMonth();
  CalendarMonthsToGenerate =
    CalendarMonthsToGenerate <= 0 ? 0 : CalendarMonthsToGenerate;
  CalendarMonthsToGenerate++;

  // Saving the months in an array
  console.log(`generating ${CalendarMonthsToGenerate} months`);
  let months = [];
  for (let i = 0; i < CalendarMonthsToGenerate; i++) {
    if (ZeroWeekMark.getMonth() + i >= 12) {
      months.push(new Date(ZeroWeekMark.getFullYear() + 1, 0, 1));
    } else {
      months.push(
        new Date(ZeroWeekMark.getFullYear(), ZeroWeekMark.getMonth() + i, 1)
      );
    }
  }
  console.log('months', months);

  // Making the tables for the months
  const cell = (td, innerHTML) => {
    if (td) {
      const td = document.createElement('td');
      td.innerHTML = innerHTML;
      return td;
    }

    const th = document.createElement('th');
    th.innerHTML = innerHTML;
    return th;
  };

  let timeTableDay = 0;

  months.forEach((month, monthNum) => {
    // Making the table
    const table = document.createElement('table');
    table.classList.add('swiper-slide');

    // Attaching table head
    const trTh = document.createElement('tr');
    days.forEach((day) => {
      trTh.append(cell(false, day));
    });
    table.append(trTh);

    // Calculating how many rows to make
    const daysInNum = [0, 1, 2, 3, 4, 5, 6].reverse();
    const empties = 6 - daysInNum.indexOf(MonthPoints(month, true).getDay());
    const numOfRows = Math.ceil(
      (MonthPoints(month, false).getDate() + empties) / 7
    );

    // Making the rows
    let date = 1;
    for (let i = 0; i < numOfRows; i++) {
      const firstRow = i === 0;
      // const lastRow = i === numOfRows - 1;

      // Making row
      const tr = document.createElement('tr');
      for (let i = 0; i < 7; i++) {
        // Shows time table details if the day is within the range from zero to six week mark
        const dispTimeTableDetails =
          (monthNum !== 0 || date >= ZeroWeekMark.getDate()) &&
          (monthNum !== months.length - 1 || date < SixWeekMark.getDate()) &&
          (!firstRow || i >= MonthPoints(month, true).getDay()) &&
          date <= MonthPoints(month, false).getDate();

        const box = cell(true, '');
        dispTimeTableDetails ? {} : box.classList.add('inactive');

        const details = `<span class='date'>${date}</span> <br/> ${
          dispTimeTableDetails
            ? // ? `details of day: ${timeTable[timeTableDay].Day}`
              `
              <span class='detail'>Day:</span> ${
                timeTable[timeTableDay].Day
              } <br/> <br/>
              <span class='detail'>Water:</span> <br/> ${timeTable[
                timeTableDay
              ].Water.toString()} <br/> <br/>
              <span class='detail'>Feed:</span>${
                timeTable[timeTableDay].Feeds
              } <br/> <br/>
              <span class='detail'>Temperature:</span><br/>${
                timeTable[timeTableDay].Temperature
              }
              `
            : ''
        } `;
        dispTimeTableDetails ? (timeTableDay += 1) : {};
        // dispTimeTableDetails ? console.log(timeTableDay) : {};

        if (firstRow) {
          let numberingAllowed = false;
          numberingAllowed = i >= MonthPoints(month, true).getDay();
          box.innerHTML = numberingAllowed ? details : '';
          tr.append(box);
          numberingAllowed ? date++ : {};
        } else {
          box.innerHTML =
            date <= MonthPoints(month, false).getDate() ? details : '';
          tr.append(box);
          date++;
        }
      }

      // Attaching the row to the table
      table.append(tr);
    }

    // Attaching the table to UI
    document.querySelector('.tables').append(table);
  });

  // Displaying the months in the months tab
  monthsTab.innerHTML = '';

  const span1 = document.createElement('span');
  span1.innerHTML = numToMonth[ZeroWeekMark.getMonth()];
  monthsTab.appendChild(span1);

  if (CalendarMonthsToGenerate >= 3) {
    const span2 = document.createElement('span');
    span2.innerHTML = numToMonth[ZeroWeekMark.getMonth() + 1];
    monthsTab.appendChild(span2);
  }

  const span3 = document.createElement('span');
  span3.innerHTML = numToMonth[SixWeekMark.getMonth()];
  monthsTab.appendChild(span3);

  // Displaying batch name
  document.querySelector(
    '.BatchName'
  ).innerHTML = `(${ZeroWeekMark.getDate()} ,${
    numToMonth[ZeroWeekMark.getMonth()]
  }) ${batchName.value}, units: ${numOfChicks.value}`;

  // Initialising swiper
  swiper = new Swiper('.allTables', {
    // effect: 'coverflow',
    on: {
      init: () => {
        // highlight first element in the months tab
        monthsTab.firstElementChild.classList.add('active');
        // set event listeners for the months tab thingies
        monthsTab.childNodes.forEach(
          (el, indx) =>
            (el.onclick = () => {
              swiper.slideTo(indx);
            })
        );
      },
      slideChange: () => {
        // get the current index
        const swiperIndex = swiper.activeIndex;

        // highlight the current index on the months tab
        monthsTab.childNodes.forEach((el, indx) => {
          indx === swiperIndex
            ? el.classList.add('active')
            : el.classList.remove('active');
        });
      },
    },
  });

  // Setting up the print button
  printButton.onclick = print;

  // Showing the calenders
  CalenderSection.style.top = '50%';

  console.log(timeTable);
};

let visible = true;
let showingCalendars = false;
document.addEventListener('keydown', (ev) => {
  // console.log(ev.keyCode);
  // pressed 'E' on keyboard
  // Displays the final actions buttons
  switch (ev.keyCode) {
    case 69:
      if (showingCalendars) {
        if (visible) {
          finalActions.style.display = 'none';
          visible = false;
        } else {
          finalActions.style.display = '';
          visible = true;
        }
      }
      break;

    // pressed 'P' on keyboard
    // execute print of the displayed timetable
    case 80:
      showingCalendars ? print() : {};
      break;
  }
});

const print = () => {
  // Lesson from Adam Khoury
  // https://youtu.be/UJAwNkhbYWM
  const restorePage = document.body.innerHTML;
  const contentToPrint = document.querySelector('.calendar').outerHTML;

  // console.log(
  //   document.querySelector('.tables').childNodes[swiper.activeIndex].outerHTML
  // );
  document.body.innerHTML = contentToPrint;
  window.print();
  // document.body.innerHTML = restorePage;
};
