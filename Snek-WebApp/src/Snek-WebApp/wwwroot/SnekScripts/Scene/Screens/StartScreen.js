function StartScreen(Canvas, Scene)
{
    var FLASH_TIME_MS = 1000;
    var TITLE_TEXT = "SNEK!"
    var START_MENU_TEXT = "PRESS ENTER";
    var UNSELECTED_TEXT_COLOUR = "#D3D3D3";
    var SELECTED_TEXT_COLOUR = "#000000";
    var TEXT_HEIGHT_PX = 50;

    var _canvas = Canvas;
    var _scene = Scene;
    var _self = this;
    var _drawFlashingText = true;
    var _lastDraw = Date.now();
    var _inputHandler = {};
    var _menuOptions = ["SINGLE PLAYER", "MULTI-PLAYER"];
    var _selectedOption = 0;

    this.Draw = function ()
    {
        var context = _canvas.getContext("2d");
        var centerX = _scene.GetCenterX();
        var centerY = _scene.GetCenterY();
        context.clearRect(0, 0, _canvas.width, _canvas.height);
        context.textAlign = "center";

        // Title!
        //
        context.font = TEXT_HEIGHT_PX * 2 + "px Courier";
        context.fillStyle = SELECTED_TEXT_COLOUR;
        context.fillText(TITLE_TEXT, centerX, centerY / 2);

        // Flashing "PRESS ENTER"
        //
        if (_drawFlashingText)
        {
            context.font = TEXT_HEIGHT_PX + "px Courier";
            context.fillStyle = UNSELECTED_TEXT_COLOUR;
            context.fillText(START_MENU_TEXT, centerX, centerY);
        }

        // Menu options
        //
        context.font = TEXT_HEIGHT_PX / 2 + "px Courier";
        for (var i = 0; i < _menuOptions.length; i++)
        {
            var text = _selectedOption === i ? "⤳" + _menuOptions[i] : _menuOptions[i];
            context.fillStyle = _selectedOption === i ? SELECTED_TEXT_COLOUR : UNSELECTED_TEXT_COLOUR;
            context.fillText(text, centerX, centerY + ((i + 1) * TEXT_HEIGHT_PX));
        }
    };

    this.Update = function ()
    {
        var current = Date.now();
        if (current - _lastDraw > FLASH_TIME_MS)
        {
            _drawFlashingText ^= true;
            _lastDraw = current;
        }
    };

    this.EnterGame = function (GameMode)
    {
        _drawFlashingText = false;
        _selectedOption = 0;
        _scene.ChangeScreen("GameScreen", { gameMode:  GameMode});
        _inputHandler.Disable();
    }

    this.Startup = function (Args)
    {
        _inputHandler.Enable();
    }

    // One time initialization
    //
    var events =
        {
            "Enter": function () { _self.EnterGame(_menuOptions[_selectedOption]) },
            "ArrowUp": function () { _selectedOption = (_selectedOption - 1 % _menuOptions.length + _menuOptions.length) % _menuOptions.length},
            "ArrowDown": function () { _selectedOption = (_selectedOption + 1 % _menuOptions.length + _menuOptions.length) % _menuOptions.length}
        };

    _inputHandler = new KeyboardInputHandler(events, _self);
}