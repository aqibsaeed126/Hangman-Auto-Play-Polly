  const MAX_ATTEMPT_COUNT = 7;
  let current_token = '';
  let updatedWord = '';
  let isFirstCall = false;
  let data;
  let wordsList = [];
  let wrongGuessCount = 0;
  let alphabetsArray = [
    {character: 'a', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'b', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'c', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'd', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'e', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'f', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'g', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'h', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'i', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'j', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'k', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'l', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'm', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'n', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'o', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'p', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'q', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'r', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 's', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 't', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'u', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'v', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'w', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'x', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'y', count: 0 , repitition: 0, wrongGuessed: undefined},
    {character: 'z', count: 0 , repitition: 0, wrongGuessed: undefined},
  ];
  String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

  async function startGame() {

    wordsList = await hangmanService.getAllWords();
    if(wordsList) wordsList = wordsList.split('\n');
    data = await hangmanService.getInitialData();
    if(isTokenValid(data.token)) {
      updatedWord = data.hangman;
      current_token = data.token;
      showUpdatedWordOnUI(data.hangman);
      startGuessing();
    }
    else {
      alert('Token is invalid - Starting game Again')
    }
  }

  async function startGuessing() {
    
    let wordLength = updatedWord.length;
    
    alphabetsArray = alphabetsArray.filter(function(item){
      return item.wrongGuessed === undefined;
    });

    // filter array of words based on length
    wordsList = wordsList.filter(function(item) {
      return item.length === wordLength;
    });


    // Update the array of objects
    for (let i=0; i<alphabetsArray.length; i++ ) {
      for (let j=0; j<wordsList.length; j++) {
        if (wordsList[j].indexOf(alphabetsArray[i].character)){
          alphabetsArray[i].count++;
        }
        if(isRepititiveCharacter(wordsList[j], alphabetsArray[i].character)) {
          alphabetsArray[i].repitition++;
        }
      }
    }


    // sort the alphabetsArray based on count and then repitition
    alphabetsArray.sort(function(a, b) {
      if(a.count === b.count) return a.repitition - b.repitition;
      else return a.count - b.count;
    });


    // Loop through alphabetsArray and try character 1 by 1
    let isWrongGuessed = undefined;
    let guessCharacterResponse = {};

    //for (let i=0; i<alphabetsArray.length; i++) {
      isWrongGuessed = undefined;
      guessCharacterResponse = await hangmanService.guessCharacter(alphabetsArray[0].character, current_token);
      isWrongGuessed = !guessCharacterResponse.correct;

      if(!isTokenValid(guessCharacterResponse.token)) {
        alert('Wrong or Invalid token..');
        return;
      }

      alphabetsArray[0].wrongGuessed = isWrongGuessed;
      updateAttemptedCharacterList(alphabetsArray[0].character);

      // Wrong Guess Case
      if(isWrongGuessed === true) {
        wrongGuessCount++;
        if (wrongGuessCount > MAX_ATTEMPT_COUNT) {
          showGameResult('You LOST... Start a new game');
          return;
        }
        // for next iteration search , you should ignore words with wrong guessed character
        wordsList = wordsList.filter(function(item) {
          return item.indexOf(alphabetsArray[0].character) < 0;
        });
        
      }

      // Right Guess case
      if(isWrongGuessed === false) {

        // guessCharacterResponse.hangman = 'p___p'
        // updatedWord = '_a___'
        // pa__p
        for(let y=0; y<guessCharacterResponse.hangman.length; y++) {
          if(guessCharacterResponse.hangman[y] != '_'){
            updatedWord = updatedWord.replaceAt(y, guessCharacterResponse.hangman[y]);
          }
        }

        showUpdatedWordOnUI(updatedWord);
        if (updatedWord.indexOf('_') == -1 && wrongGuessCount <= MAX_ATTEMPT_COUNT ){
          showGameResult('Congratz...!! You WON... Start a new game');
          return;
        }

        // l____l
        wordsList = wordsList.filter(function(item) {
          for(let j=0; j<item.length; j++) {
            if(updatedWord[j] != '_' && updatedWord[j] === item[j]) {
              return true;
            }
          }
        });

        console.log(wordsList);

        
      }
      
    //}

    return startGuessing();
    console.log(alphabetsArray);  
  }

  function showUpdatedWordOnUI(val){
    //updatedWord = val;
    document.getElementById('guessed_word').innerText = updatedWord;
  }

  function showGameResult(result){
    document.getElementById('game_result').innerText = result;
  }

  function updateAttemptedCharacterList(char) {
    let elem = document.getElementById('characters_guessed');
    elem.innerText = elem.innerText + ', '+ char;
  }

  function isRepititiveCharacter(word, character) {
    if(word){
      let charCount = 0;
      for(let m=0; m<word.length; m++){
        if(word[m] === character) charCount++;
      }
      return charCount > 1;
    }
    return false;
  }

  function isTokenValid(token) {
    if(isFirstCall === false) isFirstCall = true;
    return isFirstCall || token === current_token;
  }