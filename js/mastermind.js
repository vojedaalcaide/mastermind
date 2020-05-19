const NUM_COLORS = 6;
const NUM_COMBINATION = 4;
const CORRECTNESS = {
  CORRECT_COLOR: 0,
  CORRECT_POSITION: 1
};

function Mastermind(options, callbacks) {

  var base = this;

  // default options (to be setted by constructor)
  defaultOptions = {
    // repeatColors: false
  };

  base.generatedCombination = [];

  // options validations
  if (!options) {
    console.error('No `options` received as parameter');
  } else {}

  // set configuration from
  this.config = Object.assign({}, defaultOptions, options);

  this.init = function () {
    this.createCombination();
  }

  this.createCombination = function() {
    let remainingColors = []; // remaining colors allowed to use
    const generatedCombination = []; // generated random color combination

    for (let i = 0; i < NUM_COLORS; i ++) {
      remainingColors.push(i);
    }

    while (generatedCombination.length < NUM_COMBINATION) {
      const randomNum = Math.floor(Math.random() * remainingColors.length);
      const randomColor = remainingColors[randomNum];
      generatedCombination.push(randomColor);

      remainingColors = _.without(remainingColors, randomColor);
    }

    base.generatedCombination = generatedCombination;
  }

  /**
   * Check if the provided combination is correct returning an array
   * indicating the correctness of provided combination.
   * Also returns if player has won the game.
   * Example:
   * {
   *   result: [1, 0, 0],
   *   win: false
   * }
   */
  this.checkCombination = function (combination) {
    let result = [];
    if (Array.isArray(combination) && combination.length === 4) {
      // check position 1
      if (combination[0] === base.generatedCombination[0]) {
        result.push(CORRECTNESS.CORRECT_POSITION);
      } else if (base.generatedCombination.indexOf(combination[0]) !== -1) {
        result.push(CORRECTNESS.CORRECT_COLOR);
      }

      // check position 2
      if (combination[1] === base.generatedCombination[1]) {
        result.push(CORRECTNESS.CORRECT_POSITION);
      } else if (base.generatedCombination.indexOf(combination[1]) !== -1) {
        result.push(CORRECTNESS.CORRECT_COLOR);
      }

      // check position 3
      if (combination[2] === base.generatedCombination[2]) {
        result.push(CORRECTNESS.CORRECT_POSITION);
      } else if (base.generatedCombination.indexOf(combination[2]) !== -1) {
        result.push(CORRECTNESS.CORRECT_COLOR);
      }

      // check position 4
      if (combination[3] === base.generatedCombination[3]) {
        result.push(CORRECTNESS.CORRECT_POSITION);
      } else if (base.generatedCombination.indexOf(combination[3]) !== -1) {
        result.push(CORRECTNESS.CORRECT_COLOR);
      }
    } else {
      throw new Error(`ERROR: 'combination' argument is not a valid color combination`);
    }

    return {
      result: _.sortBy(result, (v) => -v),
      win: _.sum(result) === 4 // check if combination is correct
    };
  }

  this.getConfig = function() {
    return JSON.parse(JSON.stringify(base.config));
  }

  // initialize logic
  this.init();

  // visible properties from outside
  return {
    getConfig: base.getConfig,
    checkCombination: base.checkCombination
  };
}