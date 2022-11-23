SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateCOADescriptionById]
	-- Add the parameters for the stored procedure here
	@COAId int,
	@Description nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
declare @AccountId int 
set @AccountId=(select  accountid from coa where coaid=@COAId)

	update coa set Description=@Description where AccountId=@AccountId
END



GO