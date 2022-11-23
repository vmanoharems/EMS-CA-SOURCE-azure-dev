SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE FUNCTION [dbo].[GetBeginBal] (@COAID int,@fromDate date,@todate date)  
RETURNS Decimal    
AS   
BEGIN  
    DECLARE @ret Decimal(18,2);  
 
	
select  @ret=Isnull(sum(a.CreditAmount),0)-Isnull(sum(a.debitAmount),0.00)  from JournalEntrydetail a inner Join JOurnalEntry b on a.Journalentryid=b.Journalentryid
Where  a.COAID=@COAID and  b.Posteddate between @fromDate and @todate

     IF (@ret IS NULL)   
        SET @ret = 0.00;  
    RETURN @ret;  
END; 

GO