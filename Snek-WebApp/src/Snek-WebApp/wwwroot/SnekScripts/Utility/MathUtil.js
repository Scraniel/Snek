function RoundToNearest(toRound, multiple)
{
    return Math.ceil(toRound / multiple) * multiple;
}

function Point(x, y) {
    _x = x;
    _y = y;

    this.Equals = function (otherPoint) {
        return otherPoint.GetX() == _x && otherPoint.GetY() == _y;
    }

    this.GetX = function () {
        return _x;
    }

    this.GetY = function () {
        return _y;
    }
}