SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE  [dbo].[ReportsBankingCheckRegDetailReportJSON]
 
 @JSONparameters nvarchar(max)
AS
BEGIN

 SET NOCOUNT ON;

   --declare @JSONparameters nvarchar(max)='{"CRFilterCompany":["1"],"CRFilterLocation":null,"CRFilterSet":null,"BankName":"WELLS FARGO BANK","hdnBank":"1","Vendor":"","hdnVendorID":"","CheckFrom":"","CheckTO":"","Type":"Check","CR":"{\"ProdID\":\"14\",\"Filter\":\"1|1||||Check\",\"ProName\":\"EMS-Feature\",\"UserID\":\"59\"}","ProdId":"14","UserId":"59"}';
   --exec ReportsBankingCheckRegDetailReportJSON '{"CRFilterCompany":["1"],"CRFilterLocation":null,"CRFilterSet":null,"BankName":"WELLS FARGO BANK","hdnBank":"1","Vendor":"","hdnVendorID":"","CheckFrom":"","CheckTO":"","Type":"Check","CR":"{\"ProdID\":\"14\",\"Filter\":\"1|1||||Check\",\"ProName\":\"EMS-Feature\",\"UserID\":\"59\"}","ProdId":"14","UserId":"59"}';
 declare @CompanyID varchar(50)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.BankingCheckRunFilterCompany'),''),'[',''),']',''),'"','');
declare @ProdID int= isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @BankID varchar(50)= isnull(JSON_value(@JSONparameters,'$.hdnBank'),-1);
declare @VendorID varchar(50)= isnull(JSON_value(@JSONparameters,'$.hdnVendorID'),-1);
declare @CheckFrom varchar(50)= isnull(json_value(@JSONparameters,'$.CheckFrom'),'1900-01-01');
declare @CheckTo varchar(50)= isnull(json_value(@JSONparameters,'$.CheckTO'),'1900-01-01');
declare @CheckType varchar(50)= isnull(JSON_value(@JSONparameters,'$.Type'),'');


--select @CompanyID ,@ProdID ,@BankID ,@VendorID ,@CheckFrom ,@CheckTo ,@CheckType 

if(@CheckFrom='')
	begin
	 set @CheckFrom='0';
	 set @CheckTo='z';
	end

	declare @CID int;

	select @CID=CompanyID from Company where CompanyId=@CompanyID and ProdID=@ProdID;

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