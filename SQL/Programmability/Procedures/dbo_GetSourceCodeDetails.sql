SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetSourceCodeDetails]
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  SourceCodeID,Code,Description,AP,JE,PO,PC,AR,PR,WT,isnull(Thirdparty,'') as Thirdparty,ProdID from SourceCode where ProdId=@ProdId
END



GO