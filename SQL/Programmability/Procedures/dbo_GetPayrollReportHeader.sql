SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollReportHeader]
(
@PayrollFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	

 select InvoiceNumber, CONVERT(varchar(10),a.EndDate,101) as EndDate,b.CompanyName,a.RunDateTime,c.VendorName from PayrollFile as a 
 inner join Company as b on a.CompanyID=b.CompanyID
 left join tblVendor as c on a.VendorID=c.VendorID
  where a.PayrollFileID=@PayrollFileID

END



GO