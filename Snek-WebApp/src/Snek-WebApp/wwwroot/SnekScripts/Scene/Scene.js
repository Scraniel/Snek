function Scene(Canvas)
{
    var _canvas = Canvas;
    var _self = this;
    var _width = _canvas.getAttribute("width");
    var _height = _canvas.getAttribute("height");
    var _centerX = RoundToNearest(_width / 2, SEGMENT_WIDTH);
    var _centerY = RoundToNearest(_height / 2, SEGMENT_WIDTH);

    // Just so we can cache these
    // TODO: this can easily be stored in a config
    //
    var _screens = {};
    var _currentScreen = null;

    this.Update = function ()
    {
        _currentScreen.Update();
    };

    this.Draw = function ()
    {
        _currentScreen.Draw();
    };

    this.ChangeScreen = function (ScreenName, Args)
    {
        if (!_screens.hasOwnProperty(ScreenName))
        {
            console.error("The screen '" + ScreenName + "' doesn't exist");
            return;
        }

        _currentScreen = _screens[ScreenName];
        _currentScreen.Startup(Args);
    };

    this.GetWidth = function ()
    {
        return _width;
    };

    this.GetHeight = function ()
    {
        return _height;
    };

    this.GetCenterX = function ()
    {
        return _centerX;
    };

    this.GetCenterY = function ()
    {
        return _centerY;
    };

    // One time initialization
    //
    _screens = 
    {
        'StartScreen': new StartScreen(_canvas, _self),
        'GameScreen': new GameScreen(_canvas, _self)
    };

    this.ChangeScreen('StartScreen');
}