SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[UpdatePaymentStatus]
	-- Add the parameters for the stored procedure here
	@Status nvarchar(50),
	@PaymentId nvarchar(max),
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update Payment set Status=@Status where PaymentId in(( SELECT * FROM dbo.SplitId(@PaymentId,','))) and ProdId=@ProdId
END



GO