SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetListForTrialBalance] -- GetListForTrialBalance 3,'04-17-2016','01-01-0001'
@ProdId int,
@FromDate date,
@ToDate date


AS
BEGIN

if(@FromDate='1/1/0001')
begin
set @FromDate=GETDATE()
end
if(@ToDate='1/1/0001')
begin
set @ToDate=GETDATE()
end


declare @COAID int,@COAString varchar(200)
declare @Data Table(COAID int,COAString varchar(100),  BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),AccountBal decimal(18,2))

 
Declare Cur Cursor Local Scroll For
 select Distinct COAID,COAString from JournalEntryDetail where ProdId=@ProdId 
 --and COAString like  @CompanyId+'%' 
 and cast ([CreatedDate] as date)  between @FromDate and @ToDate

Open Cur
fetch next from Cur into @COAID,@COAString

While @@FETCH_STATUS=0
Begin 


Insert Into @Data
select COAID,COAString,0 as BeginingBal ,0 as CurrentActivity ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as AccountBal  from JournalEntryDetail where COAID= @COAID



fetch next from Cur into @COAID,@COAString

End
close Cur
Deallocate Cur



Update @Data Set CurrentActivity = AccountBal

;with TmpTb as(
select 
    ROW_NUMBER() over (order by COAID) RNum, * 
From 
    @Data)

update c set AccountBal= AccountBal+x.CurrentActivity ,BeginingBal=BeginingBal+X.CurrentActivity
from TmpTb c join
(select a.RNum, a.COAID, b.CurrentActivity
From TmpTb a LEFT JOIN TmpTb b on a.RNum=b.RNum+1
where a.COAID=b.COAID )x on c.RNum>=x.RNum AND c.COAID=x.COAID


select COAID,COAString ,BeginingBal,CurrentActivity,AccountBal   from @Data

END


GO