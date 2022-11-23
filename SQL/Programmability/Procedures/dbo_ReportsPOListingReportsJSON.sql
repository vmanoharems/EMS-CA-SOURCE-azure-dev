--exec ReportsPOListingReportsJSON '{ "reportparameters":{"ProdId":14,"CompanyId":1,"PeriodNoFrom":"","PeriodNoTo":"","CreateDateFrom":"","CreateDateTo":"","PoNoFrom":"","PoNoTo":"","VendorId":"","Batch":"","UserName":"","POStatus":"","LocationSubTotal":false,"EpisodeSubTotal":false}}'


CREATE PROCEDURE [dbo].[ReportsPOListingReportsJSON]
--ReportsPOListingReportsJSON '{ "reportparameters":{ "ProdID":"14", "CompanyID":1, "PeriodNoFrom":"", "PeriodNoTo":"", "CreateDateFrom":"", "CreateDateTo":"04/11/2017", "PoNoFrom":"", "PoNoTo":"", "VendorID":[], "Batchnumber":[], "Username":[], "POStatus":""} }'

--declare @JSONparameters as varchar(max) = '{ "reportparameters":{"ProdId":14,"CompanyId":1,"PeriodNoFrom":"","PeriodNoTo":"","CreateDateFrom":"","CreateDateTo":"","PoNoFrom":"","PoNoTo":"","VendorId":"","Batch":"","UserName":"","POStatus":"","LocationSubTotal":false,"EpisodeSubTotal":false}}'
--declare @JSONparameters as varchar(max) = '{"ProdId":14,"CompanyId":1,"PeriodNoFrom":"","PeriodNoTo":"","CreateDateFrom":"","CreateDateTo":"","PoNoFrom":"","PoNoTo":"","VendorId":"","Batch":"","UserName":"","POStatus":"","LocationSubTotal":false,"EpisodeSubTotal":false}'
@JSONparameters as varchar(8000)
AS
BEGIN
	SET NOCOUNT ON;
	if ISJSON(@JSONparameters) is null return

	declare @reportParameters varchar(8000) = @JSONparameters; --JSON_QUERY(@JSONparameters,'$.reportparameters'); -- Start by pulling the reportparameters from the JSON
--	print @reportparameters;

	declare	@ProdId int = isnull(JSON_VALUE(@reportParameters,'$.ProdId'),-1);
	declare	@CompanyId int = isnull(JSON_VALUE(@reportParameters,'$.CompanyId'),-1);
	declare	@PeriodNoFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.PeriodNoFrom'),'');
	declare	@PeriodNoTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.PeriodNoTo'),'');
	declare	@CreateDateFrom date = isnull(JSON_VALUE(@reportParameters,'$.CreateDateFrom'),'2017-01-01'); 
	declare	@CreateDateTo date = isnull(JSON_VALUE(@reportParameters,'$.CreateDateTo'), getdate()); 
	declare	@PoNoFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.PoNoFrom'),'');
	declare	@PoNoTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.PoNoTo'),'');
	declare	@VendorId nvarchar(50) = Replace(Replace(isnull(JSON_QUERY(@reportParameters,'$.VendorID'),''),'[',''),']','');
	declare	@Batch nvarchar(50) = Replace(Replace(Replace(isnull(JSON_QUERY(@reportParameters,'$.Batchnumber'),''),'[',''),']',''),'"','''');
	declare	@UserName nvarchar(50) = Replace(Replace(isnull(JSON_VALUE(@reportParameters,'$.Username'),''),'[',''),']','');
	declare	@POStatus nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.POStatus'),'');
	declare	@LocationSubTotal bit = isnull(JSON_VALUE(@reportParameters,'$.LocationSubTotal'),0);
	declare	@EpisodeSubTotal bit = isnull(JSON_VALUE(@reportParameters,'$.EpisodeSubTotal'),0);

	if(@CreateDateTo ='1900-01-01') set @CreateDateTo = getdate();  -- Meaning, we didn't receive a CreateDateTo
	-- Dynamic SQL does not work well with EntityFramework auto creation of classes
	declare @sql varchar(8000) = N'
	select P.POID, P.PONumber,P.BalanceAmount from PurchaseOrder P
	left  join tblVendor V on V.VendorID = P.VendorID
	left  join ClosePeriod c on c.ClosePeriodId=P.ClosePeriodId
	where P.ProdID=' + cast(@ProdId as varchar)
		+ ' and p.CompanyID=' + cast(@CompanyId as varchar)
		+ ' and dbo.TZfromUTC( P.CreatedDate,dbo.tzforproduction(0)) between ''' + cast(@CreateDateFrom as varchar) + ''' and ''' + cast(@CreateDateTo as varchar) + ''''

	if @VendorID <> ''
		set @sql = @sql + ' and (P.VendorID in (' + @VendorID +'))' --(select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
	if @Batch <> ''
		set @sql = @sql + ' and (P.BatchNumber in (' + @Batch + '))' --select * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='')
	if @Username <> ''
		set @sql = @sql + ' and (P.UserID in (' + @Username + '))' 
	if @POStatus <> ''
		set @sql = @sql + ' and (P.Status = ''' + @POStatus + ''')' 

print @sql;
--	EXECUTE (@sql)

--return
	select P.POID, P.PONumber,P.BalanceAmount from PurchaseOrder P
	left  join tblVendor V on V.VendorID = P.VendorID
	left  join ClosePeriod c on c.ClosePeriodId=P.ClosePeriodId
	where P.ProdID = @ProdId
		and p.CompanyID = @CompanyId
		and dbo.TZfromUTC(P.CreatedDate,dbo.tzforproduction(0)) between @CreateDateFrom and @CreateDateTo
		and (
			(@VendorID = '')
			OR P.VendorID in (select * FROM dbo.SplitCSV(@VendorID,','))
			)
		and (
			(@Batch = '')
			OR P.BatchNumber in (select * FROM dbo.SplitCSV(@Batch,','))
			)
		and (P.Status = @POStatus or @POStatus = '')
	order by P.PONumber
	;

END
GO