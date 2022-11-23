SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[TZfromUTC]
    (
    @UtcDateTime    AS DATETIME
    ,@UtcOffset     AS INT = -8 --PST
    )
RETURNS DATETIME
AS 
BEGIN
    DECLARE 
        @PstDateTime    AS DATETIME
        ,@Year          AS CHAR(4)
        ,@DstStart      AS DATETIME
        ,@DstEnd        AS DATETIME
        ,@Mar1          AS DATETIME
        ,@Nov1          AS DATETIME
        ,@MarTime       AS TIME
        ,@NovTime       AS TIME
        ,@Mar1Day       AS INT
        ,@Nov1Day       AS INT
        ,@MarDiff       AS INT
        ,@NovDiff       AS INT

    SELECT
        @Year       = YEAR(@UtcDateTime)
        ,@MarTime   = CONVERT(TIME, DATEADD(HOUR, -@UtcOffset, '1900-01-01 02:00'))
        ,@NovTime   = CONVERT(TIME, DATEADD(HOUR, -@UtcOffset - 1, '1900-01-01 02:00'))
        ,@Mar1      = CONVERT(CHAR(16), @Year + '-03-01 ' + CONVERT(CHAR(5), @MarTime), 126)
        ,@Nov1      = CONVERT(CHAR(16), @Year + '-11-01 ' + CONVERT(CHAR(5), @NovTime), 126)
        ,@Mar1Day   = DATEPART(WEEKDAY, @Mar1)
        ,@Nov1Day   = DATEPART(WEEKDAY, @Nov1)

    --Get number of days between Mar 1 and DST start date
    IF @Mar1Day = 1 SET @MarDiff = 7
    ELSE SET @MarDiff = 15 - @Mar1Day

    --Get number of days between Nov 1 and DST end date
    IF @Nov1Day = 1 SET @NovDiff = 0
    ELSE SET @NovDiff = 8 - @Nov1Day

    --Get DST start and end dates
    SELECT 
        @DstStart   = DATEADD(DAY, @MarDiff, @Mar1)
        ,@DstEnd    = DATEADD(DAY, @NovDiff, @Nov1)

    --Change UTC offset if @UtcDateTime is in DST Range
    IF @UtcDateTime >= @DstStart AND @UtcDateTime < @DstEnd SET @UtcOffset = @UtcOffset + 1

    --Get Conversion
    SET @PstDateTime = DATEADD(HOUR, @UtcOffset, @UtcDateTime)
    RETURN @PstDateTime
END
GO