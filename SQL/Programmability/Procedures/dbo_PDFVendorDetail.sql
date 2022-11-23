SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[PDFVendorDetail]  -- PDFVendorDetail 2,1
(
@PaymentID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 select c.PrintOncheckAS as Vendor,e.CompanyName,sum(a.InvoiceAmount) as AmountTotal,b.CheckNumber,CONVERT(varchar(10),b.CheckDate,101) as CDate
 ,c.VendorName,W9Address1,W9Address2,W9Address3,W9City, W9State,W9Zip,c.VendorID,
 ( select case when c.W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3, LEN(CS.StateCode))
  else W9State end) as StateCode
  from PaymentLine as a 
 inner join Payment as b on a.PaymentId=b.PaymentId
 inner join tblVendor as c on c.VendorId=b.VendorID
 inner join BankInfo as d on a.BankID=d.BankId and a.ProdId=d.Prodid
 inner join Company as e on e.CompanyID=d.CompanyId

  Left Outer join CountryState CS on c.W9State=CS.StateName and CS.Statetype='State' 

 where a.PaymentId=@PaymentID and a.BankID=@BankID
 group by c.PrintOncheckAS,e.CompanyName,c.VendorName,W9Address1,W9Address2,W9Address3,W9City,W9State,W9Zip,c.W9Country,
 CS.StateCode,b.CheckNumber,b.CheckDate,c.VendorID

END



GO