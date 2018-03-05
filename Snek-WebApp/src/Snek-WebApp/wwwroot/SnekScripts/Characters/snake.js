var SEGMENT_WIDTH = 5;

function SnakeSegment(startX, startY, previous)
{
    var _x = startX;
    var _y = startY;

    var _previous = previous;
    var _next = null;

    this.UpdatePosition = function (nextPositionX, nextPositionY)
    {
        _x = nextPositionX;
        _y = nextPositionY;
    };

    this.SetNext = function (next)
    {
        _next = next;
    };

    this.SetPrevious = function (previous)
    {
        _previous = previous;
    };

    this.GetNext = function ()
    {
        return _next;
    };

    this.GetPrevious = function ()
    {
        return _previous;
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

function Snake(startX, startY)
{
    var _head = new SnakeSegment(startX, startY, null);
    var _tail = _head;
    var _length = 1;
    var _dead = false;

    // Direction is just an array of size 2, ie. x and y components of velocity:
    // [-1, 0] -> left 1 unit
    // [0, 2] -> up 2 units
    // etc.
    //
    var _direction = [1, 0];

    this.GetX = function ()
    {
        return _head.GetX();
    };

    this.GetY = function ()
    {
        return _head.GetY();
    };

    this.GetLength = function ()
    {
        return _length;
    };

    this.IsDead = function ()
    {
        return _dead;
    };

    this.Eat = function ()
    {
        var newX = _tail.GetX();
        var newY = _tail.GetY();

        var newTail = new SnakeSegment(newX, newY, _tail);
        _tail.SetNext(newTail);
        _tail = newTail;
        _length++;
    };

    this.Move = function ()
    {
        var currentSegment = _tail;
        var parent = _tail.GetPrevious();
        var newHeadX = _head.GetX() + _direction[0] * SEGMENT_WIDTH;
        var newHeadY = _head.GetY() + _direction[1] * SEGMENT_WIDTH;

        while (parent !== null)
        {
            // Head will collide into this 
            //
            if (parent.GetX() === newHeadX && parent.GetY() === newHeadY)
                _dead = true;

            currentSegment.UpdatePosition(parent.GetX(), parent.GetY());
            currentSegment = parent;
            parent = parent.GetPrevious();
        }

        // Head updates using direction
        //
        currentSegment.UpdatePosition(currentSegment.GetX() + (_direction[0] * SEGMENT_WIDTH), currentSegment.GetY() + (_direction[1] * SEGMENT_WIDTH));
    };

    this.ChangeDirection = function (direction)
    {
        var nextX = 0
        var nextY = 0;

        switch (direction) {
            case "left":
                nextX--;
                break;
            case "right":
                nextX++;
                break;
            case "up":
                nextY--;
                break;
            case "down":
                nextY++;
                break;
        }

        if (!this.isOpposite([nextX, nextY]))
        {
            _direction = [nextX, nextY];
        }
    };

    // TODO: This can be optimized to be cached when movement occurs / new pieces are added.
    //
    this.GetPositionData = function ()
    {
        var segmentPositions = [];

        var currentSegment = _head;

        while (currentSegment !== null) {
            segmentPositions.push([currentSegment.GetX(), currentSegment.GetY()]);
            currentSegment = currentSegment.GetNext();
        }

        return segmentPositions;
    };

    this.isOpposite = function (nextDirection)
    {
        var isXOpposite = _direction[0] === 0 ? false : (_direction[0] < 0 ? nextDirection[0] > 0 : nextDirection[0] < 0);
        var isYOpposite = _direction[1] === 0 ? false : (_direction[1] < 0 ? nextDirection[1] > 0 : nextDirection[1] < 0);

        return isXOpposite || isYOpposite;
    };

}