SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPaymentList] -- GetPaymentList 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select CheckNumber,PaymentId,convert(varchar(10),CheckDate,110) as CheckDate,v.VendorName,p.Status,PaidAmount,(select count(*)from PaymentLine where PaymentID=p.PaymentId)as LineCount from Payment p
	inner join tblVendor v on v.VendorID=p.VendorId
	 where p.ProdId=@ProdId
END



GO