SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetTBByEP] -- GetTBByEP 1,'07/01/2016','2016-07-20 19:03:25.507',3
	-- Add the parameters for the stored procedure here
		@Companyid int,
	    @FromDate DateTime,
        @ToDate DateTime,
		@ProdId int
AS
BEGIN
	
	SET NOCOUNT ON;
	if( convert(date, getdate(), 100)=@ToDate)
	begin
	set @ToDate =DATEADD(day,1,@ToDate)
	end

declare  @segmentid int,@segmentlevel int,@companyCode varchar(10),@fiscaldate datetime,@SegmentEPLevel int, @FFBeginingBal decimal(18,2),@Current decimal(18,2)
,@Desc nvarchar(200),@EP nvarchar(20);
select  @fiscaldate=FiscalStartdate,@companyCode=CompanyCode  from company  where  companyid=@companyid 
select  @segmentid=segmentid,@segmentlevel=segmentLevel  from segment  where classification='Detail';
select  @SegmentEPLevel=segmentLevel  from segment  where classification='Episode';
declare  @TB table (Account nvarchar(20),Episode nvarchar(20), Type nvarchar(20),BeginingBal decimal(18,2), CurrentBal Decimal(18,2),AccountBal decimal(18,2),AccountName Nvarchar(200));

-----------------------ASSET-----------------------------------

select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode   and Detaillevel>0 and Accounttypeid=4);

 select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
 Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and COAID in (
 select  COAID  from coa  where SS1=@companyCode  and Detaillevel>0 and Accounttypeid=4);


  Insert into @TB 
  select  'All','All','Asset',@FFBeginingBal,@Current,@FFBeginingBal+@Current,'Assets';


-----------------------ASSET-----------------------------------

-----------------------LIABILITY------------------------------

select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and  Detaillevel>0 and Accounttypeid=5);

 select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
 Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and COAID in (
 select  COAID  from coa  where SS1=@companyCode and  Detaillevel>0 and Accounttypeid=5);


  Insert into @TB 
  select  'All','All','Liability',@FFBeginingBal,@Current,@FFBeginingBal+@Current,'Liabilities';

-----------------------LIABILITY------------------------------


-----------------------EXPENSE------------------------------
declare c3 cursor for 
select Accountcode from tblaccounts where segmenttype='Episode' ;
open c3;
fetch next from c3 into @EP
while @@FETCH_STATUS = 0
begin
select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and @EP=case when @SegmentEPLevel=2 then ss2 when @SegmentEPLevel=3 then ss3 else ss4 end and Detaillevel>0 and Accounttypeid not in(4,5));

 select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
 Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and COAID in (
 select  COAID  from coa  where SS1=@companyCode and @EP=case when @SegmentEPLevel=2 then ss2 when @SegmentEPLevel=3 then ss3 else ss4 end and Detaillevel>0 and Accounttypeid not in(4,5));

 select @Desc=AccountName  from tblAccounts   where segmentType='Episode' and AccountCode=@EP;

  Insert into @TB 
  select  'All',@EP,'Expense',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc;


fetch next from c3 into @EP
end
close c3;
deallocate c3;

-----------------------EXPENSE------------------------------


select @CompanyCode as CO,Type,Episode,Account,AccountName  as Description,BeginingBal, CurrentBal as Currentactivity ,AccountBal   from @TB


 end








GO