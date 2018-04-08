function Engine(Scene, FPS)
{
    var _scene = Scene;
    var _fps = FPS;
    var _self = this;
    var _last = Date.now();
    var _frameDurationMs = 1000 / _fps;

    this.GameLoop = function ()
    {
        var _current = Date.now();
        var _elapsed = _current - _last;

        if (_elapsed > _frameDurationMs)
        {
            _scene.Update();
            _scene.Draw();
            _last = Date.now();
        }

        window.requestAnimationFrame(_self.GameLoop);
    };

    // This might be better off in the Scene. The engine should sort of be
    // independant of the game logic
    //
    this.KeyboardListener = function (event) 
    {
        var directionToGo = null;
        switch (event.key)
        {
            case "ArrowUp":
            case "w":
                directionToGo = "up";
                break;
            case "ArrowDown":
            case "s":
                directionToGo = "down";
                break;
            case "ArrowLeft":
            case "a":
                directionToGo = "left";
                break;
            case "ArrowRight":
            case "d":
                directionToGo = "right";
                break;
            case "q":
                directionToGo = "EAT!!";
                break;
            case "Enter":
                directionToGo = "Enter";
                break;
        };

        _scene.UpdateAction(directionToGo);
    }
}