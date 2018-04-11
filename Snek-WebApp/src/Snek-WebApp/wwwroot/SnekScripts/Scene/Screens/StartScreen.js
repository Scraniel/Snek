function StartScreen(Canvas, Scene)
{
    var FLASH_TIME_MS = 1000;
    var START_MENU_TEXT = "PRESS ENTER";

    var _canvas = Canvas;
    var _scene = Scene;
    var _self = this;
    var _drawText = true;
    var _lastDraw = Date.now();
    var _inputHandler = {};

    this.Draw = function ()
    {
        var context = _canvas.getContext("2d");
        context.clearRect(0, 0, _canvas.width, _canvas.height);
        if (_drawText)
        {
            context.font = "50px Courier";
            context.textAlign = "center";
            context.fillStyle = "#D3D3D3";
            context.fillText(START_MENU_TEXT, _scene.GetCenterX(), _scene.GetCenterY());
        }
    };

    this.Update = function ()
    {
        var current = Date.now();
        if (current - _lastDraw > FLASH_TIME_MS)
        {
            _drawText ^= true;
            _lastDraw = current;
        }
    };

    this.EnterGame = function ()
    {
        _drawText = false;
        _scene.ChangeScreen("GameScreen");
        _inputHandler.Disable();
    }

    this.Startup = function ()
    {
        _inputHandler.Enable();
    }

    // One time initialization
    //
    var events =
        {
            "Enter": this.EnterGame
        };

    _inputHandler = new KeyboardInputHandler(events, _self);
}