// Keys are question types as displayed in the app's frontend.
// Values are question types as encoded in the app's backend.
var question_types = {
    "Single Choice": "single_sel",
    "Choice": "single_sel",
    "Image": "image_sel",
    "Multiple Choice": "multi_sel",
    "Multiple": "multi_sel",
    "Text Entry": "text",
    "Text": "text"
  };
  
// Function to restructure results of Papaparse into specific JSON format.
// Returns Array of JSON objects.
export const convertToActivity = (file_json_array, actType) => {
    var dbs_json = [];
    for (var i=0; i<file_json_array.length; i++){
    var questionnaire_title = file_json_array[i]["Questionnaire"] === file_json_array[i]["Questionnaire Sort Name"] ? file_json_array[i]["Questionnaire"] : file_json_array[i]["Questionnaire Sort Name"] + " (" + file_json_array[i]["Questionnaire"] + ")";
    var responses = [];
    if (file_json_array[i]["Activity Type"] !== "Text"){
        responses = file_json_array[i]["Value Labels"].split("\n");
        if (responses.length < 2){
        responses = file_json_array[i]["Value Labels"].split(",");
        };
        var response_json = [];
        for (var j=0; j<responses.length; j++){
        var response_value = responses[j].split("=");
        response_json.push(
            {
            "text": response_value[1].trim(),
            "value": response_value[0].trim(),
            }
        )
        }
    };
    var question_title = file_json_array[i]["Question"].trim();
    var question_group_instruction = "";
    if (file_json_array[i]["Question Group Instruction"].trim().length > 0){
        question_group_instruction = file_json_array[i]["Question Group Instruction"].trim();
    };
    var existing_questionnaire = dbs_json.find(questionnaire_exists, questionnaire_title);
    if (existing_questionnaire) {
        existing_questionnaire.act_data.questions.push(questions_responses(responses.length, question_group_instruction, question_title, question_types, file_json_array[i], response_json));
    } else {
        dbs_json.push(
        {
            type: actType,
            title: questionnaire_title,
            act_data: {
                mode: "basic",
                frequency: "1",
                questions: [
                    questions_responses(responses.length, question_group_instruction, question_title, question_types, file_json_array[i], response_json),
                ],
            }
            
        }
        );
    };
    //if file_json_array[i]);
    };
    return(dbs_json);
}

  // Test for Array find to check for an existing questionnaire.
  // Returns Boolean.
  function questionnaire_exists (questionnaire_array) {
    return(this === questionnaire_array["title"]);
  }
  
  // Function to generate JSON for a question with responses iff responses are provided.
  /**
 * @function questions_responses - Function to generate JSON for a question with responses iff responses are provided.
 * @param {Boolean} test - Are responses provided?
 * @param {string} [question_group_instruction] - Repeated question instruction
 * @param {string} question_title - Individual question instruction
 * @param {Object} question_types - Object to translate from human-readable template keys to db-readable backend keys
 * @param {string} Object.keys[](question_types) - question type as displayed in the template
 * @param {string} Object.values[](question_types) - question type as encoded in the app's backend JSON.
 * @param {Object} file_json_array_i - Object from parsed Mindlogger template CSV
 * @param {string} (file_json_array_i["Question ID"]|file_json_array_i["Variable Name"]) - question ID or variable name for individual question
 * @param {string} (file_json_array_i["Response Type"]|file_json_array_i["Activity Type"]) - response type for individual question
 * @param {Object} response_json[] - Array of Objects containing response options and values for this individual question
 * @returns {Object} - Object containing one question, its instruction(s), response type and all of its response options
 */
  // Returns JSON object
  function questions_responses(test, question_group_instruction, question_title, question_types, file_json_array_i, response_json){
    var variable_name = file_json_array_i.hasOwnProperty("Question ID") ? file_json_array_i["Question ID"].trim() : file_json_array_i["Variable Name"].trim();
    var response_type = file_json_array_i.hasOwnProperty("Response Type") ? file_json_array_i["Response Type"].trim() : file_json_array_i["Activity Type"].trim();
    if (question_group_instruction.length){
        var question_individual = question_title;
        question_title = question_group_instruction + ": " + question_title;
        if(variable_name.length){
        return(
            test ? {
            "title": question_title,
            "group_instruction": question_group_instruction,
            "individual_instruction": question_individual,
            "type": question_types[response_type],
            "rows": response_json,
            "variable_name": variable_name,
            } : {
            "title": question_title,
            "group_instruction": question_group_instruction,
            "individual_instruction": question_individual,
            "type": question_types[response_type],
            "variable_name": variable_name,
            }
        )
        } else {
            return(
            test ? {
            "title": question_title,
            "group_instruction": question_group_instruction,
            "individual_instruction": question_individual,
            "type": question_types[response_type],
            "rows": response_json,
            } : {
            "title": question_title,
            "group_instruction": question_group_instruction,
            "individual_instruction": question_individual,
            "type": question_types[response_type],
            }
        );
        }
    } else {
        if(variable_name.length) {
        return(
            test ? {
            "title": question_title,
            "type": question_types[response_type],
            "rows": response_json,
            "variable_name": variable_name,
            } : {
            "title": question_title,
            "type": question_types[response_type],
            "variable_name": variable_name,
            }
        );
        } else {
        return(
            test ? {
            "title": question_title,
            "type": question_types[response_type],
            "rows": response_json,
            } : {
            "title": question_title,
            "type": question_types[response_type],
            }
        );
        }
    }
  }
  
  /* -- TO DO: Commented out function that is not necessary for now -- */
  // Function to create a list item link to download a created JSON object.
  // Returns HTML <li>
//   function json_link(object){
//     var li = document.createElement("li");
//     var link = document.createElement("a");
//     var text = document.createTextNode(object.title);
//     link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object, null, '  ')));
//     link.setAttribute("download", encodeURIComponent(object.title.replace(/ /g,'_')) + ".json");
//     link.appendChild(text);
//     li.appendChild(link);
//     return(li);
//   }
  
  // Function to parse CSV
  // Returns list of JSON objects
    

  // get file(s)