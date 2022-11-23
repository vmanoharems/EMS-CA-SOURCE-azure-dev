SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--JEAuditReportFilter 14,1,'0','2016-08-01 18:43:07.620','2017-12-13 18:52:43.880','','','','','Posted'
CREATE PROCEDURE [dbo].[JEAuditReportFilter]  
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

 if(@Status='Posted')
	begin
		select * From JournalEntry JD 
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




	select * From JournalEntry JD 
	where (JD.CompanyId=@CompanyId or @CompanyId = '')
	and JD.Prodid=@ProdId  
	and cast(jd.EntryDate as date) between @CreateDateFrom and @CreatedDateTo
	and cast(jd.TransactionNumber as int) between cast(@TransactionFrom  as int)  and cast( @TranasactionTo as int)
	and (JD.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
	and (JD.CreatedBy in (select * FROM dbo.SplitCSV(@UserName,',')) OR @UserName='')
	and jd.AuditStatus in('Audit','Saved')
	and JD.Source in ('JE','PR')  
	--and JD.ClosePeriod in(select * FROM dbo.SplitCSV(@PeriodStatus,','))
	and (JD.ClosePeriod <=@PrId1 or JD.ClosePeriod=@PrId2)
	Order By
	JD.JournalEntryID

end

END
GO