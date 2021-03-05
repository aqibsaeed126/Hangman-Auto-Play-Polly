let hangmanService = {};
const HANGMAN_GAME_API_ENDPOINT = 'http://hangman-api.herokuapp.com/hangman';
const WORDS_LIST_API_ENDPOINT = 'https://raw.githubusercontent.com/despo/hangman/master/words';


hangmanService.getInitialData = function() {
  return fetch(HANGMAN_GAME_API_ENDPOINT, {
    method: 'post',
  }).then(function(response) {
    return response.json();
  }).then(function(data){
    console.log(data);
    return data;
  }).catch(function(res) {
    alert('API Response to start game '+ res)
  })
}

hangmanService.getAllWords = function() {
  return fetch(WORDS_LIST_API_ENDPOINT, {
    method: 'get',
  }).then(function(response) {
    return response.text();
  }).then(function(data){
    console.log(data);
    return data;
  }).catch(function(res) {
    alert('API Response to get list of words '+ res)
  })
}

hangmanService.guessCharacter = function(char, token) {
  const formData = new FormData();
  formData.append('letter', char);
  formData.append('token', token);

  return fetch(HANGMAN_GAME_API_ENDPOINT, {
    method: 'put',
    body: formData,
  }).then(function(response) {
    return response.json();
  }).then(function(data){
    console.log(data);
    return data;
  }).catch(function(res) {
    alert('API Response to guess word '+ res)
  })
}