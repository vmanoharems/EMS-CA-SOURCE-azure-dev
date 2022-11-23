SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetAccontType]

@ProdId int
AS
BEGIN

	SET NOCOUNT ON;

	SELECT Code,AccountTypeName,Status from AccountType where ProdId=@ProdId
END


GO