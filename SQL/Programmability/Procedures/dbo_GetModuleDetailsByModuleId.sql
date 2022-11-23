SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetModuleDetailsByModuleId]
	-- Add the parameters for the stored procedure here
	@ModuleId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@ModuleId=0)
	begin
	select * from Module where  ParentID is null
	end
	else
	begin
	select * from Module where  ParentID =@ModuleId
	end
END




GO