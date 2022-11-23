SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetListForTrailBalanceGroup] -- GetListForTrailBalance 3,'01',3,'2015-04-22 09:40:29.333','2016-04-23 09:40:29.333'
@ProdId int,
@COACOde nvarchar(50),
@Segment int,
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

declare @Data Table(Id int, COAString varchar(100), [Description] varchar(100), BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),CreatedDate datetime,AccountBal decimal(18,2))
declare @finalData Table(Id int, COAString varchar(100),[Description] varchar(100),  BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),CreatedDate datetime,AccountBal decimal(18,2))
declare @TrialBal Table(COAString varchar(100),[Description] varchar(100),  BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),AccountBal decimal(18,2))


If (@Segment=2)
begin
Insert Into @Data
select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @COACOde+'%' 
 
 end


 else if (@Segment=3)
 begin
 Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @COACOde+'%' 
 
 end
  else if (@Segment=4)
  begin

  Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @COACOde+'%' 

  end

   else if (@Segment=5)

   begin
   Insert Into @Data
    select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4+'|'+c.SS5 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @COACOde+'%' 

   end
 
 insert into @finalData

	SELECT Id,COAstring,[Description],BeginingBal,CurrentActivity,CreatedDate, SUM(Currentactivity) OVER (PARTITION BY COAString ORDER BY Id ) AS 'AccountBal'
    FROM @Data where Createddate  between @FromDate and @ToDate  	

	Update  @finalData set BeginingBal=AccountBal-CurrentActivity ;
 

select *  from @finalData 

--;WITH cte AS 
--(
--    SELECT   COAstring, BeginingBal, Sum(CurrentActivity) as CurrentActivity, ROW_NUMBER() OVER(PARTITION BY COAstring ORDER BY COAstring asc, SUM(CurrentActivity) asc) AS RowNumber
--   FROM @finalData
--    GROUP BY COAstring,BeginingBal
--)
--SELECT * 
--FROM cte
--WHERE RowNumber = 1

END



GO