/**
 * Function to look up score label
 * @param {(Number|string)} score_value - value from scoring function
 * @param {Object} score_key_i - score key definitions with score-range or single-score keys and label values
 * @param {function(string)} score_label - a callback to run whose signature is a string, zero or more labels based on scores
 */
function score_label_lookup(score_value, score_key_i){
  label_for_score = ""
  for (var label_range in score_key_i.values){
    if (label_range.includes("-")){
      var l_range = label_range.split("-");
      if (score_value >= Number(l_range[0]) && score_value <= Number(l_range[1])){
        if (label_for_score.length){
          label_for_score += (", " + score_key_i.values[label_range]);
        } else {
          label_for_score = score_key_i.values[label_range];
        }
      }
    } else {
      if(score_value == label_range){
        if (label_for_score.length){
          label_for_score += (", " + score_key_i.values[label_range]);
        } else {
          label_for_score = score_key_i.values[label_range];
        }
      }
    }
  }
  return label_for_score;
}

function getScore(question, answer) {
  switch(question.type) {
    case 'single_sel':
      return question.rows[answer].value;
    case 'image_sel':
    return question.images[answer].value;
  }
}
/**
 * Function to calculate scores
 * @param {Object} score_key - Mindlogger-formatted score key JSON object
 * @param {Object} answers - Mindlogger-formatted activity response
 * @param {function(Object[])} score_results - a callback to run whose signature is an array of Objects with "value" and "label" keys
 * @param {(Number|string)} score_results[].value - score calculated from answers by method defined in score_key
 * @param {string} score_results[].label - label(s) for score as defined in score_key
 */
function calculateScore(data, answers, score_results){
  let i = 0;
  var allScores=[];
  data.scores.forEach(config => {
    let config = score_key.scores[score_i];
    let scores = [];
    data.questions.forEach((question, index) => {
      if (answers[index] && answers[index].result) {
        scores.push(getScore(question, answers[index]));
      } else {
        scores.push(0);
      }
    });
    let score = 0;
    let score_label;
    if(config.type) {
      switch(config.type) {
        case 'sum':
          score = calcSum(scores);
          score_label = score_label_lookup(score, config);
          break;
      }
    } else {
      eval(config.formula);
      score = eval(config.short_label)(scores);
      score_label = score_label_lookup(score_value, config)
    }
    allScores.push({value: score, label: score_label});
  });
}

function calcSum(scores) {
  let sum = 0;
  scores.forEach(score => {
    sum = sum + score;
  })
  return sum;
}

export default {calculateScore}