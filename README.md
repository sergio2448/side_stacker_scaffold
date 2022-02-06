# side_stacker_project
Sidestacker Project Implementation


## How to install and run tests
The project is mounted with Docker and thus, to install it you should just use basic docker-compose commands.

1. Clone this repository
3. Build the container: `docker-compose build`
4. Run it: `docker-compose up -d`
5. Run the tests (The container must be running): `docker-compose exec app pytest -sv`
6. You can run `docker-compose exec app bash` to have a shell inside the container.
7. Example to run a single test:  `docker-compose exec app pytest -sv tests/test_controller.py::test_player_in_turn`

## Limitations and Assumptions

## No Testing of Websockets

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