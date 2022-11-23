SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[JESumDebitsbyJEID]( @JEID INT)
RETURNS decimal(18,2)
AS 
begin
declare @dReturn Decimal(18,2);

   SELECT @dReturn = sum(DebitAmount) 
   FROM JournalEntryDetail
   WHERE JournalEntryID = @JEID
   and COAID is not null

   return @dReturn;
end
GO