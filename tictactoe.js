//Version with enhanced minimax AI.

$(document).ready(function() {
  var field, lines_arr, next, turn, choice, free;
  //makes x default player.
  var player = "x";
  //tracks whether player made a choice.
  var choice_buttons = false;
  //tracks whether game_over message was shown
  var game_over_shown = false;
  //stores state of game
  var memory = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [7, 0],
  [8, 0],
  ];

  //function that updates buttons based on memory
  function UpdateButtons() {
    var p = 0;
    while (p < 9) {
      var button_num = p + 1;
      var button_str = "button" + button_num;
      if (memory[p][1] === 1) {
        document.getElementById(button_str).innerHTML = "x";
      } else if (memory[p][1] === 5) {
        document.getElementById(button_str).innerHTML = "o";
      }
      p++;
    }
  };

  //updates memory based on field on board and agent (player) and returns memory.
  function UpdateMemory_field(field, agent) {
    var player_num = (agent === "x") ? 1 : 5;
    memory.splice(field, 1, [field, player_num]);
    return memory;
  }

  //Updates memory based on state.
  function UpdateMemory_state(state) {
    memory = state;
  }

  //returns true if value for a field is 0;
  function IsZero(elem) {
    return elem[1] === 0;
  }

  /*returns the values of each of the 8 possible winning lines given a state.
  A field with "x" has value 1, a field with "o" value 5, and an empty field value 0"*/

  function LineValues(state) {
    return [
    (state[0][1] + state[1][1] + state[2][1]),
    (state[3][1] + state[4][1] + state[5][1]),
    (state[6][1] + state[7][1] + state[8][1]),
    (state[0][1] + state[3][1] + state[6][1]),
    (state[1][1] + state[4][1] + state[7][1]),
    (state[2][1] + state[5][1] + state[8][1]),
    (state[0][1] + state[4][1] + state[8][1]),
    (state[2][1] + state[4][1] + state[6][1]),
    ];
  } //end LineValues(state)

  /*Check2Fields(state):
  - returns [x,i] if player x has 2 fields in a line occupied (i is the line)
  - returns [o,i] if player o has 2 fields in a line occupied (i is the line)
  */
  function Check2Fields(state) {
    var line_values = LineValues(state);
    for (var i = 0; i < 8; i++) {
      if (line_values[i] === 2 && turn === "x") {
        return ["x", i];
      } else if (line_values[i] === 10 && turn === "o") {
        return ["o", i];
      } else if (line_values[i] === 2 && turn === "o") {
        return ["x", i];
      } else if (line_values[i] === 10 && turn === "x") {
        return ["o", i];
      }
    }
    return [undefined, undefined];
  } //end Check2Fields(state)

  /* Check2Fields(state)
     - Returns 10 if x has won
     - Returns -10 if o has won
     - Returns 0 if there is a tie
     - Returns undefined if game isn't over'*/
     function CheckStatus(state) {
      var full = (state.some(IsZero) === true) ? false : true;
      var line_values = LineValues(state);
      for (var s = 0; s < 8; s++) {
        if (line_values[s] === 3) {
          return 10;
        } else if (line_values[s] === 15) {
          return -10;
        }
      }
      if (full === true) {
        return 0;
      } else {
        return undefined;
      }
  } //end CheckStatus

  //Options(state): function that gives you an array of the possible states given a state//
  function Options(state) {
    var poss_options_arr = [];
    for (var j = 0; j < 9; j++) {
      if (state[j][1] === 0) {
        var copy_poss_options_arr = [...state];
        if (turn === "x") {
          copy_poss_options_arr.splice(j, 1, [j, 1])
        } else {
          copy_poss_options_arr.splice(j, 1, [j, 5])
        }
        poss_options_arr.push(copy_poss_options_arr);
      }
    }
    if (poss_options_arr === []) {
      return state;
    } else {
      return poss_options_arr;
    }
  } //end Options(state)

  //returns true if game is over  
  function Game_over(state) {
    return (CheckStatus(state) !== undefined);
  }

  //triggers game_over message
  function Game_over_react() {
    if (CheckStatus(memory) === 10) {
      document.getElementById("game_over1").innerHTML = "x won.";
    } else if (CheckStatus(memory) === -10) {
      document.getElementById("game_over1").innerHTML = "o won.";
    } else {
      document.getElementById("game_over1").innerHTML = "It's a draw.";
    }
    $("#game_over2").click(function() {
      document.location.href = document.location.href;
    });
    $("#game_over").slideToggle("slow", false);
  } //end Game_over_react

  //returns random element from array  
  function Random_from_Array(arr) {
    var random = Math.random();
    var interval = 1 / arr.length;
    var interval_nth = random / interval;
    return arr[Math.floor(interval_nth)];
  }

  //Returns the number of empty fields on board    
  function NumEmpty(state) {
    var num_empty = 0;
    for (var m = 0; m < 9; m++) {
      if (state[m][1] === 0) {
        num_empty++;
      }
    }
    return num_empty;
  }

  /* minimax algorithm. The computer goes through all possible moves and choses the one with the best outcome.
  Modeled after the pseudocode for the minimax algorithm here: http://neverstopbuilding.com/minimax 
  */
  function minimax(state) {
    turn = (turn === "x") ? "o" : "x";
    if (Game_over(state) === true) {
      return CheckStatus(state);
    }
    var scores = [];
    var moves = [];
    var poss_options_arr, max, min;
    poss_options_arr = Options(state);
    poss_options_arr.forEach(function(elem) {
      scores.push(minimax(elem));
      moves.push(elem);
    })
    if (turn === "x") {
      max = Math.max(...scores);
      choice = moves[scores.indexOf(max)];
      return max;
    } else {
      min = Math.min(...scores);
      choice = moves[scores.indexOf(min)];
      return min;
    }
  } //end minimax(state)

  //choice between x and o.   
  $("#choice").slideToggle("slow", false);
  $("#choice").click(function() {
    $("#choice").slideToggle("slow");
  });

  //returns the free field in a line with 2 covered fields.
  function FindFreeField(line) {
    var field_grouped = [
    [memory[0], memory[1], memory[2]],
    [memory[3], memory[4], memory[5]],
    [memory[6], memory[7], memory[8]],
    [memory[0], memory[3], memory[6]],
    [memory[1], memory[4], memory[7]],
    [memory[2], memory[5], memory[8]],
    [memory[0], memory[4], memory[8]],
    [memory[2], memory[4], memory[6]],
    ]
    var q = 0;
    while (field_grouped[line][q][1] !== 0) {
      q++;
    }
    return field_grouped[line][q][0];
  } //end FindFreeField(line)

  //When one of the 9 buttons is clicked
  $('button').click(function() {
    //moves choice div up in case player didn't click x or o.
    if (choice_buttons === false) {
      $("#choice").slideToggle("slow");
      choice_buttons = true;
    }
    
    field = $(this).attr('value') - 1;
    this.innerHTML = (player === "x") ? "x" : "o";
    UpdateMemory_field(field, player);
    if (Game_over(memory) === true) {
      game_over_shown = true;
      Game_over_react();
    };
    turn = (player === "x") ? "o" : "x";
    //Exception to minimax algorithm: Computer's strategy when computer responds to first round played by human, based on these recommendations: https://www.quora.com/Is-there-a-way-to-never-lose-at-Tic-Tac-Toe. Minimax algorithm takes too long to compute this. 
    if (NumEmpty(memory) === 8) {
      if (memory[0][1] === 1 || memory[2][1] === 1 || memory[6][1] === 1 || memory[8][1] === 1) {
        choice = UpdateMemory_field(4, "o");
      } else if (memory[4][1] === 1) {
        var strategic_react = Random_from_Array([0, 2, 6, 8]);
        choice = UpdateMemory_field(strategic_react, "o");
      } else if (memory[1][1] === 1) {
        var strategic_react = Random_from_Array([6, 8]);
        choice = UpdateMemory_field(strategic_react, "o");
      } else if (memory[3][1] === 1) {
        var strategic_react = Random_from_Array([2, 8]);
        choice = UpdateMemory_field(strategic_react, "o");
      } else if (memory[5][1] === 1) {
        var strategic_react = Random_from_Array([0, 6]);
        choice = UpdateMemory_field(strategic_react, "o");
      } else {
        var strategic_react = Random_from_Array([0, 2]);
        choice = UpdateMemory_field(strategic_react, "o");
      }
    }
    /*Exception to minimax algorithm: Computer's strategy when human or computer has only one field to fill. I added this becuase minimax algorithm is fatalist: 
     (i) it does not block opponent when it computes that it will lose anyway
     (ii) it does not go for immediate winning move when it computes that it will win anyway.
     See here: http://neverstopbuilding.com/minimax
     */
     else if (Check2Fields(memory)[0] !== undefined) {
      free = FindFreeField(Check2Fields(memory)[1]);
      console.log(free);
      choice = UpdateMemory_field(free, turn);
    }
    //any other case: minimax.
    else {
      turn = player;
      minimax(memory);
      UpdateMemory_state(choice);
    }
    UpdateButtons();
    if (Game_over(memory) === true && game_over_shown === false) {
      Game_over_react();
    };
  })
  //x and o buttons
  $("#choice_x").click(function() {
    player = "x";
    choice_buttons = true;
  })
  $("#choice_o").on("click", function() {
    player = "o";
    choice_buttons = true;
    var strategic_start = 4;
    choice = UpdateMemory_field(strategic_start, "x");
    UpdateButtons();
  })
})