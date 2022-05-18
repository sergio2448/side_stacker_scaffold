# Scaffold Checklist

- must accommodate both JS and TS on frontend
- user changes db schema
- user wants to access db with a db management tool
- user adds a frontend lib
- user adds a backend lib
- users changes frontend code
- user changes backend code
- user changes db

# 🎮 Side Stacker Game 🎮
<img width="800" alt="image" src="https://user-images.githubusercontent.com/7388681/152719498-4752c388-4ad0-404b-b655-f4e141b7801b.png">

This is my take at the Side Stacker game for Monadical

## 🗒️ How to install and run tests
The project is mounted with Docker and thus, to install it you should just use basic docker-compose commands.

1. Clone this repository
2. Build the container: `docker-compose build`
3. Run it: `docker-compose up -d`
4. Run migrations (The container must be running): `docker-compose exec --workdir=/app backend pw_migrate migrate`
5. Run the tests (The container must be running): `docker-compose exec backend pytest -sv`
6. You can run `docker-compose exec app bash` to have a shell inside the container.
7. Example to run a single test:  `docker-compose exec backend pytest -sv src/tests/test_controller.py::test_player_in_turn`
8. Then to play it you just have to go to `0.0.0.0:3000` in your browser (Requires the container running)

## Adding frontend packages when running with Docker
After you've installed a frontend package i.e. by adding it to `package.json` or with `yarn add <packagename>`,
make sure it's updated in docker by running `docker-compose exec --workdir=/app frontend yarn install`

## Migrations note

Backend uses migrations to set up a database. It is run by docker automatically.

For manual run, `PYTHONPATH=/Users/firfi/work/clients/monadical/side_stacker_scaffold/backend/:$PYTHONPATH pw_migrate migrate`

## ✔️ Game Features
* Two players can play a game in different browsers, they just need an `username`, one of them will create a game and share the `game key` with the other one, then they'll join using this and their own `username`
* It validates the player in turn is the only one that can play
* The browser can be reloaded and no data will be lost and the game can still be played
* It validates no more than 2 players can join a game
* It doesn't let players continue playing after the game has ended

## 🧑‍💻 Tech Stack
* Language (Python 3.9)
* Backend Framework (Sanic and Websockets): I decided to go for a lighter framework than Django Channels to implement websockets because I don't like the unnecessary overhead that Django adds to a small app like this one, this is a fast async framework that implements the websockets library so I just have to start one server.
* Database (MongoDB/Pymongo): I wanted to use something really simple that don't require to run any migrations or tables creation, so I went for MongoDB that let's you iterate some ideas quickly without the rigid structure of a relational database.
* Frontend (HTML/CSS/ Plain Javascript)
* Docker: So you can easily run it on any machine without much effort to install it
* Testing (Pytest)

## 💹 Data Model
I'm basically just using a single collection in Mongo to store the information for a game, it's described as follows:
* `key (str)`: This is the identifier of the game, which is also the key shared between players to join a game, it's a 16 length string generated with `secrets.token_urlsafe(12)`
* `board (list[list])`: This stores the game status, it's a multidimensional list, each position has the `username` of a player or `_` which represents that the cell is empty
* `players (list)`: List of strings that have the players playing the game, this can't be longer than 2.
* `moves (list[tuple])`: The list of movements the game has seen, it's an append-only list that's used to rebuild the game when the page is refreshed and to validate turns
* `winner (str)`: It contains the username of the player that wons the game or `None` if there hasn't been a winner

## 🏅The Winning Algorithm
I had different options to implement the algorithm that checks if there has been a winner of a match, my design philosophy was to create something that was efficient but still readable and easily understandable, these were my options:

1. Translating the board into bitboards and solve everything with bytes operators as described in the [The Fhourstones Benchmark](https://tromp.github.io/c4/fhour.html) (for Connect4 Game)
2. Using the board as a matrix and doing a convolution operation in the two axis using Numpy as described in this [StackOverflow Answer](https://stackoverflow.com/a/63991845/17245552)
3. Doing an optimized iterative algorithm that only checks the possible winning combinations for the last played position, which are 16 (horizontal + vertical + right diagonal + left diagonal)

**This was my mindset to decide which algorithm to go for:**
1. This is the most efficient one, however, the problem with this is that it has an entry barrier, which is understanding bitboards and bytes operators, which maybe not every programmer that could read this code will understand (including me 😅) so, this has readability problems
2. This solution would be great, but it would require using an external tool like Numpy, and also understanding convolution operations, so, although this is elegant, I didn't go for it because I wanted something simpler
3. This is the one I ended up implementing, because it's fast enough since it just doesn't go to brute-force all possible combinations in the board but does a local search around the last position, and also the code is simple enough that anyone can follow it


## ⚠️ Limitations and Assumptions

### No Testing of Websockets

Unfortunately, I realized too late that the library I chose to build this project, had almost no documentation, and by
looking at their source code and googling, I couldn't make anything work, so I didn't test the webhooks in the handler
of this project, perhaps this is something we can try together in the pairing session? :D

### Column Size Problem

There's a problem in games with an odd number of columns, if I click in the middle column, would it count for the left side
or the right side? (NR or NL where N is the row number). The way I chose to fix this "problem" is by always chosing the right side,
in essence, this doesn't affect anything, let's take a look at this example to illustrate it:

Let's say I have this row in a game:

```
X X _  _  _ _ 0
0 1 2 (3) 4 5 6
```

In this case, of course, 3 is the middle column, if I am the player that's playing next, and there's only one spot left in the
left side and I want to play it, I can just go directly and click there, if it were already played it would go to the right and that
would be also not a problem, it also applies in opposite case, I can just select the free spots.

```
X _ _  _  _ X 0
0 1 2 (3) 4 5 6
```

By deciding an arbitrary side, I'm translating this problem into just a UX Problem, which also is an important thing to consider.

Another solution could be to restrict the game to only be played with even number of columns, but that would just be avoiding the problem.

And perhaps another solution could be to add left and right arrows to each row as inputs to let the user manually decide which side to put the checker on, but that would create a UI problem because that's Ugly :P

For simplicity, I'm sticking with the UX problem but just wanted to mention it here.

### Weird CSS input problem

Since the divs that contain the circles in my interface have the click event, you can register clicks outside of the actual circle
I didn't solve that problem to not waste time in things that don't add much value, also when you click randomly I get weird positions
sometimes, I didn't spend time debugging it though.
