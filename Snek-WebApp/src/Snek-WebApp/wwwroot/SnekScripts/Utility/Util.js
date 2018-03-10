function RoundToNearest(toRound, multiple)
{
    return Math.ceil(toRound / multiple) * multiple;
}

function Point(x, y)
{
    var _x = x;
    var _y = y;

    this.Equals = function (otherPoint)
    {
        return otherPoint.GetX() === _x && otherPoint.GetY() === _y;
    };

    this.GetX = function ()
    {
        return _x;
    };

    this.GetY = function ()
    {
        return _y;
    };
}

function Circle(x, y, radius)
{
    var _location = new Point(x, y);
    var _radius = radius;

    this.ContainsPoint = function (point)
    {
        var lowerBoundX = _location.GetX() - _radius;
        var upperBoundX = _location.GetX() + _radius;
        var lowerBoundY = _location.GetY() - _radius;
        var upperBoundY = _location.GetY() + _radius;

        return point.GetX() >= lowerBoundX && point.GetX() <= upperBoundX
            && point.GetY() >= lowerBoundY && point.GetY() <= upperBoundY;
    };

    this.Equals = function (otherCircle)
    {
        return _location.Equals(otherCircle.GetLocation()) && _radius === otherCircle.GetRadius();
    };

    this.GetLocation = function ()
    {
        return _location;
    };

    this.GetRadius = function ()
    {
        return _radius;
    };
}

function Contains(array, value)
{
    var useEquals = typeof value.Equals === 'function';

    for (var i = 0; i < array.length; i++)
    {
        if (useEquals ? array[i].Equals(value) : array[i] === value)
            return i;
    }
    
    return -1;
}

function ContainsPoint(array, point)
{
    for (var i = 0; i < array.length; i++)
    {
        if (array[i].ContainsPoint(point))
            return i;
    }

    return -1;
}
