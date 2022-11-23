SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetAllAccountType]

@ProdId int
AS
BEGIN

	SET NOCOUNT ON;

	SELECT AccountTypeID,Code,AccountTypeName,Above as Status from AccountType where ProdId=@ProdId
END



GO