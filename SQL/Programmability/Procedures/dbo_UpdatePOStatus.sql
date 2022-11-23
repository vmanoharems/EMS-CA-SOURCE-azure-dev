SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdatePOStatus] --UpdatePOStatus '1,2'
	-- Add the parameters for the stored procedure here
	@InvoiceId nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update Invoice set InvoiceStatus='Posted' where Invoiceid in (( SELECT * FROM dbo.SplitId(@InvoiceId,',')))
END



GO