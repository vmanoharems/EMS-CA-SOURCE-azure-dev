SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

create proc [dbo].[ReportsLedgerTBJSON]
@JSONparameters nvarchar(max)  --'{"TBFilterDate":"09/03/2017","TrailFilterCompany":["1"],"TrailFilterLocation":null,"TrailFilterSet":null,"TBFilterProject":"","TBFilterCurrency":"USD","FromTB":"","ToTB":"09/03/2017","TBFilterLocation":"","TrailBalance":{"CompanyId":1,"FromDate":"01/01/2017","ToDate":"09/03/2017","ProdId":"14","ProductionName":"EMS-Feature"},"ProdId":"14","ProductionName":"EMS-Feature"}';
AS
BEGIN
if ISJSON(@JSONparameters) is null return

declare @Companyid int =replace(replace(replace(isnull(JSON_query(@JSONparameters,'$.TrailFilterCompany'),-1),'[',''),']',''),'"','');
declare @FromDate datetime=isnull(JSON_value(@JSONparameters,'$.FromTB'),'');
declare	@ToDate datetime=isnull(JSON_value(@JSONparameters,'$.ToTB'),'');
declare @ProdId int	=isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);

	SET NOCOUNT ON;
	if( convert(date, getdate(), 100)=@ToDate)
	begin
	set @ToDate =DATEADD(day,1,@ToDate)
	end
	
	declare @fiscaldate datetime,@companyCode varchar(10)
		select  @fiscaldate=FiscalStartdate,@companyCode=CompanyCode  from company  where  companyid=@companyid 

	declare  @segmentid int,@segmentlevel int
		select  @segmentid=segmentid,@segmentlevel=segmentLevel  from segment  where classification='Detail';

	declare @SegmentEPLevel int, @FFBeginingBal decimal(18,2),@Current decimal(18,2);
		select  @SegmentEPLevel=segmentLevel  from segment  where classification='Episode';

	declare  @Child table (Parentid int
							,AccountCode nvarchar(20)
							,childid int
							, level int
							,Accounttypeid int
							,AccountName Nvarchar(200)
	);

	declare  @TB table (Parent nvarchar(20)
						,Child nvarchar(20)
						, Type nvarchar(20)
						, BeginingBal decimal(18,2)
						, CurrentBal Decimal(18,2)
						, AccountBal decimal(18,2)
						,AccountName Nvarchar(200)
						,Posting bit
	);

	with descendants as
		(
			select isnull(ParentId,0) as Parentid,AccountCode, AccountId as descendant, 2 as level,AccounttypeID,AccountName from TblAccounts  where  SubLevel=2
			union all
			select isnull(d.ParentId,0) as Parentid,s.AccountCode, s.AccountId, d.level + 1,s.AccounttypeID,s.AccountName
			from descendants as d join TblAccounts s on d.descendant = s.ParentId  where s.sublevel>2
		)
		insert into @Child (ParentID,AccountCode,childid,level,AccounttypeID,AccountName)
			select * from descendants ;

	insert into @Child (ParentID,AccountCode,childid,level,Accounttypeid,AccountName)
		select 0,AccountCode,Accountid,1,AccounttypeID,AccountName
			from tblaccounts
		where Sublevel=1
		and Segmenttype='Detail' 

	declare @Accountid int,@Childid int,@Desc nvarchar(200),@DescChild  nvarchar(200) ,@AcCode1 nvarchar(100),@AcCodechild nvarchar(100),@Posting bit;
	declare c1 cursor for 
		select  distinct Accountid
			from COA
		where  SS1=@companyCode  
		and AccounttypeID=4
		and Detaillevel=1;

	open c1;
	fetch next from c1 into @Accountid
	while @@FETCH_STATUS = 0
	begin

		select @FFBeginingBal=Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from Journalentrydetail  
		where COAID is not null 
		and Journalentryid in (select JournalEntryid 
								from JournalEntry
								where Posteddate<@FromDate and PostedDate>@fiscaldate
								)
		and COAID in (select  COAID  
						from coa  
						where SS1=@companyCode 
						and Accountid=@Accountid
					)
		;

		select @Current=--sum(case when A.AccountTypeID = 5 then (CreditAmount - DebitAmount) else CreditAmount - DebitAmount end)
			Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from JournalEntryDetail JED 
			join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
			join COA on JED.COAID = COA.COAID
			Join tblAccounts A on COA.AccountID=A.Accountid
		where JE.postedDate is not null
		and COA.SS1=@companyCode and COA.Accountid=@Accountid;

		select @Desc=AccountName,@AcCode1=Accountcode,@Posting=Posting
			from tblaccounts
		where sublevel=1 
		and Accountid=@Accountid;

		Insert into @TB 
			select  @AcCode1,'','Asset',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc,@Posting;

		Declare ChildAsset Cursor for
			select Accountid 
				from tblAccounts
			where Sublevel=2
			and Parentid=@Accountid;

		open ChildAsset;
		fetch next from ChildAsset into @Childid
		while @@FETCH_STATUS = 0
		begin

		select @FFBeginingBal=Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from Journalentrydetail  
		where COAID is not null 
		and Journalentryid in (
								select JournalEntryid 
								from JournalEntry 
								where Posteddate<@FromDate 
								and PostedDate>@fiscaldate
								)
		and COAID in (select  COAID  
						from coa  
						where SS1=@companyCode 
						and Accountid=@Childid
						)
		;

		select @Current=--sum(case when A.AccountTypeID = 5 then (CreditAmount - DebitAmount) else CreditAmount - DebitAmount end)
			Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from JournalEntryDetail JED 
			join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
			join COA on JED.COAID = COA.COAID
			Join tblAccounts A on COA.AccountID=A.Accountid
		where JE.postedDate is not null 
		and AuditStatus='Posted'
		and COA.SS1=@companyCode 
		and COA.Accountid=@Childid;

		select @DescChild=AccountName,@AcCodeChild=Accountcode,@Posting=Posting
			from tblaccounts  
		where sublevel=2 
		and Accountid=@Childid;

		Insert into @TB 
			select  @AcCode1,@AcCodeChild,'Asset',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@DescChild,@Posting;

		fetch next from ChildAsset into @Childid
		end
		close ChildAsset;
		deallocate ChildAsset;

	fetch next from C1 into @Accountid
	end
	close C1;
	deallocate C1;

	declare c2 cursor for 
		select DISTINCT Accountid from COA  where  detaillevel=1 and SS1=@companyCode  and AccounttypeID=5;
	
	open c2;
	fetch next from c2 into @Accountid
	while @@FETCH_STATUS = 0
	begin

		select @FFBeginingBal=Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from Journalentrydetail  
		where COAID is not null 
		and Journalentryid in (select JournalEntryid 
								from JournalEntry 
								where Posteddate<@FromDate 
								and PostedDate>@fiscaldate
								)
		and COAID in (select  COAID  
						from coa  
						where SS1=@companyCode 
						and Accountid=@Accountid
					)
		;

		select @Current=--sum(case when A.AccountTypeID = 5 then (CreditAmount - DebitAmount) else CreditAmount - DebitAmount end)--
			Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
			from JournalEntryDetail JED 
			join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
			join COA on JED.COAID = COA.COAID
			Join tblAccounts A on COA.AccountID=A.Accountid
		where JE.postedDate is not null
		and COA.SS1=@companyCode 
		and COA.Accountid=@Accountid;

		select @Desc=AccountName,@AcCode1=Accountcode,@Posting=Posting  
			from tblaccounts  
		where sublevel=1 
		and Accountid=@Accountid;

		Insert into @TB
			select  @AcCode1,'','Liability',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@Desc,@Posting;
  
		Declare ChildLiability Cursor for
			select Accountid  
				from tblAccounts 
			where Sublevel=2 
			and Parentid=@Accountid;

		open ChildLiability;
		fetch next from ChildLiability into @Childid
		while @@FETCH_STATUS = 0
		begin

			select @FFBeginingBal=Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0) 
				from Journalentrydetail  
			where COAID is not null 
			and Journalentryid in (
									select JournalEntryid 
										from JournalEntry 
									where Posteddate<@FromDate 
									and PostedDate>@fiscaldate
									)
			and COAID in (
							select  COAID  
								from coa  
							where SS1=@companyCode 
							and Accountid=@Childid
						)
			;

			select @Current=--sum(case when A.AccountTypeID = 5 then (CreditAmount - DebitAmount) else CreditAmount - DebitAmount end)--
				Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0)
				from JournalEntryDetail JED 
				join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
				join COA on JED.COAID = COA.COAID
				Join tblAccounts A on COA.AccountID=A.Accountid
			where JE.postedDate is not null
			and COA.SS1=@companyCode 
			and COA.Accountid=@Childid;

			select @DescChild=AccountName,@AcCodeChild=Accountcode,@Posting=Posting  
				from tblaccounts  
			where sublevel=2 
			and Accountid=@Childid;

			Insert into @TB 
				select  @AcCode1,@AcCodeChild,'Liability',@FFBeginingBal,@Current,@FFBeginingBal+@Current,@DescChild,@Posting;

		fetch next from ChildLiability into @Childid
		end
		close ChildLiability;
		deallocate ChildLiability;

	fetch next from C2 into @Accountid
	end
	close C2;
	deallocate C2;

	select @FFBeginingBal=Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0) 
		from Journalentrydetail  
	where COAID is not null 
	and Journalentryid in (select JournalEntryid 
								from JournalEntry 
							where Posteddate<@FromDate 
							and PostedDate>@fiscaldate
							) 
	and COAID in (select  COAID  
						from coa  
					where SS1=@companyCode 
					and accounttypeid  in (6,7,8,9,10,11,12,13) 
					and detaillevel in (1,2)
					)
	;

	select @Current=
		--sum(case when A.AccountTypeID = 5 then (CreditAmount - DebitAmount) else CreditAmount - DebitAmount end) -- This is the wrong logic, but in place to keep the TB report working properly
		Isnull(Sum(ISNULL(DebitAmount,0.00))-Sum(ISNULL(CreditAmount,0.00)),0) 
		from JournalEntryDetail JED 
		join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
		join COA on JED.COAID = COA.COAID
		Join tblAccounts A on COA.AccountID=A.Accountid
	where JE.postedDate is not null
	and JE.AuditStatus = 'Posted'
	and COA.SS1=@companyCode 
	and COA.accounttypeid  in (6,7,8,9,10,11,12,13);--(4,5) ;--and COA.detaillevel in (1,2);

	Insert into @TB 
	select  'All Expenses','','Expense',@FFBeginingBal,@Current,@FFBeginingBal+@Current,'All Expenses',1;

 select @CompanyCode as CO,Type,Parent,Child,AccountName  as Description,BeginingBal, CurrentBal as Currentactivity ,AccountBal,Posting   from @TB

 end
GO