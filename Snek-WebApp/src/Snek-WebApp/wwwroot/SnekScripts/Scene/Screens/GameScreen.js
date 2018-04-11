function GameScreen(Canvas, Scene)
{
    var _canvas = Canvas;
    var _scene = Scene;
    var _snake = new Snake(_scene.GetCenterX(), _scene.GetCenterY());
    var _newDirection = null;
    var DIRECTIONS = ["left", "right", "up", "down"];
    var _snakeHandler = null;
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
        var toDraw = _snake.GetPositionData();
        var context = _canvas.getContext("2d");
        context.clearRect(0, 0, _canvas.width, _canvas.height);

        context.font = "50px Courier";
        context.textAlign = "center";
        context.fillStyle = "#D3D3D3";
        context.fillText(_snake.GetLength(), _scene.GetCenterX(), _scene.GetCenterY());

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
        var x = _snake.GetX();
        var y = _snake.GetY();
        var foodIndex = ContainsPoint(_food, new Point(x, y));

        if (_newDirection != null && DIRECTIONS.includes(_newDirection))
        {
            _snake.ChangeDirection(_newDirection);
            _newDirection = null;
        }

        // Eat if on some food
        //
        if (foodIndex > -1)
        {
            // Another reason we should use a set / dictionary
            //
            _food.splice(foodIndex, 1);
            _snake.Eat();
        }

        // Move or end
        //
        if (x >= _scene.GetWidth() || x <= 0 || y >= _scene.GetHeight() || y <= 0 || _snake.IsDead())
            _self.ResetGame();
        else
            _snake.Move();


        // Generate more food
        //
        var toGenerate = Math.floor(_snake.GetLength() / 5) + 1 - _food.length;

        if (toGenerate > 0)
        {
            _self.GenerateFood(toGenerate);
        }
    };

    // TODO: change from polling once input managers exist
    //
    this.ChangeDirection = function (newDirection)
    {
        if (newDirection === null)
            return;

        if (newDirection === "EAT!!")
            _snake.Eat();
        else
            _newDirection = newDirection;
    };

    this.ResetGame = function ()
    {
        _snake = new Snake(_scene.GetCenterX(), _scene.GetCenterY());
        _food = [];
        _snakeHandler.Disable();

        _scene.ChangeScreen("StartScreen");
    };

    // Run every time the screen is changed to
    //
    this.Startup = function ()
    {
        // We make a new snake so we have to update the object it acts on
        //
        _self.SetupSnakeInput();
        _snakeHandler.Enable();
    };

    this.SetupSnakeInput = function ()
    {
        var events =
            {
                "w": function () { _self.ChangeDirection("up") },
                "a": function () { _self.ChangeDirection("left") },
                "s": function () { _self.ChangeDirection("down") },
                "d": function () { _self.ChangeDirection("right") }
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