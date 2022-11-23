SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdatePermission]
	-- Add the parameters for the stored procedure here
	@GroupId int,
	@ModuleId int,
	@Access nvarchar(20),
	@CreatedBy int,
	@ProdID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if exists (select * from GroupPermission where GroupID=@GroupId and ModuleID=@ModuleId)
	begin
 update GroupPermission set Access=@Access,ModifiedBy=@CreatedBy,ModifiedDate=GETDATE()
 where GroupID=@GroupId and ModuleID=@ModuleId
 select @ModuleId;
	end
	else
	begin 

	insert into GroupPermission (GroupID,ModuleID,Access,ProdID,CreatedBy,CreatedDate)
	values(@GroupId,@ModuleId,@Access,@ProdID,@CreatedBy,GETDATE())

	select @ModuleId;
	end
END


GO