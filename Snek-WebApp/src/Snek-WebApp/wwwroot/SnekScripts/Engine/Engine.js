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
}