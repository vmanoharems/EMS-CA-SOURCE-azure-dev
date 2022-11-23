SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetSourceCodeBySource]
	-- Add the parameters for the stored procedure here
	@prodId int,
	@Source nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select *from SourceCode where ProdID=@prodId and Code=@Source
END



GO