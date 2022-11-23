SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[ReportsVendorFolderReportJSON]
	@JSONparameters nvarchar(max)
AS
BEGIN

	SET NOCOUNT ON;
-- declare @JSONparameters nvarchar(max)='{"VendorListPeportDate":"09/03/2017","VendorNameFrom":"","VendorNameTo":"","txtVendorCompany":["07"],"VLFilterLocation":null,"VLFilterEpisode":null,"VLFilterFilterSet":null,"VendorCreatedFrom":"","VendorCreatedTo":"09/03/2017","VendorTrnsFrom":"","VendorModDateTo":"09/03/2017","txtVendorTypes":null,"VendorCountry":"","hdnVendorCountry":"","VendorState":"","objRDF":{"ProdID":14,"VendorFrom":"","VendorTo":"","CompanyCode":"07","createdDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","VendorType":"","VendorCountry":"","VendorState":"","W9OnFile":false,"W9NotOnFile":false},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"","SegmentOptional":"","TransCode":""},"VenFol":{"objRDF":{"ProdID":14,"VendorFrom":"","VendorTo":"","CompanyCode":"07","createdDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","VendorType":"","VendorCountry":"","VendorState":"","W9OnFile":false,"W9NotOnFile":false},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"","SegmentOptional":"","TransCode":""}},"ProdId":"14","UserId":"59"}';
-- exec ReportsVendorFolderReportJSON '{"VendorListPeportDate":"09/03/2017","VendorNameFrom":"","VendorNameTo":"","txtVendorCompany":["07"],"VLFilterLocation":null,"VLFilterEpisode":null,"VLFilterFilterSet":null,"VendorCreatedFrom":"","VendorCreatedTo":"09/03/2017","VendorTrnsFrom":"","VendorModDateTo":"09/03/2017","txtVendorTypes":null,"VendorCountry":"","hdnVendorCountry":"","VendorState":"","objRDF":{"ProdID":14,"VendorFrom":"","VendorTo":"","CompanyCode":"07","createdDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","VendorType":"","VendorCountry":"","VendorState":"","W9OnFile":false,"W9NotOnFile":false},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"","SegmentOptional":"","TransCode":""},"VenFol":{"objRDF":{"ProdID":14,"VendorFrom":"","VendorTo":"","CompanyCode":"07","createdDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","VendorType":"","VendorCountry":"","VendorState":"","W9OnFile":false,"W9NotOnFile":false},"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"","SegmentOptional":"","TransCode":""}},"ProdId":"14","UserId":"59"}';
  
  declare @ProdID int= isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @VendorFrom nvarchar(20)= isnull(JSON_value(@JSONparameters,'$.VendorNameFrom'),-1);
declare @VendorTo nvarchar(20)= isnull(JSON_value(@JSONparameters,'$.VendorNameTo'),-1);
declare @CompanyCode nvarchar(20)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.txtVendorCompany'),''),'[',''),']',''),'"','');
declare @createdDateFrom date = isnull(json_value(@JSONparameters,'$.VendorCreatedFrom'),'1900-01-01');
declare @CreatedDateTo date = isnull(json_value(@JSONparameters,'$.VendorCreatedTo'),'1900-01-01');
declare @VendorType nvarchar(50)= isnull(JSON_value(@JSONparameters,'$.txtVendorTypes'),'');
declare @VendorCountry nvarchar(20) = isnull(JSON_value(@JSONparameters,'$.VendorCountry'),'');
declare @VendorState nvarchar(20) = isnull(JSON_value(@JSONparameters,'$.VendorState'),'');
declare @W9OnFile bit=isnull(JSON_value(@JSONparameters,'$.VL.objRDF.W9OnFile'),0);
declare @W9NotOnFile bit= isnull(JSON_value(@JSONparameters,'$.VL.objRDF.W9NotOnFile'),0);
declare @UserID int = isnull(JSON_value(@JSONparameters,'$.UserId'),-1);


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

	 set @TheSQL ='Select V.ProdID,left(V.VendorName,60) as VendorName,V.VendorID,V.VendorNumber 
from tblVendor V
Left Outer  Join  CountryState CC on V.RemitState=CC.StateName and CC.Statetype=''State''
where ProdID =@Prodid ';

 If @VendorFrom <> ''
 begin
 --set @VendorFrom=' ';
 set @TheSQL = @TheSQL + ' and VendorName >= @VendorFrom ';
 end

 if @Vendorto <> ''
 begin
 --set @Vendorto='~'
 set @TheSQL = @TheSQL + ' and VendorName <= @VendorTo ';
 end

set @TheSQL = @TheSQL + '
	 and( DBO.TZFROMutc(V.CreatedDate,@tz) between @createdDateFrom and @CreatedDateTo)
and (V.RemitCountry=@VendorCountry or @VendorCountry='''')
and (V.RemitState=@VendorState or @VendorState='''') 
and (V.Type in (select * FROM dbo.SplitCSV(@VendorType,'','')) OR @VendorType='''')
and (V.UseRemmitAddrs=@W9OnFile or @W9OnFile='''') 
and (V.UseRemmitAddrs=@W9NotOnFile or @W9NotOnFile='''') 
and  (V.COAId in (select COAId from COA where SS1  in (select  companycode from Company  where CompanyCode=@CompanyCode))  or @CompanyCode='''')
order by VendorName;'

declare @ParamDefinition nvarchar(4000) = '
@ProdID int,
@VendorFrom nvarchar(20),
@VendorTo nvarchar(20),
@CompanyCode nvarchar(20),
@createdDateFrom date,
@CreatedDateTo date,
@VendorType nvarchar(50),
@VendorCountry nvarchar(20),
@VendorState nvarchar(20),
@W9OnFile bit,
@W9NotOnFile bit,
@UserID int,
@tz  varchar(50)';

exec sp_Executesql @TheSQL,@ParamDefinition,
@ProdID=@ProdID,
@VendorFrom =@VendorFrom,
@VendorTo =@VendorTo ,
@CompanyCode =@CompanyCode ,
@createdDateFrom=@createdDateFrom,
@CreatedDateTo =@CreatedDateTo ,
@VendorType =@VendorType,
@VendorCountry =@VendorCountry,
@VendorState=@VendorState,
@W9OnFile=@W9OnFile,
@W9NotOnFile=@W9NotOnFile,
@UserID=@UserID,
@tz=@tz;
 
	
END
GO