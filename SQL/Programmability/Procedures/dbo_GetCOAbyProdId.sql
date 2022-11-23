SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCOAbyProdId] -- GetCOAbyProdId 3,' '
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@COAString nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	select * from COA where ProdId=@ProdId and COACode like '%'+@COAString+'%' order by COACode
	
END



GO