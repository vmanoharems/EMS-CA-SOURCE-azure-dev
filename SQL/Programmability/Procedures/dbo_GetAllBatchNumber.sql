SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetAllBatchNumber]  ---   GetAllBatchNumber 3
	-- Add the parameters for the stored procedure here
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select distinct( BatchNumber),ProdId from BatchNumbers where ProdId = @ProdId and BatchNumber is not null
END



GO