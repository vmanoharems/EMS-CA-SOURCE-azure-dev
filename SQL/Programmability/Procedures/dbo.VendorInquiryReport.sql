CREATE PROCEDURE [dbo].[VendorInquiryReport] ---  VendorInquiryReport '3','','','','','','','','','','',''
	
@ProdID int,
@VendorFrom nvarchar(20),
@VendorTo nvarchar(20),
@CompanyCode nvarchar(5),
@createdDateFrom datetime,
@CreatedDateTo datetime,
@VendorType nvarchar(20),
@VendorCountry nvarchar(20),
@VendorState nvarchar(20),
@DefaultDropdown nvarchar(20),
@W9OnFile bit,
@W9NotOnFile bit
AS
BEGIN

declare @TheSQL nvarchar(4000);
declare @WhereClause varchar(4000) = '';

declare @tz INT;

	SET @tz = DBO.TZforProduction(DEFAULT);

	if(isnull(@createdDateFrom,'') = '')
		begin
			set @createdDateFrom= '2000-01-01';
		end
	
	if (isnull(@CreatedDateTo,'') = '')
		begin
			set @CreatedDateTo= DATEADD(d, 2, GETDATE()) 
		end
	else
		begin
			set @CreatedDateTo=DATEADD(d, 2, @CreatedDateTo) 
		end
	If @VendorFrom <> ''
		begin
			set @WhereClause = @WhereClause + ' and V.VendorName >= @VendorFrom ';
		end

	if @Vendorto <> ''
		begin
			set @WhereClause = @WhereClause + ' and V.VendorName <= @VendorTo ';
		end

 set @WhereClause = @WhereClause + '
	 and( DBO.TZFROMutc(V.CreatedDate,@tz) between @createdDateFrom and @CreatedDateTo)
	 and (V.RemitCountry=@VendorCountry or @VendorCountry='''')
	 and (V.RemitState=@VendorState or @VendorState='''') 
	 and (V.Type in (select * FROM dbo.SplitCSV(@VendorType,'','')) OR @VendorType='''')
	 and (V.DefaultDropdown in (select * FROM dbo.SplitCSV(@DefaultDropdown,'','')) OR @DefaultDropdown='''')
	 and (V.UseRemmitAddrs =@W9OnFile or @W9OnFile='''' )
	 and (V.UseRemmitAddrs =@W9NotOnFile or @W9NotOnFile='''' )
';

 set @TheSQL = '

	 select p.paymentId,v.VendorNumber,v.Type,v.vendorname,
	 p.checkNumber,b.Invoiceid,b.InvoiceNumber,p.Memo,BI.BankName,p.CheckDate,
	 b.CurrentBalance as InvoiceTotal,a.COAstring,a.COAID,a.Transactionstring,
	 dbo.convertcodes(a.TransactionString) as TransStr,a.Amount as LineAmount,
	 JE.TransactionNumber,JE.Source,a.LineDescription ,cast(JE.TransactionNumber as int) as a  
	 from InvoiceLine  a inner join Invoice   b on a.InvoiceID=b.Invoiceid Inner Join PaymentLine
	 c on c.InvoiceId=b.Invoiceid  Inner join Payment  p on c.PaymentId=p.PaymentId 
	 inner join BankInfo BI on BI.BankId=b.BankId
	 inner Join tblVendor v on v.VendorID=b.VendorId 
	 Inner Join JournalEntry JE on p.PaymentID=JE.ReferenceNumber and JE.SourceTable=''Payment''
	 and JE.InvoiceIdPayment=b.Invoiceid
	 where  p.Status in(''Printed'', ''Voided'')
	  and v.ProdID =@ProdID
	  ';
	set @TheSQL = @TheSQL + @WhereClause;

	set @TheSQL = @TheSQL + '
	 Union all

		 select 0 as paymentId,v.VendorNumber,v.Type,v.vendorname,'''' as checkNumber,b.Invoiceid,b.InvoiceNumber,'''' as Memo,BI.BankName,'''' as CheckDate,
		 b.CurrentBalance as InvoiceTotal,a.COAstring,a.COAID,a.Transactionstring,dbo.convertcodes(a.TransactionString) as TransStr,a.Amount as LineAmount,JE.TransactionNumber,
		 JE.Source,a.LineDescription,cast(JE.TransactionNumber as int) as a  
		 from InvoiceLine  a inner join Invoice   b on a.InvoiceID=b.Invoiceid 
		 inner join BankInfo BI on BI.BankId=b.BankId
		 inner Join tblVendor v on v.VendorID=b.VendorId 
		 Inner Join JournalEntry JE on b.Invoiceid=JE.ReferenceNumber and JE.SourceTable=''Invoice''
  
	 where  b.InvoiceId not In (select  InvoiceId from PaymentLine where paymentId in (select  PaymentId from Payment  where  Status in(''Printed'',''Voided'')))
	 and v.ProdID =@ProdID ';

	set @TheSQL = @TheSQL + @WhereClause;
	set @TheSQL = @TheSQL + ' Order By v.VendorName,cast(JE.TransactionNumber as int),a.COAstring asc;';


 --print @theSQL

	declare @ParamDefinition nvarchar(4000) = '
	@ProdID int,
	@VendorFrom nvarchar(20),
	@VendorTo nvarchar(20),
	@CompanyCode nvarchar(5),
	@createdDateFrom datetime,
	@CreatedDateTo datetime,
	@VendorType nvarchar(20),
	@VendorCountry nvarchar(20),
	@VendorState nvarchar(20),
	@DefaultDropdown nvarchar(20),
	@W9OnFile bit,
	@W9NotOnFile bit,
	@tz  varchar(50)';

	exec sp_Executesql @TheSQL,@ParamDefinition,
	@ProdID=@ProdID,
	@VendorFrom =@VendorFrom,
	@VendorTo =@VendorTo,
	@CompanyCode = @CompanyCode,
	@createdDateFrom =@createdDateFrom,
	@CreatedDateTo =@CreatedDateTo,
	@VendorType=@VendorType,
	@VendorCountry =@VendorCountry,
	@VendorState =@VendorState,
	@DefaultDropdown =@DefaultDropdown,
	@W9OnFile =@W9OnFile,
	@W9NotOnFile =@W9NotOnFile,
	@tz=@tz;
end
GO