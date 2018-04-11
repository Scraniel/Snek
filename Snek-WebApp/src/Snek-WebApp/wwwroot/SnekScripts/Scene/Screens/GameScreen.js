function GameScreen(Canvas, Scene)
{
    var _canvas = Canvas;
    var _scene = Scene;
    var _snakes = [];
    var _snakeHandler = null;
    var _newDirections = [];
    var DIRECTIONS = ["left", "right", "up", "down"];
    var _twoPlayerMode = false;

    var _self = this;

    // I think this should be a set of points or dictionary from point -> boolean.
    // That way constant time lookup instead of iteration can be done.
    //
    var _food = [];

    this.GenerateFood = function (amount)
    {
        while (amount >= 0)
        {
            // The snake moves at intervals equal to it's width, so we want to make sure
            // the food lies on this grid otherwise it will never hit the food
            //
            var newX = RoundToNearest(Math.random() * _scene.GetWidth(), SEGMENT_WIDTH);
            var newY = RoundToNearest(Math.random() * _scene.GetHeight(), SEGMENT_WIDTH);
            var newFood = new Circle(newX, newY, 5);

            if (Contains(_food, newFood) === -1)
            {
                _food.push(newFood);
                amount--;
            }
        }
    };

    this.Draw = function ()
    {
        var context = _canvas.getContext("2d");
        context.clearRect(0, 0, _canvas.width, _canvas.height);

        var toDraw = [];
        for (var snake of _snakes)
        {
            toDraw = toDraw.concat(snake.GetPositionData());
        }

        // TODO: Fix score for 2p
        //
        context.font = "50px Courier";
        context.textAlign = "center";
        context.fillStyle = "#D3D3D3";
        context.fillText(_snakes[0].GetLength(), _scene.GetCenterX(), _scene.GetCenterY());

        context.fillStyle = "#000000";

        // Draw food
        //
        for (var i = 0; i < _food.length; i++)
        {
            var foodLocation = _food[i].GetLocation();

            context.beginPath();
            context.arc(foodLocation.GetX(), foodLocation.GetY(), _food[i].GetRadius(), 0, Math.PI * 2);
            context.fill();
        }

        // Draw snake
        //
        for (i = 0; i < toDraw.length; i++)
        {
            context.fillRect(toDraw[i][0], toDraw[i][1], SEGMENT_WIDTH, SEGMENT_WIDTH);
        }
    };

    this.Update = function ()
    {
        for (var i in _snakes)
        {
            var snake = _snakes[i];
            var x = snake.GetX();
            var y = snake.GetY();
            var foodIndex = ContainsPoint(_food, new Point(x, y));
            var newDirection = _newDirections[i];

            if (newDirection != null && DIRECTIONS.includes(newDirection))
            {
                snake.ChangeDirection(newDirection);
                _newDirections[i] = null;
            }

            // Eat if on some food
            //
            if (foodIndex > -1)
            {
                // Another reason we should use a set / dictionary
                //
                _food.splice(foodIndex, 1);
                snake.Eat();
            }

            // Move or end
            //
            if (x >= _scene.GetWidth() || x <= 0 || y >= _scene.GetHeight() || y <= 0 || snake.IsDead())
            {
                _self.ResetGame();
                return;
            }
            else
                snake.Move();

            // Generate more food
            //
            var toGenerate = Math.floor(snake.GetLength() / 5) + 1 - _food.length;
        }

        if (toGenerate > 0)
        {
            _self.GenerateFood(toGenerate);
        }
    };

    this.ChangeDirection = function (player, newDirection)
    {
        if (newDirection === null)
            return;

        _newDirections[player] = newDirection;
    };

    this.ResetGame = function ()
    {
        _snakes = [];
        _food = [];
        _snakeHandler.Disable();

        _scene.ChangeScreen("StartScreen");
    };

    // Run every time the screen is changed to
    //
    this.Startup = function (Args)
    {
        switch (Args.gameMode)
        {
            case "Single":
                _snakes.push(new Snake(_scene.GetCenterX(), _scene.GetCenterY()));
                break;
            case "LocalMulti":
                _twoPlayerMode = true;
                var p1StartX = RoundToNearest(_scene.GetCenterX() * (1 / 3), SEGMENT_WIDTH);
                var p2StartX = RoundToNearest(_scene.GetCenterX() * (2 / 3), SEGMENT_WIDTH);
                var startY = _scene.GetCenterY();
                _snakes.push(new Snake(p1StartX, startY));
                _snakes.push(new Snake(p2StartX, startY));
                break;
        }

        // We make a new snake so we have to update the object it acts on
        //
        _self.SetupSnakeInput();
        _snakeHandler.Enable();
    };

    this.SetupSnakeInput = function ()
    {
        var events =
            {
                "w": function () { _self.ChangeDirection(0, "up") },
                "a": function () { _self.ChangeDirection(0, "left") },
                "s": function () { _self.ChangeDirection(0, "down") },
                "d": function () { _self.ChangeDirection(0, "right") },
                "ArrowUp": function () { _self.ChangeDirection(1, "up") },
                "ArrowLeft": function () { _self.ChangeDirection(1, "left") },
                "ArrowDown": function () { _self.ChangeDirection(1, "down") },
                "ArrowRight": function () { _self.ChangeDirection(1, "right") }
            };

        if (_snakeHandler === null)
            _snakeHandler = new KeyboardInputHandler(events);
        else
        {
            for (var key in events)
            {
                if (events.hasOwnProperty(key))
                {
                    _snakeHandler.UpsertKey(key, events[key]);
                }
            }
        }
    };
}