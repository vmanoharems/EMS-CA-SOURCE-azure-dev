SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
Create FUNCTION [dbo].[getaccountdetail](@xml  xml)
RETURNS TABLE 
AS
RETURN 
(
 

Select 
t.n.value('accountID[1]', 'Int') as accountID,
t.n.value('dAggPercent[1]', 'nvarchar(50)') as dAggPercent,
t.n.value('dLocation[1]', 'nvarchar(50)') as dLocation,
t.n.value('dSet[1]', 'nvarchar(50)') as dSet,
t.n.value('dDescription[1]', 'nvarchar(50)') as dDescription,
t.n.value('dAmount[1]', 'nvarchar(50)') as dAmount,
t.n.value('dUnit[1]', 'nvarchar(50)') as dUnit,
t.n.value('dX[1]', 'nvarchar(50)') as dX,
t.n.value('dUnit2[1]', 'nvarchar(50)') as dUnit2,
t.n.value('dCurrency[1]', 'nvarchar(50)') as dCurrency,
t.n.value('dRate[1]', 'nvarchar(50)') as dRate,
t.n.value('dUnit3[1]', 'nvarchar(50)') as dUnit3,
t.n.value('dUnit4[1]', 'nvarchar(50)') as dUnit4,
t.n.value('dSubtotal[1]', 'nvarchar(50)') as dSubtotal,
t.n.value('hiddenDFourthMlt[1]', 'nvarchar(50)') as hiddenDFourthMlt
 from @xml.nodes('/budget/details/detail') as t(n)
)
GO