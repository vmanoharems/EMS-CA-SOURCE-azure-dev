SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetPOLinesNotInInvoice] --- GetPOLinesNotInInvoice 1,3,4074
	-- Add the parameters for the stored procedure here
	@POID int,
@ProdID int,
@VendorId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@VendorId=0)
	begin
	 select POlineID,p.POID,pp.PONumber,COAID,(p.AvailToRelieve) as Amount,LineDescription,POLinestatus,COAString,
	 Transactionstring,CONVERT(varchar(10),p.CreatedDate,101) as CreatedDate,dbo.convertcodes(TransactionString) as TransStr ,ThirdPartyVendor,

	 isnull(SetID,'')as SetID ,
	isnull( t.AccountCode,'') as SetCode,
	isnull(SeriesID,'')as SeriesID ,
	isnull(  TT.AccountCode,'') as SeriesCode,TaxCode
	 from PurchaseOrderLine p
	 left outer join TblAccounts T on  t.AccountId=p.SetID
	left outer join TblAccounts  TT on TT.AccountId=p.SeriesID
	inner join PurchaseOrder pp on pp.POID=p.POID
	 where p.POID=@POID
	 and p.ProdID=@ProdID  and    p.POlineID not  in (select POlineID from InvoiceLine where AvailToRelieve=0)

	 order by 1
	 end
	 else
	 begin
	  select POlineID,p.POID,pp.PONumber,COAID,(p.AvailToRelieve) as Amount,LineDescription,POLinestatus,COAString,
	 Transactionstring,CONVERT(varchar(10),p.CreatedDate,101) as CreatedDate,dbo.convertcodes(TransactionString) as TransStr ,ThirdPartyVendor,

	 isnull(SetID,'')as SetID ,
	isnull( t.AccountCode,'') as SetCode,
	isnull(SeriesID,'')as SeriesID ,
	isnull(  TT.AccountCode,'') as SeriesCode,TaxCode
	 from PurchaseOrderLine p
	 left outer join TblAccounts T on  t.AccountId=p.SetID
	left outer join TblAccounts  TT on TT.AccountId=p.SeriesID
	inner join PurchaseOrder pp on pp.POID=p.POID
	
	 where pp.VendorID=@VendorId
	 and p.ProdID=@ProdID  and    p.POlineID not  in (select POlineID from InvoiceLine where AvailToRelieve=0)

	 order by 1
	 
	 end

END




GO