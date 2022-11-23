SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[CheckRegisterFilter]    -- exec CheckRegisterFilter '',53,'','','','',''
(
@CompanyID varchar(50),
@ProdID int,
@BankID varchar(50),
@VendorID varchar(50),
@CheckFrom varchar(50),
@CheckTo varchar(50),
@CheckType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	if(@CheckFrom='')
	begin
	 set @CheckFrom='0';
	 set @CheckTo='z';
	end

	declare @CID int;

	select @CID=CompanyID from Company where CompanyCode=@CompanyID and ProdID=@ProdID;

	select a.CheckNumber,CONVERT(varchar(10),a.PaymentDate,101) as PaymentDate,a.PayBy,e.VendorName,c.CompanyID,
	 [dbo].[GetCheckAmount](a.CheckNumber,a.BankId) as  HeaderAmount,a.PaidAmount,a.BankId,f.Bankname,g.TransactionNumber
	 ,g.DocumentNo,g.Description,i.SS2,j.AccountCode,d.Amount,
	 d.TaxCode, isnull(k.AccountCode,'') as SetCode,d.Transactionstring,
	 dbo.convertcodes(d.Transactionstring)as TransactionvalueString,g.ReferenceNumber,d.invoicelineid
	 ,a.Status
	 from Payment as a inner join 
	 PaymentLine as b on a.PaymentId=b.PaymentId 
	 inner join Invoice as c on b.InvoiceId=c.Invoiceid
	 inner join InvoiceLine as d on c.Invoiceid=d.InvoiceID
	 inner join tblVendor as e on a.VendorId=e.VendorID
	 inner join BankInfo as f on a.BankId=f.BankId
	 inner join JournalEntry as g on a.PaymentId=g.ReferenceNumber and g.SourceTable='Payment'
	  inner join JournalEntry as z on b.InvoiceID=g.InvoiceIDpayment 
	 inner join COA as i on d.COAId=i.COAID
	 inner join TblAccounts as j on i.AccountId=j.AccountId
	 left join TblAccounts as k on d.SetId=k.AccountId
	 
	where a.ProdID=@prodId and(a.BankId=@BankID  OR @BankID = '') and(c.CompanyID=@CID  OR @CompanyID = '')
	and (a.VendorID=@VendorID  OR @VendorID = '') and a.CheckNumber between @CheckFrom and @CheckTo 
	and (a.PayBy=@CheckType  OR @CheckType = '')
	 
   group by a.CheckNumber,a.PaymentDate,a.PayBy,e.VendorName,c.CompanyID,a.PaidAmount,a.BankId,f.Bankname,
   g.TransactionNumber,g.DocumentNo,g.Description	,i.SS2,j.AccountCode,d.Amount,d.TaxCode
   ,k.AccountCode,d.Transactionstring,g.ReferenceNumber,d.invoicelineid,a.Status

   order by a.CheckNumber

END




GO