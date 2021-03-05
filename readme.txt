1 - Understands the game rules and play it.
2 - Read and Understand APIs and see their responses in Network tab or postman.
3 - We only can use Start Game API and PUT API to guess the entered character.


Solution:

1 - We can fetch words list from API.
2 - Start the game with autoplayer by hitting NEw game APi.
3 - We should store the token for that session. Save in local game cycle.
4 - Show the basic UI. (Optional)
      - show a initial and updated words after every guess
      - A start game button
      - List of characters guess/picked by my program.
5 - Start guessing Word character by character and update guess count and correct word string.


Guessing Logic:

- On every call , i should validate the token. if its same in request and response , no need to update.
- First you can check length of hangman string/word when games start.
- We should filter all the words with same length. (90K words)
- loyal - logic - lawye ....
[
  {character: 'a', count: 3 , repitition: 2, wrongGuessed: undefined},
  {character: 'b', count: 3 , repitition: 2}, wrongGuessed: undefined},
  {character: 'c', count: 3 , repitition: 2}, wrongGuessed: undefined},
]
- Sort this array of obj based on count, and secondary sort on repitition.  
- Pass to API, if guessed character is wrong(Increment Wrong guesses.), 
- Filter out of remaining 90K, and repeat above 2 steps. (40K) 
- If guess is right, l___l, filter out words and update array of obj and repeat steps.
- if after an API call, wrong guess count < 7 && response does not contain _ , we Won.
- if after an API call, wrong guess > 7 , We lost

