SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[ReportVendorListingReportJson]
	-- Add the parameters for the stored procedure here
	@JSONparameters nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
--declare @JSONparameters nvarchar(max)='{"VendorListPeportDate":"09/03/2017","VendorNameFrom":"","VendorNameTo":"","txtVendorCompany":["07"],"VLFilterLocation":null,"VLFilterEpisode":null,"VLFilterFilterSet":null,"VendorCreatedFrom":"","VendorCreatedTo":"09/03/2017","VendorTrnsFrom":"","VendorModDateTo":"09/03/2017","txtVendorTypes":null,"VendorCountry":"","hdnVendorCountry":"","VendorState":"","VL":{"objRDF":{"ProdID":14,"VendorFrom":"","VendorTo":"","CompanyCode":"07","createdDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","VendorType":"","VendorCountry":"","VendorState":"","DefaultDropdown":"","W9OnFile":true,"W9NotOnFile":false},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170903","UserName":"59","Segment":"","SegmentOptional":"","TransCode":""}},"ProdId":"14","UserId":"59"}';

if ISJSON(@JSONparameters) is null return

--declare @objRDF nvarchar(500) = isnull(JSON_query(@JSONparameters,'$.objRDF'),-1);

declare @ProdId int = isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @UserID int = isnull(JSON_value(@JSONparameters,'$.UserId'),-1);
declare @VendorListPeportDate datetime = isnull(JSON_value(@JSONparameters,'$.VendorListPeportDate'),-1);
declare @VendorFrom nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorNameFrom'),-1);
declare @VendorTo nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorNameTo'),-1);
declare @CompanyCode nvarchar(30) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.txtVendorCompany'),''),'[',''),']',''),'"','');
declare @VLFilterLocation nvarchar(500) = isnull(JSON_query(@JSONparameters,'$.VLFilterLocation'),'');
declare @VLFilterEpisode nvarchar(500) = isnull(JSON_query(@JSONparameters,'$.VLFilterEpisode'),'');
declare @VLFilterFilterSet nvarchar(500) = isnull(JSON_query(@JSONparameters,'$.VLFilterFilterSet'),'');
declare @createdDateFrom datetime  = isnull(json_value(@JSONparameters,'$.VendorCreatedFrom'),'1900-01-01');
declare @CreatedDateTo datetime = isnull(JSON_value(@JSONparameters,'$.VendorCreatedTo'),getdate());
declare @VendorTrnsFrom nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorTrnsFrom'),-1);
declare @VendorModDateTo nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorModDateTo'),-1);
declare @VendorType nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.txtVendorTypes'),'');
declare @VendorCountry nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorCountry'),'');
declare @hdnVendorCountry nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.hdnVendorCountry'),'');
declare @VendorState nvarchar(500) = isnull(JSON_value(@JSONparameters,'$.VendorState'),'');
declare @W9OnFile bit=isnull(JSON_value(@JSONparameters,'$.VL.objRDF.W9OnFile'),0);
declare @W9NotOnFile bit= isnull(JSON_value(@JSONparameters,'$.VL.objRDF.W9NotOnFile'),0);

declare @TheSQL nvarchar(4000);
declare @tz INT;
	SET @tz = DBO.TZforProduction(DEFAULT);
	if(@createdDateFrom='')
		begin
			set @createdDateFrom= '01/01/1999';
		end
	if(@CreatedDateTo='')
		 begin
			set @CreatedDateTo= DATEADD(d, 2, GETDATE()) 
		end
	else
		begin
		set @CreatedDateTo=DATEADD(d, 2, @CreatedDateTo) 
	end

 set @TheSQL = '
 Select V.ProdID,V.VendorName,V.VendorID,V.VendorNumber,V.Type,V.Status,V.TaxID,V.TaxFormOnFile,V.RemitCountry,V.UseRemmitAddrs from tblVendor V
Left Outer  Join  CountryState CC on V.RemitState=CC.StateName and CC.Statetype=''State''
where ProdID='+cast(@ProdId as varchar)+'';





 If @VendorFrom <> ''
 begin
 --set @VendorFrom=' ';
 set @TheSQL = @TheSQL + ' and VendorName >= '+cast(@VendorFrom as varchar)+'';
 end

 if @Vendorto <> ''
 begin
 --set @Vendorto='~'
 set @TheSQL = @TheSQL + ' and VendorName <=  '+cast(@VendorTo as varchar)+'';
 end
 
 if @VendorCountry<>''
 begin
 set @TheSQL = @TheSQL + '
and (V.RemitCountry='+cast(@VendorCountry as nvarchar(20))+' or @VendorCountry='''')';
end
if @VendorState<>''
begin
 set @TheSQL = @TheSQL + '
 and (V.RemitState='+cast(@VendorState as nvarchar(20))+' or @VendorState='''') ';
 end

 if @VendorType<>''
begin
 set @TheSQL = @TheSQL + 'and (V.Type in (select * FROM dbo.SplitCSV('+cast(@VendorType as nvarchar(20))+','','')) OR @VendorType='''') ';
 end

 IF (@W9OnFile=1)
 set @TheSQL = @TheSQL + 'and (V.UseRemmitAddrs=1)'; 

  IF (@W9NotOnFile=1)
  set @TheSQL = @TheSQL + 'and (V.UseRemmitAddrs=1)'; 

 set @TheSQL=@TheSQL+' and dbo.TZfromUTC( V.CreatedDate,dbo.tzforproduction(0)) between ''' + 
 cast(@createdDateFrom as varchar) + ''' and ''' + cast(@CreatedDateTo as varchar) + '''';

set @TheSQL = @TheSQL + '
and  (V.COAId in (select COAId from COA where SS1  in (select  companycode from Company  where CompanyCode= '''+@CompanyCode+'''))  
)
order by VendorName
;'

print @TheSQL;
EXECUTE (@TheSQL)
END
GO