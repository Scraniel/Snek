function Scene(SceneName, Canvas)
{
    var _sceneName = SceneName;
    var _canvas = Canvas;
    var _width = _canvas.getAttribute("width");
    var _height = _canvas.getAttribute("height");
    var _centerX = RoundToNearest(_width / 2, SEGMENT_WIDTH);
    var _centerY = RoundToNearest(_height / 2, SEGMENT_WIDTH);
    var _snake = new Snake(_centerX, _centerY);
    var _newDirection = null;

    // I think this should be a set of points or dictionary from point -> boolean.
    // That way constant time lookup instead of iteration can be done.
    //
    var _food = [];

    this.GetSceneName = function ()
    {
        return _sceneName;
    };

    this.GenerateFood = function (amount)
    {
        while (amount >= 0)
        {
            // The snake moves at intervals equal to it's width, so we want to make sure
            // the food lies on this grid otherwise it will never hit the food
            //
            var newX = RoundToNearest(Math.random() * _width, SEGMENT_WIDTH);
            var newY = RoundToNearest(Math.random() * _height, SEGMENT_WIDTH);
            var newFood = new Circle(newX, newY, 5);

            if (Contains(_food, newFood) === -1)
            {
                _food.push(newFood);
                amount--;
            }
        }
    };

    this.EndGame = function ()
    {
        _snake = new Snake(_centerX, _centerY);
        _food = [];
    };

    this.Update = function ()
    {
        var x = _snake.GetX();
        var y = _snake.GetY();
        var foodIndex = ContainsPoint(_food, new Point(x, y));

        if (_newDirection != null)
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
        if (x >= _width || x <= 0 || y >= _height || y <= 0 || _snake.IsDead())
            this.EndGame();
        else
            _snake.Move();


        // Generate more food
        //
        var toGenerate = Math.floor(_snake.GetLength() / 5) + 1 - _food.length;

        if (toGenerate > 0)
        {
            this.GenerateFood(toGenerate);
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
        context.fillText(_snake.GetLength(), _centerX, _centerY);

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

    this.ChangeDirection = function (newDirection)
    {
        if (newDirection === null)
            return;

        if (newDirection === "EAT!!")
            _snake.Eat();
        else
            _newDirection = newDirection;
    };
}