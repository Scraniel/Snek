function RoundToNearest(toRound, multiple)
{
    return Math.ceil(toRound / multiple) * multiple;
};

function Point(x, y)
{
    var _x = x;
    var _y = y;

    this.Equals = function (otherPoint)
    {
        return otherPoint.GetX() === _x && otherPoint.GetY() === _y;
    }

    this.GetX = function ()
    {
        return _x;
    }

    this.GetY = function ()
    {
        return _y;
    }
};

function Contains(array, value)
{
    var useEquals = typeof value.Equals === 'function';

    for (var i = 0; i < array.length; i++)
    {
        if (useEquals ? array[i].Equals(value) : array[i] === value)
            return true;
    }

    return false;
};