function KeyboardInputHandler(ActionMap)
{
    var _map = ActionMap;
    var _enabled = true;

    this.Listener = function (event) 
    {
        if (!_enabled || !_map.hasOwnProperty(event.key))
            return;

        _map[event.key]();
    };

    this.UpdateKey = function (oldKey, newKey)
    {
        if (!_map.hasOwnProperty(oldKey))
        {
            console.error("Key '" + event.key + "' not registered.");
            return;
        }

        var action = _map[oldKey];
        delete _map[oldKey];
        _map[newKey] = action;
    };

    // Adds / updates key
    //
    this.UpsertKey = function (key, newAction)
    {
        _map[key] = newAction;
    };

    this.Disable = function ()
    {
        _enabled = false;
    };

    this.Enable = function ()
    {
        _enabled = true;
    };

    this.Enabled = function ()
    {
        return _enabled;
    };

    // One time initialization
    //
    document.addEventListener("keydown", this.Listener);
}