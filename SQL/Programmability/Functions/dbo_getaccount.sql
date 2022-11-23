SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[getaccount](@xml  xml)
RETURNS TABLE 
AS
RETURN 
(
 

SELECT t.n.value('categoryID[1]', 'int') as id,
t.n.value('aID[1]', 'nvarchar(50)') as aID,
t.n.value('aNumber[1]', 'nvarchar(50)') as Code,
t.n.value('aDescription[1]', 'nvarchar(50)') as Descr,
t.n.value('aFringe[1]', 'nvarchar(50)') as Fringe,
t.n.value('aOriginal[1]', 'nvarchar(50)') as Original,
t.n.value('aTotal[1]', 'nvarchar(50)') as total,
t.n.value('aVariance[1]', 'nvarchar(50)') as variance
FROM @xml.nodes('/budget/accounts/account') as t(n)
)
GO