SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[UpdatePOStatusClose]
	-- Add the parameters for the stored procedure here
	@POId int,
	@prodId	int,
	@status nvarchar(20)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@status='Closed')
	begin

	update PurchaseOrder set Status='Closed' where POID=@POId and ProdID=@prodId
	end
	else
	begin
	update PurchaseOrder set Status='Open' where POID=@POId and ProdID=@prodId
	end
END



GO