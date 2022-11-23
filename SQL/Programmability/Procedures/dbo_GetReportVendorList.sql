CREATE PROCEDURE [dbo].[GetReportVendorList] --- GetReportVendorList 66,'','','','','','','','','','','39'
@ProdID int	,
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
@UserID int

AS
BEGIN


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
where ProdID=@ProdID';

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
and  (V.COAId in (select COAId from COA where SS1  in (select  companycode from Company  where companyid=@CompanyCode))  or @CompanyCode='''')
order by VendorName
;'

--print @TheSQL;

declare @ParamDefinition nvarchar(4000) = '@ProdID int,
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
@ProdID=@ProdID ,
@VendorFrom=@VendorFrom ,
@VendorTo=@VendorTo ,
@CompanyCode=@CompanyCode ,
@createdDateFrom=@createdDateFrom ,
@CreatedDateTo=@CreatedDateTo ,
@VendorType=@VendorType ,
@VendorCountry=@VendorCountry ,
@VendorState=@VendorState,
@W9OnFile=@W9OnFile,
@W9NotOnFile=@W9NotOnFile,
@UserID=@UserID,
@tz=@tz
; 

--select @TheSQL, @ParamDefinition,@tz,@CreatedDateFrom,@CreatedDateTo

END






GO