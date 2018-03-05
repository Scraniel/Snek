﻿function Scene(SceneName, Canvas)
{

    var _sceneName = SceneName;
    var _canvas = Canvas;
    var _width = _canvas.getAttribute("width");
    var _height = _canvas.getAttribute("height");
    var _centerX = RoundToNearest(_width / 2, SEGMENT_WIDTH);
    var _centerY = RoundToNearest(_height / 2, SEGMENT_WIDTH);
    var _snake = new Snake(_centerX, _centerY);
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
            var newPoint = new Point(newX, newY);

            if (!Contains(_food, newPoint))
            {
                _food.push(newPoint);
                amount--;
            }
        }
    };

    this.Update = function ()
    {
        var x = _snake.GetX();
        var y = _snake.GetY();

        if (x >= _width || x <= 0 || y >= _height || y <= 0 || _snake.IsDead())
            _snake = new Snake(_centerX, _centerY);
        else
            _snake.Move();

        var toGenerate = Math.floor((_snake.GetLength() / 5)) + 1 - _food.length;

        if (toGenerate > 0) {
            this.GenerateFood(toGenerate);
        }
    };

    this.Draw = function ()
    {
        var toDraw = _snake.GetPositionData();
        var context = _canvas.getContext("2d");
        context.clearRect(0, 0, _canvas.width, _canvas.height)

        context.font = "50px Courier";
        context.textAlign = "center";
        context.fillStyle = "#D3D3D3";
        context.fillText(_snake.GetLength(), _centerX, _centerY);

        context.fillStyle = "#000000";

        // Draw food
        //
        for (var i = 0; i < _food.length; i++) {
            context.arc(_food[i].GetX(), _food[i].GetY(), SEGMENT_WIDTH / 2, 0, Math.PI * 2);
            context.fill();
        }

        // Draw snake
        //
        for (i = 0; i < toDraw.length; i++) {
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
            _snake.ChangeDirection(newDirection)
    };
};