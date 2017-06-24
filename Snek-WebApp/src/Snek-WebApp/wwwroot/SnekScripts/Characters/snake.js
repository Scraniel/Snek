var SEGMENT_WIDTH = 5;

function SnakeSegment(startX, startY, previous, directionX, directionY)
{
    var _x = startX;
    var _y = startY;

    // Direction is just an array of size 2, ie. x and y components of velocity:
    // [-1, 0] -> left 1 unit
    // [0, 2] -> up 2 units
    // etc.
    //
    var _currentDirection = [directionX, directionY];
    var _nextDirection = previous == null ? null : [directionX, directionY];
    var _previous = previous;
    var _next = null;

    this.UpdatePosition = function(nextDirectionX, nextDirectionY)
    {
        
        _x += _currentDirection[0] * SEGMENT_WIDTH;
        _y += _currentDirection[1] * SEGMENT_WIDTH;
        _currentDirection = _nextDirection;
        _nextDirection = nextDirectionX == null ? null : [nextDirectionX, nextDirectionY];
    }

    this.SetNext = function(next)
    {
        _next = next;
    }

    this.SetPrevious = function(previous)
    {
        _previous = previous;
    }

    this.GetNext = function()
    {
        return _next;
    }

    this.GetPrevious = function()
    {
        return _previous;
    }

    this.GetX = function()
    {
        return _x;
    }
    
    this.GetY = function()
    {
        return _y;
    }

    this.GetDirectionX = function()
    {
        return _currentDirection[0];
    }
    this.GetDirectionY = function()
    {
        return _currentDirection[1];
    }

    this.ContinueDirection = function ()
    {
        _nextDirection = _currentDirection;
    }

    this.HasNextDirection = function()
    {
        return _nextDirection != null;
    }

    this.SetNextDirection = function(nextX, nextY)
    {
        if (!this.isOpposite([nextX, nextY]))
        {
            _nextDirection = [nextX, nextY];
        }
       
    }

    this.isOpposite = function(nextDirection)
    {
        isXOpposite = _currentDirection[0] == 0 ? false : (_currentDirection[0] < 0 ? nextDirection[0] > 0 : nextDirection[0] < 0);
        isYOpposite = _currentDirection[1] == 0 ? false : (_currentDirection[1] < 0 ? nextDirection[1] > 0 : nextDirection[1] < 0);

        return isXOpposite || isYOpposite;
    }
}

function Snake(startX, startY)
{
    var _head = new SnakeSegment(startX, startY, null, 1,0)
    var _tail = _head;

    this.Eat = function ()
    {
        var newX = _tail.GetX() - _tail.GetDirectionX() * SEGMENT_WIDTH;
        var newY = _tail.GetY() - _tail.GetDirectionY() * SEGMENT_WIDTH;

        var newTail = new SnakeSegment(newX, newY, _tail, _tail.GetDirectionX(), _tail.GetDirectionY());
        _tail.SetNext(newTail);
        _tail = newTail;

    }

    this.Move = function ()
    {
        var currentSegment = _head;

        // If no input, keep going the same direction
        //
        if (!currentSegment.HasNextDirection())
        {
            currentSegment.ContinueDirection();     
        }

        var nextDirectionX = null;
        var nextDirectionY = null;
        while(currentSegment != null)
        {
            currentSegment.UpdatePosition(nextDirectionX, nextDirectionY)
            nextDirectionX = currentSegment.GetDirectionX()
            nextDirectionY = currentSegment.GetDirectionY();
            currentSegment = currentSegment.GetNext();
        }
    }

    this.ChangeDirection = function (direction)
    {
        var nextX = 0
        var nextY = 0;

        switch(direction)
        {
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

        _head.SetNextDirection(nextX, nextY);
    }


    // TODO: This can be optimized to be cached when movement occurs / new pieces are added.
    //
    this.GetPositionData = function()
    {
        var segmentPositions = [];

        var currentSegment = _head;

        while(currentSegment != null)
        {
            segmentPositions.push([currentSegment.GetX(), currentSegment.GetY()]);
            currentSegment = currentSegment.GetNext();
        }

        return segmentPositions;
    }

}