
function Scene(SceneName, Canvas, Snake) {

    var _sceneName = SceneName;
    var _snake = Snake;
    var _canvas = Canvas;

    this.GetSceneName = function ()
    {
        return _sceneName;
    }

    this.Start = function () {

    }

    this.Update = function ()
    {
        _snake.Move();
    }

    this.Draw = function ()
    {
        var toDraw = _snake.GetPositionData();
        var context = _canvas.getContext("2d");
        context.clearRect(0, 0, _canvas.width, _canvas.height)
 
        for(var i = 0; i < toDraw.length; i++)
        {
            context.fillRect(toDraw[i][0], toDraw[i][1], 5, 5);
        }
    }

    this.ChangeDirection = function(newDirection)
    {
        if (newDirection == "EAT!!")
            _snake.Eat();
        else
            _snake.ChangeDirection(newDirection)
    }

    this.End = function () {

    }
}