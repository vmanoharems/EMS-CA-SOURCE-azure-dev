SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[getcat](@xml xml)
RETURNS TABLE 
AS
RETURN 
(
 
SELECT t.n.value('cID[1]', 'int') as cID,
t.n.value('cNumber[1]', 'nvarchar(50)') as Code,
t.n.value('cDescription[1]', 'nvarchar(50)') as Descr,
t.n.value('cFringe[1]', 'nvarchar(50)') as Fringe,
t.n.value('cOriginal[1]', 'nvarchar(50)') as Original,
t.n.value('cTotal[1]', 'nvarchar(50)') as total,
t.n.value('cVariance[1]', 'nvarchar(50)') as variance
FROM @xml.nodes('/budget/categories/category') as t(n)
)
GO