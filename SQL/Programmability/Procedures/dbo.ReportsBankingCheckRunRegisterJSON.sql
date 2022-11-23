SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[ReportsBankingCheckRunRegisterJSON]
--declare ReportsBankingCheckRunRegisterJSON '{"ProductionId":3,"ProductionName":"ACS","CompanyId":1,"CompanyName":null,"CompanyCode":"01","BankId":1,"BankName":null,"UserId":21,"UserName":null,"CreatedDateFrom":"0001-01-01T00:00:00","CreatedDateTo":"0001-01-01T00:00:00","PrintDateFrom":"2016-07-13T00:00:00","PrintDateTo":"2017-06-06T00:00:00","PeriodStatus":null,"BatchNumber":null,"SegmentString":null,"SegmentOptional":null,"FilterCriteriaCollection":",1","TransactionNumberFrom":null,"TransactionNumberTo":null,"PeriodNumberFrom":0,"PeriodNumberTo":0,"VendorId":null,"Status":null}'
@reportParametersJson as varchar(8000)
--ReportsBankingCheckRunRegisterJSON '{ "reportParametersJson":{"ProductionId":"14","CompanyCode":"07","UserId":"59","PrintDateFrom":"","PrintDateTo":"","CheckRunNumbers":"","BankId":"","ProductionName":"EMS-Feature"} }'
AS
BEGIN

	if ISJSON(@reportParametersJson) is null return
	declare @reportParameters varchar(8000) = @reportParametersJson;
	declare	@CompanyId varchar(50)=isnull(JSON_VALUE(@reportParameters,'$.CompanyCode'),-1);
	declare	@BankId int=JSON_VALUE(@reportParameters,'$.BankId');
	declare	@PrintDateFrom date=isnull(JSON_VALUE(@reportParameters,'$.PrintDateFrom'),'2017-01-01'); 
	declare	@PrintDateTo date = isnull(JSON_VALUE(@reportParameters,'$.PrintDateTo'), getdate()); 
	declare	@ProductionId varchar(50)=isnull(JSON_VALUE(@reportParameters,'$.ProductionId'),-1);
	declare	@CheckRunIdList VARCHAR(100) = Replace(Replace(isnull(JSON_QUERY(@reportParameters,'$.FilterCriteriaCollection'),''),'[',''),']','');
	declare	@UserId VARCHAR(100) = Replace(Replace(isnull(JSON_VALUE(@reportParameters,'$.UserId'),''),'[',''),']','');
	declare	@PeriodNumberFrom int= isnull(JSON_VALUE(@reportParameters,'$.PeriodNumberFrom'),0);
	declare	@PeriodNumberTo int=isnull(JSON_VALUE(@reportParameters,'$.PeriodNumberTo'),NULL);

	IF (@PeriodNumberTo IS NULL) SET @PeriodNumberTo = dbo.GetCurrentOpenPeriodID(@CompanyID,default);
	SET NOCOUNT ON;
	-- Time Zone
	declare @tz varchar(50);
	if exists(select * from TimeZone where UserID=cast(@ProductionId as int))
		begin select @tz=TimeDifference from TimeZone where UserID=cast(@ProductionId as int); end
	else 
		begin set @tz='07:00'; end 
	-- End Time Zone
	select @CompanyId=CompanyID from Company where ProdID=@ProductionId and CompanyCode=@CompanyId;
	if(@PrintDateFrom='')
	begin set @PrintDateFrom='0001-01-01'; end

	if(@PrintDateTo='')
	begin set @PrintDateTo='9999-01-01'; end
	If (@PeriodNumberFrom < 1 or @PeriodNumberFrom is null)
	begin set @PeriodNumberFrom=(select ClosePeriodID from ClosePeriod  where CompanyId=@CompanyId and CompanyPeriod=1); end
	
	If (@PeriodNumberTo < 1 or @PeriodNumberTo is null)
	begin set @PeriodNumberTo=dbo.GetCurrentOpenPeriodID(@CompanyId,default); end

	declare @PeriodStatus nvarchar(1000) = [dbo].[RangetoWhereInString](@PeriodNumberFrom,@PeriodNumberTo);

	if(@CheckRunIdList='')
	begin
		select distinct a.CheckRunID,a.BankID,e.ClosePeriodId from CheckRun	as a 
		inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
		inner join Payment as c  on b.PaymentID=c.PaymentId
		inner join PaymentLine as d on c.PaymentId=d.PaymentId
		inner join Invoice as e on d.InvoiceId=e.Invoiceid
		where a.ProdID=@ProductionId
		and a.StartDate-cast(@tz as datetime) between @PrintDateFrom and @PrintDateTo 
		and(a.BankID=@BankId  OR @BankId = '')
		and(e.CompanyID=@CompanyId  OR @CompanyId = '')
		and (e.ClosePeriodId between @PeriodNumberFrom and @PeriodNumberTo OR e.ClosePeriodId = 0)
		and a.Status not in ('working','CANCELED') 
		order by CheckRunID
	end
	else 
	begin
		select distinct a.CheckRunID,a.BankID,e.ClosePeriodId from CheckRun	as a 
		inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
		inner join Payment as c  on b.PaymentID=c.PaymentId
		inner join PaymentLine as d on c.PaymentId=d.PaymentId
		inner join Invoice as e on d.InvoiceId=e.Invoiceid
		where a.ProdID=@ProductionId  and a.StartDate between @PrintDateFrom and @PrintDateTo 
		and(a.BankID=@BankId  OR @BankId = '') and(e.CompanyID=@CompanyId  OR @CompanyId = '')
		and a.CheckRunID  in(SELECT items as S1 FROM dbo.SplitId(@CheckRunIdList,','))
		and (e.ClosePeriodId between @PeriodNumberFrom and @PeriodNumberTo OR e.ClosePeriodId = 0)
		order by CheckRunID
	end
END

GO