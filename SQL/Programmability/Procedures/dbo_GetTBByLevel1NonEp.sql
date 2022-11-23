SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetTBByLevel1NonEp] -- GetTBByLevel1NonEp 1,'07/19/2016','2016-07-23',3
	@Companyid int,
	@FromDate DateTime,
    @ToDate DateTime ,
	@ProdId int
AS
BEGIN
	SET NOCOUNT ON;
	if( convert(date, getdate(), 100)=@ToDate)
	begin
	set @ToDate =DATEADD(day,1,@ToDate)
	end
declare  @segmentid int,@segmentlevel int,@companyCode varchar(10),@fiscaldate datetime, @FFBeginingBal decimal(18,2),@Current decimal(18,2);
select  @fiscaldate=FiscalStartdate,@companyCode=CompanyCode  from company  where  companyid=@companyid 
select  @segmentid=segmentid,@segmentlevel=segmentLevel  from segment  where classification='Detail';
declare  @Child table  (Parentid int,AccountCode nvarchar(20),childid int, level int,Accounttypeid int,AccountName Nvarchar(200));
declare  @TB table     (Account nvarchar(20), Type nvarchar(20),BeginingBal decimal(18,2), CurrentBal Decimal(18,2),AccountBal decimal(18,2),AccountName Nvarchar(200));

with descendants as
  ( select isnull(ParentId,0) as Parentid,AccountCode, AccountId as descendant, 2 as level,AccounttypeID,AccountName from TblAccounts  where  SubLevel=2
	union all
    select isnull(d.ParentId,0) as Parentid,s.AccountCode, s.AccountId, d.level + 1,s.AccounttypeID,s.AccountName
    from descendants as d join TblAccounts s on d.descendant = s.ParentId  where s.sublevel>2)
	insert into @Child (ParentID,AccountCode,childid,level,AccounttypeID,AccountName)
	 select * from descendants ;
	 insert into @Child (ParentID,AccountCode,childid,level,Accounttypeid,AccountName)
	 select 0,AccountCode,Accountid,1,AccounttypeID,AccountName  from tblaccounts where Sublevel=1 and Segmenttype='Detail'    

 declare @AcCode nvarchar(20),@Desc nvarchar(200)
 declare c1 cursor for 
 select  Accountcode from tblAccounts where Segmenttype='Detail' and sublevel=1  and AccounttypeID=4
 open c1;
 fetch next from c1 into @AcCode
 while @@FETCH_STATUS = 0
 begin

select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and (Accountid in 
  (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=4)
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=4))));

  select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
   Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and  (Accountid in
    (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=4)
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=4))
  ));
  select @Desc=AccountName  from @Child  where level=1 and AccountCode=@AcCode;

  Insert into @TB 

  select  @AcCode,'Asset',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc;
 fetch next from C1 into @AcCode
 end
 close C1;
 deallocate C1;

 declare c2 cursor for 
 select  Accountcode from tblAccounts where Segmenttype='Detail' and sublevel=1  and AccounttypeID=5
 open c2;
 fetch next from c2 into @AcCode
 while @@FETCH_STATUS = 0
 begin

select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and  (Accountid in 
   (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=5)
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=5))
  ));

  select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
    Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and  COAID in (
  select  COAID  from coa  where SS1=@companyCode and  (Accountid in 
   (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=5)
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid=5))
  ));
    select @Desc=AccountName  from @Child  where level=1 and AccountCode=@AcCode;
  Insert into @TB 

  select  @AcCode,'Liability',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc;
 fetch next from C2 into @AcCode
 end
 close C2;
 deallocate C2;

 declare c3 cursor for 
  select  Accountcode from tblAccounts where Segmenttype='Detail' and sublevel=1  and AccounttypeID not  in (4,5)
 open c3;
 fetch next from c3 into @AcCode
 while @@FETCH_STATUS = 0
 begin

select @FFBeginingBal=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from Journalentrydetail  
 where COAID is not null and Journalentryid in (select JournalEntryid from JournalEntry where Posteddate<@FromDate and PostedDate>@fiscaldate) and COAID in (
  select  COAID  from coa  where SS1=@companyCode and ( Accountid in 
 (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid not in (4,5))
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid not in (4,5)))));

  select @Current=Isnull(Sum(ISNULL(CreditAmount,0.00))-Sum(ISNULL(DebitAmount,0.00)),0) from JournalEntryDetail where  
    Journalentryid in (select JournalEntryid from JournalEntry where Posteddate>@FromDate and PostedDate<@ToDate) and  COAID in (
  select  COAID  from coa  where SS1=@companyCode and  ( Accountid in 
 (select childid from @child  where Parentid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid not in (4,5))
  or Accountid in (select childid  from @child where Accountcode=@AcCode and Level=1 and Accounttypeid not  in (4,5)))));
    select @Desc=AccountName  from @Child  where level=1 and AccountCode=@AcCode;

  Insert into @TB 

  select  @AcCode,'Expense',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc;
 fetch next from C3 into @AcCode
 end
 close C3;
 deallocate C3;


 select @CompanyCode as CO,Type,Account,AccountName  as Description,BeginingBal, CurrentBal as Currentactivity ,AccountBal   from @TB


 end









GO