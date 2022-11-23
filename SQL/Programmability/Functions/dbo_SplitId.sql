SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[SplitId]
(	
	-- Add the parameters for the function here
	@String varchar(max), @Delimiter char(1))    
RETURNS @temptable TABLE (items varchar(max))
AS
BEGIN
DECLARE @idx INT
DECLARE @slice VARCHAR(max)

SELECT @idx = 1
IF LEN(@String)<1 or @String IS NULL RETURN

WHILE @idx!= 0
BEGIN
SET @idx = CHARINDEX(@Delimiter,@String)
IF @idx!=0
SET @slice = LEFT(@String,@idx - 1)
ELSE
SET @slice = @String

IF(LEN(@slice)>0)
INSERT INTO @temptable(Items) VALUES(@slice)

SET @String = RIGHT(@String,LEN(@String) - @idx)
IF LEN(@String) = 0 BREAK
END
RETURN
END
GO