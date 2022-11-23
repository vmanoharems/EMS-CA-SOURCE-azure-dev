SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[JEAuditReportFilterByAccount]  
 @ProdId int,
 @CompanyId int,
 @PeriodStatus nvarchar(50),
 @CreateDateFrom date,
 @CreatedDateTo date,
 @TransactionFrom nvarchar(50),
 @TranasactionTo nvarchar(50),
 @BatchNumber nvarchar(100),
 @UserName nvarchar(100),
 @Status nvarchar(50)
AS

BEGIN

declare @tz  int;
set @tz = dbo.tzforproduction(0);

 if(@TransactionFrom='')
 begin
 set @TransactionFrom =(select top 1 cast(TransactionNumber as int) From JournalEntry  order by 1 asc)
 end
 if(@TranasactionTo='')
 begin
 set @TranasactionTo =(select top 1 cast(TransactionNumber as int) From JournalEntry  order by 1 desc)
 end

 if(@CreatedDateTo='1/1/0001')
	 begin
		set @CreatedDateTo = getdate();
	--  set @CreatedDateTo= dateadd(DD, 1, getdate());
	 end
/* else
	 begin
	  --set @CreatedDateTo= dateadd(DD, 1, @CreatedDateTo);
	  end
*/

 if(@Status='Posted')
 begin

		select JournalEntryDetailId,je.JournalEntryId,
		TransactionLineNumber,je.COAId,isnull(DebitAmount,0.00) as DebitAmount ,isnull(CreditAmount,0.00)as CreditAmount,
		je.VendorId,
	
			isnull(V.VendorName,'')as VendorName ,
			ThirdParty,isnull(Note,'')as Note ,JE.TransactionCodeString,dbo.convertcodes(je.TransactionCodeString)as TransactionvalueString
			,JE.SetId,je.SeriesId,isnull(T.AccountCode,'') as SetAC,isnull(TT.AccountCode,'') as SeriesAC
			,je.COAString 
			,isnull(je.TaxCode,'')as TaxCode , isnull(coa.AccountTypeid,'') as AccountTypeId,A.AccountCode,
			dbo.BreakCOA(JE.COAString,'LOCATION')as Location ,j.ClosePeriod ,J.BatchNumber,J.DocumentNo
			,convert(varchar(10),dbo.TZfromUTC(J.CreatedDate,@tz),101) as PostedDate
			,J.Description,A.AccountName
			from JournalEntryDetail  JE
			INNER join JournalEntry j on j.JournalEntryId=jE.JournalEntryId
			left outer join TblAccounts  T on T.AccountId=JE.SetId
			left outer join TblAccounts  TT on TT.AccountId=JE.SeriesId
			inner join coa on je.COAId=coa.COAID
			left outer join TblAccounts A on COA.AccountId=A.AccountId
			Left Outer join tblVendor v on V.VendorID=JE.VendorId 
			where J.AuditStatus = @Status
			and (J.CompanyId=@CompanyId or @CompanyId = '')
			and J.Prodid=@ProdId
			and dbo.TZfromUTC(J.PostedDate,@tz) between @CreateDateFrom and @CreatedDateTo
			and cast(J.TransactionNumber as int) between cast(@TransactionFrom  as int)  and cast( @TranasactionTo as int)
			and (J.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
			and (J.CreatedBy in (select * FROM dbo.SplitCSV(@UserName,',')) OR @UserName='')
			and J.AuditStatus=@Status
			and J.Source in ('JE','PR','WT') 
			and (J.ClosePeriod in (select * FROM dbo.SplitCSV(@PeriodStatus,',')) OR @PeriodStatus='')
			Order By
			COA.COACode ASC
			, COA.Detaillevel asc
end

else 

begin
 declare @PrId1 int,@PrId2 int
	set @PrId1=0;set @PrId2=0;
	if(@PeriodStatus='Current')
	begin
		set @PrId1=dbo.GetCurrentOpenPeriodID(@CompanyId,default); 
	end
	else if(@PeriodStatus='Future')
	begin
		set @PrId2=(select ClosePeriodId  from ClosePeriod  where CompanyId=@CompanyId and Status='Open' and PeriodStatus='Future')
	end
	else if(@PeriodStatus='Both')
	begin
		set @PrId1=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CompanyId and Status='Open' and PeriodStatus='Current')
		set @PrId2=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CompanyId and Status='Open' and PeriodStatus='Future')
	end

	select JournalEntryDetailId,je.JournalEntryId,
	TransactionLineNumber,je.COAId,isnull(DebitAmount,0.00) as DebitAmount ,isnull(CreditAmount,0.00)as CreditAmount,
	je.VendorId,
	
		isnull(V.VendorName,'')as VendorName,
		ThirdParty,isnull(Note,'')as Note ,JE.TransactionCodeString,dbo.convertcodes(je.TransactionCodeString)as TransactionvalueString
		,JE.SetId,je.SeriesId,isnull(T.AccountCode,'') as SetAC,isnull(TT.AccountCode,'') as SeriesAC
		,je.COAString 
		,isnull(je.TaxCode,'')as TaxCode , isnull(coa.AccountTypeid,'') as AccountTypeId,A.AccountCode,
		dbo.BreakCOA(JE.COAString,'LOCATION')as Location ,j.ClosePeriod ,J.BatchNumber,J.DocumentNo
		,convert(varchar(10),dbo.TZfromUTC(J.CreatedDate,@tz),101) as PostedDate
		,J.Description,A.AccountName
		from JournalEntryDetail  JE
		INNER join JournalEntry j on j.JournalEntryId=jE.JournalEntryId
		left outer join TblAccounts  T on T.AccountId=JE.SetId
		left outer join TblAccounts  TT on TT.AccountId=JE.SeriesId
		inner join coa on je.COAId=cOA.COAID
		left outer join TblAccounts  A on coa.AccountId=A.AccountId
		Left Outer join tblVendor v on V.VendorID=JE.VendorId
		where  (J.CompanyId=@CompanyId or @CompanyId = '')
		and J.Prodid=@ProdId  
		and J.Source in ('JE','PR','WT')
		and J.AuditStatus in ('Audit','Saved')
		and cast(J.EntryDate as date) between @CreateDateFrom and @CreatedDateTo
		and cast(J.TransactionNumber as int) between cast(@TransactionFrom  as int)  and cast( @TranasactionTo as int)
		and (J.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
		and (J.CreatedBy in (select * FROM dbo.SplitCSV(@UserName,',')) OR @UserName='')
		and (J.ClosePeriod <=@PrId1 or J.ClosePeriod=@PrId2)
			Order By
			COA.COACode ASC
			, COA.Detaillevel asc
end
END
GO