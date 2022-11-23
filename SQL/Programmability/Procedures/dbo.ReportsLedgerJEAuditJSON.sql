CREATE proc [dbo].[ReportsLedgerJEAuditJSON]
(
 @JSONparameters nvarchar(max) -- '{"AccountJE":"on","ReportDateJEFilter":"09/03/2017","JEAuditFilterCompany":["1"],"JEAuditFilterLocation":null,"JEAuditFilterSet":null,"txtJEPeriodStatus":"Current","CreatedDateJEFrom":"","CreatedDateJETo":"09/03/2017","JEAudTransFrom11":"","JEAudTransTo11":"","BatchJEAudit":null,"JEAudUserName":null,"JE":{"objRDF":{"ProdId":"14","CompanyId":1,"PeriodStatus":"Current","CreateDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","TransactionFrom":"","TranasactionTo":"","BatchNumber":"","UserName":"","Status":"Saved"},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"}},"ProdId":"14","UserId":"59","Status":"Saved"}'
)
    AS
	BEGIN
    if ISJSON(@JSONparameters) is null return;	
	
	declare	@ProdId int = isnull(JSON_VALUE(@JSONparameters,'$.ProdId'),-1);
	declare	@CompanyId int = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.JEAuditFilterCompany'),''),'[',''),']',''),'"','');
	declare @PeriodStatus nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.txtJEPeriodStatus'),''); 
	declare	@CreateDateFrom date = isnull(JSON_VALUE(@JSONparameters,'$.CreatedDateJEFrom'),''); 
	declare	@CreatedDateTo date = isnull(JSON_VALUE(@JSONparameters,'$.CreatedDateJETo'), ''); 
	declare	@TransactionFrom nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.JEAudTransFrom11'),'');
	declare	@TranasactionTo nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.JEAudTransTo11'),'');
	declare	@BatchNumber nvarchar(100) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.BatchJEAudit'),''),'[',''),']',''),'"','');
	declare	@UserName nvarchar(100) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.JEAudUserName'),''),'[',''),']',''),'"','');
	declare	@Status nvarchar(50) =isnull(JSON_VALUE(@JSONparameters,'$.Status'),''); 



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
/* Begin Episodic */
	declare @COAIDFilter table (COAID INT not null, UNIQUE NONCLUSTERED ([COAID]));
	declare @EpisodeFound bit = 0;

	if isJSON(@JSONParameters)=1
	begin
		declare @FilterEpisodeCode varchar(100) = JSON_VALUE(@JSONParameters, '$.EpisodeFilterID');
		if @FilterEpisodeCode is not null
			BEGIN
				PRINT 'EP found'
				declare @FilterEpisode varchar(100) = JSON_query(@JSONParameters,('$.'+@FilterEpisodeCode));
				if exists(select * from OPENJSON(@FilterEpisode))
					begin
						set @EpisodeFound = 1;
						insert into @COAIDFilter 
						select COA.COAID
						from COA
						join (
							select '01|00|' + J.[value] as ParentCode --- << Need to create non-hard coded solution
							from 
								OPENJSON(@FilterEpisode) as J
						) as J
						on COA.ParentCode = J.ParentCode;
					end
			END
	end 

	if @EpisodeFound = 0
		begin
			insert into @COAIDFilter 
			select COA.COAID
			from COA		
		end
/* End Episodic */

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
			--join @COAIDFilter CF on JE.COAID = CF.COAID
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
		join @COAIDFilter CF on JE.COAID = CF.COAID
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