SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeleteSegmentByProdId] -- DeleteSegmentByProdId 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from Segment where Classification<>'Company' and ProdId=@ProdId
	delete from SegmentLedger where ProdId=@ProdId;
END


GO