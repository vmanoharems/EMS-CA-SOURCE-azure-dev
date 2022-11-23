SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateAdminUser]
	-- Add the parameters for the stored procedure here
	@UserId int,
	@Email nvarchar(100),
	@password nvarchar(50),
	@AuthCode nvarchar(50),
	@AccountStatus nvarchar(50),
	@Status  bit,
	@CreatedBy int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@UserId=0)
	begin
	

	INSERT INTO [dbo].[CAUserAdmin]([Email],[Password],[AuthenticationCode],[Accountstatus],[Status]
           ,[Createddate],[createdby])
     VALUES
           (@Email,@password,@AuthCode,@AccountStatus,@Status,GETDATE(),@CreatedBy)


		   set @UserId= SCOPE_IDENTITY()
		   end
		   else
		   begin
update  [dbo].[CAUserAdmin] set Email=@Email,[Status]=@Status,[modifieddate]=GETDATE(),[modifiedby]=@CreatedBy where UserID=@UserId
		   end

		   select @UserId
END





GO