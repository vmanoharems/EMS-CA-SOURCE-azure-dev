SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateUserStatusAdmin]
	-- Add the parameters for the stored procedure here
	@UserId int,
	@Status bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update CAUserAdmin set Status =@Status where UserID=@UserId
END



GO