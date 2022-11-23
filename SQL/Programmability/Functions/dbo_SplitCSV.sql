SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[SplitCSV]  --'Email Sent,Free Trial',','
 (@String varchar(100), @Delimiter char(1))    
RETURNS @temptable TABLE (items varchar(100))
AS
BEGIN
DECLARE @idx INT
DECLARE @slice VARCHAR(100)

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