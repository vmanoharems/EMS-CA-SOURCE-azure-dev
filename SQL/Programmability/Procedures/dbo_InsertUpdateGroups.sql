SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[InsertUpdateGroups] -- InsertUpdateGroups 0,'NewG',3,1,1
	-- Add the parameters for the stored procedure here
	@GroupId int,
	@Groupname nvarchar(50),
	@Prodid int,
	@Status nvarchar(20),
	@CreatedBy int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Insert statements for procedure here
	declare @print int
	if(@GroupId=0)
	begin

	if not exists(select * From CompanyGroup where GroupName=@Groupname)
	begin
		insert into CompanyGroup(GroupName,Prodid,Status,Createddate,CreatedBy,AllCompanyFlag,AllowPeriodClose,GroupBatchAccess)values(@Groupname,@Prodid,@Status,GETDATE(),@CreatedBy,0,0,0)
		set @GroupId= SCOPE_IDENTITY() 
	select @GroupId
		
	end
	
end
	else
	begin
		update CompanyGroup set GroupName=@Groupname,
		Status=@Status,modifieddate=GETDATE(),ModifiedBy=@CreatedBy where GroupId=@GroupId
		select @GroupId

		
	end
	
	END

	


	




GO