 CREATE proc [dbo].[ReportsLedgerJEPostingJSON]
  @JSONparameters varchar(8000) --'{"ReportDate":"09/03/2017","JEPostingFilterCompany":["1"],"JEPostingFilterLocation":null,"JEPostingFilterSet":null,"txtJEPostingPeriodStatus":null,"CreatedDateJEPostingFrom":"","PostedDateJEPostingTo":"09/03/2017","JEPostingTransFrom":"","JEPostingTransTo":"","BatchJEPosting":null,"JEPostingUserName":null,"JE":{"objRDF":{"ProdId":"14","CompanyId":1,"PeriodStatus":"","CreateDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","TransactionFrom":"","TranasactionTo":"","BatchNumber":"","UserName":"","Status":"Posted"},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"}},"ProdId":"14","UserId":"59","Status":"Posted"}'
	AS
	BEGIN
    if ISJSON(@JSONparameters) is null return;	

	--declare @reportParameters varchar(8000) = @JSONparameters; --JSON_QUERY(@JSONparameters,'$.reportparameters'); -- Start by pulling the reportparameters from the JSON
	declare	@ProdId int = isnull(JSON_VALUE(@JSONparameters,'$.ProdId'),-1);
	declare	@CompanyId int =0;
	set @CompanyId= Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.JEPostingFilterCompany'),''),'[',''),']',''),'"','');
	if(@CompanyId=0)
	set @CompanyId= Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.JEAuditFilterCompany'),''),'[',''),']',''),'"','');

	declare @PeriodStatus nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.JE.objRDF.PeriodStatus'),''); 
	declare	@CreateDateFrom date = isnull(JSON_VALUE(@JSONparameters,'$.CreatedDateJEPostingFrom'),''); 
	declare	@CreatedDateTo date = isnull(JSON_VALUE(@JSONparameters,'$.PostedDateJEPostingTo'), getdate()); 
	declare	@TransactionFrom nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.JEPostingTransFrom'),'0');
	declare	@TranasactionTo nvarchar(100) = isnull(JSON_VALUE(@JSONparameters,'$.JEPostingTransTo'),'999999999');
	declare	@BatchNumber nvarchar(100) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.BatchJEPosting'),''),'[',''),']',''),'"','');
	declare	@UserName nvarchar(100) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.JEPostingUserName'),''),'[',''),']',''),'"','');
	declare	@Status nvarchar(50) =isnull(JSON_VALUE(@JSONparameters,'$.JE.objRDF.Status'),''); 
	


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
	set @CreatedDateTo= dateadd(DD, 1, getdate());
	end
 else
	begin
	set @CreatedDateTo= dateadd(DD, 1, @CreatedDateTo);
	end

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
		select JD.* 
		From JournalEntry JD 
		join (
			select JED.journalEntryID from JournalEntryDetail JED
			join @COAIDFilter COA on JED.COAID = COA.COAID
			group by JED.JournalEntryID
		) JEDF 
		on JD.JournalEntryID = JEDF.JournalEntryID
		where (JD.CompanyId=@CompanyId or @CompanyId = '')
		and JD.Prodid=@ProdId  
		and cast(jd.EntryDate as date) between @CreateDateFrom and @CreatedDateTo
		and cast(jd.TransactionNumber as int) between cast(@TransactionFrom  as int)  and cast( @TranasactionTo as int)
		and (JD.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
		and (JD.CreatedBy in (select * FROM dbo.SplitCSV(@UserName,',')) OR @UserName='')
		and jd.AuditStatus=@Status
		and JD.Source in ('JE','PR','WT') 
		--and JD.ClosePeriod in(select ClosePeriodid from ClosePeriod where CompanyId=@CompanyId and PeriodStatus=@PeriodStatus) 
		and (JD.ClosePeriod in (select * FROM dbo.SplitCSV(@PeriodStatus,',')) OR @PeriodStatus='')
		Order By
		JD.JournalEntryID
	end

else 

begin

	declare @PrId1 int,@PrId2 int
	set @PrId1=0;set @PrId2=0;
	if(@PeriodStatus='Current')
	begin
		set @PrId1=dbo.GetCurrentOpenPeriodID(@CompanyId,default); --(select ClosePeriodId  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Current')
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


	select JD.* From JournalEntry JD 
		join (
			select JED.journalEntryID from JournalEntryDetail JED
			join @COAIDFilter COA on JED.COAID = COA.COAID
			group by JED.JournalEntryID
		) JEDF 
		on JD.JournalEntryID = JEDF.JournalEntryID
	where 
	jd.AuditStatus in('Audit','Saved')
	and JD.Source in ('JE','PR')  
	and (JD.CompanyId=@CompanyId or @CompanyId = '')
	and JD.Prodid=@ProdId  
	and cast(jd.EntryDate as date) between @CreateDateFrom and @CreatedDateTo
	and cast(jd.TransactionNumber as int) between cast(@TransactionFrom  as int)  and cast( @TranasactionTo as int)
	and (JD.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
	and (JD.CreatedBy in (select * FROM dbo.SplitCSV(@UserName,',')) OR @UserName='')
	--and JD.ClosePeriod in(select * FROM dbo.SplitCSV(@PeriodStatus,','))
	and (JD.ClosePeriod <=@PrId1 or JD.ClosePeriod=@PrId2)
	Order By
	JD.JournalEntryID

end

END
GO

