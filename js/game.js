// Constants

// Elements ID
const ID_USER_ENTRIES = 'userEntries';
const ID_COLOR_PICKER = 'colorPicker';
const ID_EMPTY_ENTRY = 'emptyEntry';
const ID_EMPTY_LABEL = 'emptyLabel';
const ID_RESET_BUTTON = 'resetButton';
const ID_CHECK_BUTTON = 'checkButton';
const ID_WIN_CONTAINER = 'winContainer';

// CSS classes
const CLASS_COLOR_EMPTY = 'color-empty';
const CLASS_PICKER_DISABLED = 'disabled';
const CLASS_ENTRY_INVISIBLE = 'invisible';

// LocalStorage keys

var mastermind = null; // instance of Mastermind

var listEntries = []; // player entries. Each entry has 2 arrays. Combination and result

var emptyTryCodes = []; // array of up to 4 numbers (code colors)

// flag to know when the game has finished and user has won
var win = false;


// main execution when document loads
$(document).ready(function () {
  resetGame();
});


function resetGame() {
  mastermind = null;
  mastermind = new Mastermind(
    // configuration
    {},
    // callbacks
    {}
  );
  win = false;

  resetUI();
}

function resetUI() {
  resetEntries();
  setColorPickerListeners();
}

function resetEntries() {
  const $userEntries = $('#' + ID_USER_ENTRIES).empty();
  refreshEmptyTry(true);
  $('#' + ID_EMPTY_ENTRY).removeClass(CLASS_ENTRY_INVISIBLE); // show empty entry
  $('#' + ID_WIN_CONTAINER).addClass(CLASS_ENTRY_INVISIBLE); // display none win container
}

function addNewUserEntry(checkResults) {
  listEntries.push({
    combination: emptyTryCodes,
    result: checkResults.result
  });

  const html = `<div class="entry">
    <div class="label">Try #${listEntries.length}</div>
    <div class="color-combination">
      <div class="color-token color-${emptyTryCodes[0]}"></div>
      <div class="color-token color-${emptyTryCodes[1]}"></div>
      <div class="color-token color-${emptyTryCodes[2]}"></div>
      <div class="color-token color-${emptyTryCodes[3]}"></div>
    </div>
    <div id="combinationResult-${listEntries.length}" class="combination-result"></div>
  </div>`;

  const $userEntries = $('#' + ID_USER_ENTRIES);
  $userEntries.append(html);

  // add result 
  const $userEntryResult = $('#combinationResult-' + (listEntries.length), $userEntries);
  for (let i = 0; i < checkResults.result.length; i++) {
    $userEntryResult.append(`<div class="color-token color-token-result color-result-${checkResults.result[i]}"></div>`);
  }

  if (checkResults.win) {
    // GAME WIN
    onGameWin();
  } else {
    refreshEmptyTry(true);
  }
}

function refreshEmptyTry(reset) { // 'reset' is a boolean indicating if data must be reset
  const $emptyEntry = $('#' + ID_EMPTY_ENTRY);
  if (reset === true) {
    emptyTryCodes = [];
    emptyTryResult = [];

    $('#' + ID_EMPTY_LABEL)[0].innerText = 'Try #' + (listEntries.length + 1);
  }

  refreshColorPicker(); // refresh enabled/disabled color pickers
  
  // color combination
  $('[id^="emptyTryColor-"]', $emptyEntry).removeClass(['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5']);
  $('[id^="emptyTryColor-"]', $emptyEntry).addClass(CLASS_COLOR_EMPTY);
  for (let i = 0; i < emptyTryCodes.length; i++) {
    $('#emptyTryColor-' + i).removeClass(CLASS_COLOR_EMPTY);
    $('#emptyTryColor-' + i).addClass('color-' + emptyTryCodes[i]);
  }
}

function refreshColorPicker() {
  // refresh the disability of each color
  for (let i = 0; i < NUM_COLORS; i++) {
    const $color = $('#colorPicker-' + i);
    $color.removeClass(CLASS_PICKER_DISABLED);
    if (emptyTryCodes.indexOf(i) !== -1) {
      $color.addClass(CLASS_PICKER_DISABLED);
    }
  }
}

function setColorPickerListeners() {
  const $colorPicker = $('#' + ID_COLOR_PICKER);

  // colors
  $('[id^="colorPicker-"]', $colorPicker).on('click', onColorPickerColor);

  // clear button
  $('#' + ID_RESET_BUTTON, $colorPicker).on('click', () => {
    emptyTryCodes = [];
    refreshEmptyTry();
  });

  // check button
  $('#' + ID_CHECK_BUTTON, $colorPicker).on('click', () => {
    if (emptyTryCodes.length === 4 && win === false) {
      const checkResults = mastermind.checkCombination(emptyTryCodes); // { result: [], win: boolean }
      addNewUserEntry(checkResults);
    }
  });
}

function onColorPickerColor(ev) {
  if (!ev) {
    return ;
  }
  if (ev.target.classList.contains(CLASS_PICKER_DISABLED) || win === true) {
    // color is disabled or game is already won
    return ;
  }
  const colorCode = ev.target.id.split('colorPicker-')[1];
  if (emptyTryCodes.length < 4) {
    emptyTryCodes.push(Number(colorCode));
    refreshEmptyTry();
  }
}

function waitTime(ms) { // milliseconds to wait
  return new Promise(res => _.delay(res, ms));
}

// callback called when user wins the game
function onGameWin() {
  win = true;
  // hide empty entry
  $('#' + ID_EMPTY_ENTRY).addClass(CLASS_ENTRY_INVISIBLE);
  $('#' + ID_WIN_CONTAINER).removeClass(CLASS_ENTRY_INVISIBLE);
}
