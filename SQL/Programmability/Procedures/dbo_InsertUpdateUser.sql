SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateUser]
	-- Add the parameters for the stored procedure here
	

	@UserId int,
	@Name nvarchar(50),
	@Title nvarchar(50),
	@Email nvarchar(100),
	@Status bit,
	@createdby int,

	@GroupBatchAccess bit,
	@CanClose bit,
	@AllBatchAccess bit,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

if not exists (select * from CAUsers where UserID=@UserId)
begin
	INSERT INTO [CAUsers]([UserID],[ProdID],[Name],[Title],[Email],[Status],[Createddate],[createdby]
           ,[GroupBatchAccess],[CanClose],[AllBatchAccess])
     VALUES
           (@UserId,@ProdId,@Name,@Title,@Email,@Status,GETDATE(),@createdby,@GroupBatchAccess,@CanClose,@AllBatchAccess)



end
else
begin
		
		update  [CAUsers] set[Name]=@Name,Email=@Email,[Title]=@Title,[Status]=@Status,[modifieddate]=GETDATE(),
		[modifiedby]=@UserId,[GroupBatchAccess]=@GroupBatchAccess,[CanClose]=@CanClose,[AllBatchAccess]=@AllBatchAccess where UserID=@UserId




		

end
  select  @UserId;
		  
END

 


 


GO