SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckPONumber]
	-- Add the parameters for the stored procedure here
	@PONumber nvarchar(20),
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if exists(select *  from PurchaseOrder where PONumber=@PONumber and ProdID=@ProdId)
	begin
	select 0
	end
	else
	begin
	select 1
	end
END



GO